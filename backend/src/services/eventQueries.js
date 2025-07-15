const connection = require("../../config/db");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const parseAgeGroup = require("../utils/ageUtils");
const generateId = (prefix = "") =>
  `${prefix}${crypto.randomBytes(4).toString("hex")}`;

const getEventNotificationsByParentId = async (accountId) => {
  const client = await connection.connect();
  try {
    const { rows } = await client.query(
      `SELECT en.*, me.event_title, me.event_description, me.event_datetime, s.full_name AS student_name
FROM event_notifications en
JOIN medical_events me ON en.event_id = me.event_id
JOIN students s ON me.student_id = s.student_id
WHERE en.parent_account_id = $1`,
      [accountId]
    );
    return rows;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};
const createClassHealthCheckupService = async ({
  nurse_account_id,
  checkup_date,
  checkup_type,
  notes,
}) => {
  const client = await connection.connect();
  try {
    await client.query("BEGIN");

    const { rows: students } = await client.query(
      `SELECT s.student_id
       FROM nurse_classes nc
       JOIN students s ON s.class_name = nc.class_name
       WHERE nc.nurse_account_id = $1`,
      [nurse_account_id]
    );

    for (const student of students) {
      const checkup_id = uuidv4();
      const student_id = student.student_id;

      await client.query(
        `INSERT INTO health_checkups (
          checkup_id, student_id, checkup_date, checkup_type, status, notes, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, 'PENDING', $5, NOW(), NOW())`,
        [checkup_id, student_id, checkup_date, checkup_type, notes]
      );

      const { rows: parents } = await client.query(
        `SELECT a.account_id
         FROM parents p
         JOIN accounts a ON a.account_id = p.account_id
         WHERE p.student_id = $1`,
        [student_id]
      );

      for (const parent of parents) {
        const notification_id = uuidv4();
        await client.query(
          `INSERT INTO checkup_notifications (
            notification_id, checkup_id, parent_account_id, notification_status, sent_at
          ) VALUES ($1, $2, $3, 'SENT', NOW())`,
          [notification_id, checkup_id, parent.account_id]
        );
      }
    }

    await client.query("COMMIT");
    return {
      message: "Tạo sự kiện kiểm tra định kỳ và gửi thông báo thành công",
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const createMedicalEventService = async ({
  nurse_account_id,
  student_id,
  event_type,
  event_title,
  event_description,
  event_datetime,
  reported_by,
  severity_level,
  location,
  follow_up_action,
  medication_description,
  file_url,
  file_type = "image",
}) => {
  const client = await connection.connect();
  console.log("Received medical event data:", {
    nurse_account_id,
    student_id,
    event_type,
    event_title,
    event_description,
    event_datetime,
    reported_by,
    severity_level,
    location,
    follow_up_action,
    medication_description,
    file_url,
    file_type,
  });

  try {
    await client.query("BEGIN");

    // 1. Kiểm tra quyền y tá
    const { rowCount } = await client.query(
      `SELECT 1 FROM nurse_classes nc
       JOIN students s ON s.class_name = nc.class_name
       WHERE nc.nurse_account_id = $1 AND s.student_id = $2`,
      [nurse_account_id, student_id]
    );

    if (rowCount === 0) {
      throw new Error("Bạn không có quyền tạo sự kiện cho học sinh này");
    }

    // 2. Tạo event
    const event_id = `ei_${uuidv4().slice(0, 8)}`;

    await client.query(
      `INSERT INTO medical_events (
        event_id, student_id, nurse_account_id, event_type, event_title,
        event_description, event_datetime, reported_by, severity_level,
        location, follow_up_action, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11, NOW(), NOW()
      )`,
      [
        event_id,
        student_id,
        nurse_account_id,
        event_type,
        event_title,
        event_description,
        event_datetime,
        reported_by,
        severity_level,
        location,
        follow_up_action,
      ]
    );

    // 3. Nếu có thuốc
    if (medication_description) {
      const event_medication_id = `em_${uuidv4().slice(0, 8)}`;
      await client.query(
        `INSERT INTO event_medications (
          event_medication_id, event_id, medication_name, dosage, administration_method,
          administered_by_id, administered_at, notes
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, NOW(), NULL
        )`,
        [
          event_medication_id,
          event_id,
          medication_description,
          "Không rõ",
          "Không rõ",
          nurse_account_id,
        ]
      );
    }

    // 4. Nếu có ảnh
    if (file_url) {
      const file_id = `ef_${uuidv4().slice(0, 8)}`;
      await client.query(
        `INSERT INTO event_files (
          file_id, event_id, file_url, file_type, uploaded_by_id, uploaded_at
        ) VALUES ($1, $2, $3, $4, $5, NOW())`,
        [file_id, event_id, file_url, file_type, nurse_account_id]
      );
    }

    // 5. Gửi thông báo cho phụ huynh
    const { rows: parents } = await client.query(
      `SELECT a.account_id FROM parents p
       JOIN accounts a ON a.account_id = p.account_id
       WHERE p.student_id = $1`,
      [student_id]
    );

    for (const parent of parents) {
      await client.query(
        `INSERT INTO event_notifications (
          notification_id, event_id, parent_account_id,
          notification_status, sent_at
        ) VALUES ($1, $2, $3, 'SENT', NOW())`,
        [`en_${uuidv4().slice(0, 8)}`, event_id, parent.account_id]
      );
    }

    await client.query("COMMIT");

    return {
      message:
        "Tạo sự kiện y tế thành công, đã lưu file (nếu có) và gửi thông báo.",
      event_id,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
const updateMedicalEventService = async ({
  event_id,
  nurse_account_id,
  student_id,
  event_type,
  event_title,
  event_description,
  event_datetime,
  reported_by,
  severity_level,
  location,
  follow_up_action,
  medication_description,
  file_url,
  file_type = "image",
}) => {
  const client = await connection.connect();
  try {
    await client.query("BEGIN");

    const { rowCount } = await client.query(
      `SELECT 1 FROM nurse_classes nc
       JOIN students s ON s.class_name = nc.class_name
       WHERE nc.nurse_account_id = $1 AND s.student_id = $2`,
      [nurse_account_id, student_id]
    );

    if (rowCount === 0) {
      throw new Error("Bạn không có quyền cập nhật sự kiện cho học sinh này");
    }

    await client.query(
      `UPDATE medical_events SET
        event_type = $1,
        event_title = $2,
        event_description = $3,
        event_datetime = $4,
        reported_by = $5,
        severity_level = $6,
        location = $7,
        follow_up_action = $8,
        updated_at = NOW()
      WHERE event_id = $9`,
      [
        event_type,
        event_title,
        event_description,
        event_datetime,
        reported_by,
        severity_level,
        location,
        follow_up_action,
        event_id,
      ]
    );

    await client.query(`DELETE FROM event_medications WHERE event_id = $1`, [
      event_id,
    ]);

    if (medication_description) {
      const event_medication_id = `em_${uuidv4().slice(0, 8)}`;
      await client.query(
        `INSERT INTO event_medications (
          event_medication_id, event_id, medication_name, dosage, administration_method,
          administered_by_id, administered_at, notes
        ) VALUES (
          $1, $2, $3, $4, $5, $6, NOW(), NULL
        )`,
        [
          event_medication_id,
          event_id,
          medication_description,
          "Không rõ",
          "Không rõ",
          nurse_account_id,
        ]
      );
    }

    await client.query(`DELETE FROM event_files WHERE event_id = $1`, [
      event_id,
    ]);

    if (file_url) {
      const file_id = `ef_${uuidv4().slice(0, 8)}`;
      await client.query(
        `INSERT INTO event_files (
          file_id, event_id, file_url, file_type, uploaded_by_id, uploaded_at
        ) VALUES ($1, $2, $3, $4, $5, NOW())`,
        [file_id, event_id, file_url, file_type, nurse_account_id]
      );
    }

    await client.query("COMMIT");

    return {
      message: "Cập nhật sự kiện y tế thành công",
      event_id,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const createParentMedicationRequestService = async ({
  student_id,
  medication_name,
  dosage,
  instructions,
  notes,
  medication_type = "TEMPORARY",
  requested_by_id,
}) => {
  const client = await connection.connect();
  try {
    const request_id = uuidv4();

    await client.query(
      `INSERT INTO parent_medication_requests (
        request_id, student_id, medication_name, dosage, instructions, notes,
        medication_type, request_status, requested_by_id, requested_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, 'PENDING', $8, NOW()
      )`,
      [
        request_id,
        student_id,
        medication_name,
        dosage,
        instructions,
        notes,
        medication_type,
        requested_by_id,
      ]
    );

    return { request_id };
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

const getPeriodicCheckupsByParentId = async (accountId) => {
  const client = await connection.connect();
  try {
    const { rows } = await client.query(
      `SELECT cn.*, hc.checkup_date, ct.display_name AS checkup_type, cr.result_details, s.full_name AS student_name
FROM checkup_notifications cn
JOIN health_checkups hc ON cn.checkup_id = hc.checkup_id
JOIN checkup_types ct ON hc.checkup_type = ct.checkup_type
LEFT JOIN checkup_results cr ON hc.checkup_id = cr.checkup_id
JOIN students s ON hc.student_id = s.student_id
WHERE cn.parent_account_id = $1`,
      [accountId]
    );
    return rows;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

const getVaccinationNotificationsByParent = async (accountId) => {
  const client = await connection.connect();
  try {
    const { rows } = await client.query(
      `SELECT vn.*, vs.vaccine_name, sv.status AS student_vaccine_status, vr.result_status, s.full_name AS student_name
FROM vaccination_notifications vn
JOIN student_vaccination sv ON vn.student_vaccination_id = sv.student_vaccination_id
JOIN vaccination_schedules vs ON sv.schedule_id = vs.schedule_id
LEFT JOIN vaccination_results vr ON sv.student_vaccination_id = vr.student_vaccination_id
JOIN students s ON sv.student_id = s.student_id
WHERE vn.parent_account_id = $1`,
      [accountId]
    );
    return rows;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};
const getCheckupTypesService = async () => {
  const client = await connection.connect();
  try {
    const { rows } = await client.query(
      `SELECT checkup_type, display_name, description FROM checkup_types`
    );
    return rows;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};
const activateVaccinationScheduleByNurseService = async ({
  nurse_account_id,
  schedule_id,
  notes,
}) => {
  const client = await connection.connect();

  try {
    await client.query("BEGIN");

    // 1. Kiểm tra lịch tiêm tồn tại và đang PENDING
    const scheduleRes = await client.query(
      `SELECT * FROM vaccination_schedules WHERE schedule_id = $1 AND status = 'PENDING'`,
      [schedule_id]
    );

    if (scheduleRes.rows.length === 0) {
      throw new Error("Lịch tiêm không tồn tại hoặc đã được kích hoạt.");
    }

    const schedule = scheduleRes.rows[0];

    // 2. Cập nhật trạng thái lịch sang ACTIVE
    await client.query(
      `UPDATE vaccination_schedules
       SET status = 'ACTIVE', updated_at = NOW()
       WHERE schedule_id = $1`,
      [schedule_id]
    );

    // 3. Tìm học sinh phù hợp nhóm tuổi
    const { minDate, maxDate } = parseAgeGroup(
      schedule.target_age_group,
      schedule.vaccination_date
    );

    const studentsRes = await client.query(
      `SELECT student_id FROM students WHERE date_of_birth BETWEEN $1 AND $2`,
      [minDate, maxDate]
    );

    if (studentsRes.rows.length === 0) {
      throw new Error("Không có học sinh phù hợp với nhóm tuổi.");
    }

    // 4. Gán lịch cho học sinh + gửi thông báo
    for (const student of studentsRes.rows) {
      const student_id = student.student_id;
      const student_vaccination_id = `sv_${uuidv4().slice(0, 8)}`;

      await client.query(
        `INSERT INTO student_vaccination (
          student_vaccination_id, student_id, schedule_id,
          status, consent_status, vaccination_date, created_at, updated_at
        ) VALUES (
          $1, $2, $3, 'PENDING', 'WAITING', $4, NOW(), NOW()
        )`,
        [
          student_vaccination_id,
          student_id,
          schedule_id,
          schedule.vaccination_date,
        ]
      );

      const parentRes = await client.query(
        `SELECT account_id FROM parents WHERE student_id = $1`,
        [student_id]
      );

      for (const parent of parentRes.rows) {
        const notification_id = `vn_${uuidv4().slice(0, 8)}`;
        await client.query(
          `INSERT INTO vaccination_notifications (
            notification_id, student_vaccination_id, parent_account_id,
            notification_status, sent_at, notes, sent_by_nurse_id
          ) VALUES (
            $1, $2, $3, 'SENT', NOW(), $4, $5
          )`,
          [
            notification_id,
            student_vaccination_id,
            parent.account_id,
            notes,
            nurse_account_id,
          ]
        );
      }
    }

    await client.query("COMMIT");
    return {
      message: "Đã kích hoạt lịch tiêm và gửi thông báo thành công.",
      schedule_id,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(" Lỗi kích hoạt lịch tiêm:", err.message);
    throw err;
  } finally {
    client.release();
  }
};

const getVaccinationSchedulesService = async () => {
  const client = await connection.connect();
  try {
    const { rows } = await client.query(`
    SELECT vs.*, 
    EXISTS (
      SELECT 1 
      FROM vaccination_notifications vn
      JOIN student_vaccination sv ON vn.student_vaccination_id = sv.student_vaccination_id
      WHERE sv.schedule_id = vs.schedule_id
    ) AS is_sent
    FROM vaccination_schedules vs
    ORDER BY vaccination_date DESC;
    `);
    return rows;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

const getApprovedMedicationReceiptsByNurse = async (nurse_account_id) => {
  const client = await connection.connect();
  try {
    const { rows } = await client.query(
      `SELECT 
         r.request_id,
         s.full_name AS student_name,
         s.class_name,
         r.medication_name,
         r.dosage,
         r.instructions,
         r.notes,
         r.medication_type,
         r.requested_at,
         r.reviewed_at,
         nmr.received_quantity,
         nmr.received_at
       FROM nurse_medication_receipts nmr
       JOIN parent_medication_requests r ON nmr.request_id = r.request_id
       JOIN students s ON r.student_id = s.student_id
       WHERE nmr.nurse_account_id = $1
       AND r.request_status = 'APPROVED'
       ORDER BY nmr.received_at DESC`,
      [nurse_account_id]
    );

    return rows;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};
const getPendingMedicationRequestsByNurse = async (nurse_account_id) => {
  const client = await connection.connect();
  try {
    const { rows } = await client.query(
      `SELECT 
         r.request_id,
         s.full_name AS student_name,
         s.class_name,
         r.medication_name,
         r.dosage,
         r.instructions,
         r.notes,
         r.medication_type,
         r.requested_at
       FROM parent_medication_requests r
       JOIN students s ON r.student_id = s.student_id
       JOIN nurse_classes nc ON s.class_name = nc.class_name
       WHERE nc.nurse_account_id = $1
         AND r.request_status = 'PENDING'
       ORDER BY r.requested_at DESC`,
      [nurse_account_id]
    );

    return rows;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};


module.exports = {
  getEventNotificationsByParentId,
  getPeriodicCheckupsByParentId,
  getVaccinationNotificationsByParent,
  createClassHealthCheckupService,
  createMedicalEventService,
  createParentMedicationRequestService,
  updateMedicalEventService,
  getCheckupTypesService,
  activateVaccinationScheduleByNurseService,
  getVaccinationSchedulesService,
  getApprovedMedicationReceiptsByNurse,
  getPendingMedicationRequestsByNurse
};
