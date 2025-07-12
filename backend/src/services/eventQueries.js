const connection = require("../../config/db");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const generateId = (prefix = "") =>
  `${prefix}${crypto.randomBytes(4).toString("hex")}`;

const getEventNotificationsByParentId = async (accountId) => {
  const client = await connection.connect();
  try {
    const { rows } = await client.query(
      `SELECT 
         en.notification_id,
         en.notification_status,
         en.sent_at,
         me.event_type,
         me.event_title,
         me.event_datetime,
         me.severity_level,
         s.full_name AS student_name,
         s.class_name
       FROM event_notifications en
       JOIN medical_events me ON en.event_id = me.event_id
       JOIN students s ON me.student_id = s.student_id
       WHERE en.parent_account_id = $1
       ORDER BY en.sent_at DESC`,
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
      message: "Tạo sự kiện y tế thành công, đã lưu file (nếu có) và gửi thông báo.",
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
  medication_type = "TEMPORARY", // default nếu frontend không gửi
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

module.exports = {
  getEventNotificationsByParentId,
  createClassHealthCheckupService,
  createMedicalEventService,
  createParentMedicationRequestService,
};
