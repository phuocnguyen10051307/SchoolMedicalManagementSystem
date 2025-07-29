const connection = require("../../config/db");
const { v4: uuidv4 } = require("uuid");
const getInforNurse = async (account_id) => {
  const client = await connection.connect();
  try {
    const { rows } = await client.query(
      `
      SELECT 
        a.full_name,
        a.phone_number,
        a.email,
        a.avatar_url,
        a.date_of_birth,
        a.role_id,
        ARRAY_AGG(nc.class_name) AS class_names
      FROM accounts a
      JOIN nurse_classes nc ON nc.nurse_account_id = a.account_id 
      WHERE a.account_id = $1
      GROUP BY 
        a.full_name, 
        a.phone_number, 
        a.email, 
        a.avatar_url, 
        a.date_of_birth,
        a.role_id
      `,
      [account_id]
    );
    return rows[0];
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};
const updateNurseInfo = async (
  account_id,
  full_name,
  phone_number,
  email,
  avatar_url,
  date_of_birth
) => {
  const client = await connection.connect();
  try {
    await client.query(
      `
      UPDATE accounts
      SET 
        full_name = $1,
        phone_number = $2,
        email = $3,
        avatar_url = $4,
        date_of_birth = $5
      WHERE account_id = $6
      `,
      [full_name, phone_number, email, avatar_url, date_of_birth, account_id]
    );
    return {
      message: "Nurse info updated successfully (excluding class assignment).",
    };
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

const confirmParentMedicationReceiptService = async ({
  request_id,
  nurse_account_id,
  received_quantity,
}) => {
  const client = await connection.connect();
  console.log(request_id, nurse_account_id);
  try {
    await client.query("BEGIN");
    const { rows: requests } = await client.query(
      `SELECT student_id FROM parent_medication_requests WHERE request_id = $1 AND request_status = 'PENDING'`,
      [request_id]
    );

    if (requests.length === 0) {
      throw new Error("Không tìm thấy yêu cầu thuốc hợp lệ");
    }

    const student_id = requests[0].student_id;
    const { rowCount } = await client.query(
      `SELECT 1
       FROM nurse_classes nc
       JOIN students s ON s.class_name = nc.class_name
       WHERE nc.nurse_account_id = $1 AND s.student_id = $2`,
      [nurse_account_id, student_id]
    );

    if (rowCount === 0) {
      throw {
        status: 403,
        message: "Bạn không có quyền nhận thuốc của học sinh này",
      };
    }

    await client.query(
      `UPDATE parent_medication_requests
       SET request_status = 'APPROVED', reviewed_by_id = $1, reviewed_at = NOW()
       WHERE request_id = $2`,
      [nurse_account_id, request_id]
    );
    const receipt_id = uuidv4();

    await client.query(
      `INSERT INTO nurse_medication_receipts (
        receipt_id, request_id, nurse_account_id, received_at, received_quantity, status
      ) VALUES (
        $1, $2, $3, NOW(), $4, 'RECEIVED'
      )`,
      [receipt_id, request_id, nurse_account_id, received_quantity]
    );

    await client.query("COMMIT");

    return { receipt_id };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
const getPendingRequestsForNurse = async (nurse_id) => {
  const client = await connection.connect();
  try {
    const { rows } = await client.query(
      `
      SELECT 
        r.request_id,
        r.student_id,
        s.full_name AS student_name,
        s.class_name,
        r.medication_name,
        r.dosage,
        r.instructions,
        r.notes,
        r.medication_type,
        r.requested_at
      FROM parent_medication_requests r
      JOIN students s ON s.student_id = r.student_id
      JOIN nurse_classes nc ON nc.class_name = s.class_name
      WHERE r.request_status = 'PENDING'
        AND nc.nurse_account_id = $1
      ORDER BY r.requested_at DESC
      `,
      [nurse_id]
    );

    return rows;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};
const getNurseClassList = async (nurseId) => {
  const client = await connection.connect();
  try {
    const { rows } = await client.query(
      `SELECT class_name
       FROM nurse_classes
       WHERE nurse_account_id = $1
       ORDER BY class_name`,
      [nurseId]
    );
    return rows;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};
const getStudentName = async (class_name) => {
  const client = await connection.connect();
  try {
    const { rows } = await client.query(
      `select s.student_id, s.full_name from students s where s.class_name = $1`,
      [class_name]
    );
    return rows;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};
const getMedicalEventsByNurseId = async (nurse_id) => {
  const client = await connection.connect();
  try {
    const { rows } = await client.query(
      `SELECT me.*, s.full_name AS student_name, s.class_name
       FROM medical_events me
       JOIN students s ON me.student_id = s.student_id
       WHERE me.nurse_account_id = $1
       ORDER BY me.created_at DESC`,
      [nurse_id]
    );
    return rows;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

const getVaccinationSchedulesByNurse = async (nurseId) => {
  const client = await connection.connect();
  try {
    const { rows } = await client.query(
      `SELECT 
         s.full_name AS student_name,
         s.class_name,
         vs.vaccine_name,
         vs.vaccination_date,
         vs.target_age_group,
         sv.status AS student_vaccination_status,
         sv.consent_status,
         sv.rejection_reason,
         sv.vaccination_date AS actual_vaccination_date,
         vs.status AS schedule_status
       FROM nurse_classes nc
       JOIN students s ON s.class_name = nc.class_name
       JOIN student_vaccination sv ON sv.student_id = s.student_id
       JOIN vaccination_schedules vs ON sv.schedule_id = vs.schedule_id
       WHERE nc.nurse_account_id = $1
       ORDER BY vs.vaccination_date DESC`,
      [nurseId]
    );
    return rows;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

const getNurseDashboardStats = async (nurse_id) => {
  const client = await connection.connect();
  try {
    // Thống kê loại sự kiện
    const eventTypeResult = await client.query(
      `
      SELECT event_type, COUNT(*) AS total
      FROM medical_events
      WHERE nurse_account_id = $1
      GROUP BY event_type
    `,
      [nurse_id]
    );

    //Thống kê mức độ nghiêm trọng
    const severityResult = await client.query(
      `
      SELECT severity_level, COUNT(*) AS total
      FROM medical_events
      WHERE nurse_account_id = $1
      GROUP BY severity_level
    `,
      [nurse_id]
    );

    // Thống kê số sự kiện theo tháng
    const monthlyEventResult = await client.query(
      `
      SELECT DATE_TRUNC('month', event_datetime) AS month, COUNT(*) AS total
      FROM medical_events
      WHERE nurse_account_id = $1
      GROUP BY month
      ORDER BY month
    `,
      [nurse_id]
    );

    // Thống kê trạng thái yêu cầu thuốc của học sinh do y tá phụ trách
    const medicationStatusResult = await client.query(
      `
      SELECT request_status, COUNT(*) AS count
      FROM parent_medication_requests
      WHERE student_id IN (
        SELECT student_id
        FROM students
        WHERE class_name IN (
          SELECT class_name
          FROM nurse_classes
          WHERE nurse_account_id = $1
        )
      )
      GROUP BY request_status
    `,
      [nurse_id]
    );

    //  Trạng thái xét duyệt hồ sơ sức khỏe
    const healthReviewStatusResult = await client.query(
      `
      SELECT review_status, COUNT(*) AS count
      FROM health_profiles
      WHERE student_id IN (
        SELECT student_id
        FROM students
        WHERE class_name IN (
          SELECT class_name
          FROM nurse_classes
          WHERE nurse_account_id = $1
        )
      )
      GROUP BY review_status
    `,
      [nurse_id]
    );

    return {
      eventTypeStats: eventTypeResult.rows,
      severityStats: severityResult.rows,
      monthlyEventStats: monthlyEventResult.rows,
      medicationRequestStats: medicationStatusResult.rows,
      healthProfileReviewStats: healthReviewStatusResult.rows,
    };
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

const getReportsByNurseService = async (nurse_account_id) => {
  const client = await connection.connect();

  try {
    const query = `
      SELECT 
        me.event_id,
        s.full_name AS student_name,
        me.event_type,
        me.event_title,
        me.event_description,
        me.event_datetime,
        me.severity_level,
        me.location,
        me.follow_up_action,
        me.created_at
      FROM medical_events me
      JOIN students s ON me.student_id = s.student_id
      WHERE me.nurse_account_id = $1
      ORDER BY me.event_datetime DESC
    `;
    const { rows } = await client.query(query, [nurse_account_id]);
    return rows;
  } catch (err) {
    console.error("Lỗi khi lấy báo cáo:", err);
    throw err;
  } finally {
    client.release();
  }
};
const getHealthCheckupsByNurseService = async (nurse_account_id) => {
  const client = await connection.connect();

  try {
    const query = `
      SELECT 
        hc.checkup_id,
        s.full_name AS student_name,
        s.class_name,
        hc.checkup_date,
        ct.display_name AS checkup_type,
        hc.status,
        hc.notes
      FROM health_checkups hc
      JOIN students s ON hc.student_id = s.student_id
      JOIN checkup_types ct ON hc.checkup_type = ct.checkup_type
      WHERE s.class_name IN (
        SELECT class_name FROM nurse_classes WHERE nurse_account_id = $1
      )
      ORDER BY hc.checkup_date DESC
    `;
    const { rows } = await client.query(query, [nurse_account_id]);
    return rows;
  } finally {
    client.release();
  }
};
const getVaccinationReportsByNurseService = async (nurse_account_id) => {
  const client = await connection.connect();
  try {
    const query = `
      SELECT 
        vs.schedule_id,
        vs.vaccine_name,
        vs.vaccination_date,
        vs.target_age_group,
        vs.status,
        COUNT(sv.student_id) AS total_students,
        COUNT(CASE WHEN sv.status = 'COMPLETED' THEN 1 END) AS completed,
        COUNT(CASE WHEN sv.status = 'PENDING' THEN 1 END) AS pending
      FROM vaccination_schedules vs
      JOIN student_vaccination sv ON vs.schedule_id = sv.schedule_id
      JOIN vaccination_notifications vn ON vn.student_vaccination_id = sv.student_vaccination_id
      WHERE vn.sent_by_nurse_id = $1
      GROUP BY vs.schedule_id
      ORDER BY vs.vaccination_date DESC;
    `;
    const { rows } = await client.query(query, [nurse_account_id]);
    return rows;
  } catch (error) {
    console.error("Lỗi truy vấn báo cáo tiêm chủng:", error);
    throw error;
  } finally {
    client.release();
  }
};
const queryGetFilteredSupplies = async (filter, keyword) => {
  const client = await connection.connect();
  try {
    let whereClauses = [];
    let values = [];
    let idx = 1;

    // ----- Lọc theo trạng thái -----
    if (filter === "expiring") {
      whereClauses.push(
        `s.expiration_date BETWEEN NOW() AND NOW() + INTERVAL '4 months'`
      );
    } else if (filter === "expired") {
      whereClauses.push(`s.expiration_date < NOW()`);
    } else if (filter === "out_of_stock") {
      whereClauses.push(`COALESCE(i.quantity, 0) = 0`);
    }

    // ----- Lọc theo tên -----
    if (keyword) {
      whereClauses.push(`LOWER(s.name) LIKE LOWER($${idx++})`);
      values.push(`%${keyword}%`);
    }

    const whereSQL =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const query = `
      SELECT 
        s.supply_id,
        s.name,
        s.supply_type,
        s.unit,
        s.description,
        s.expiration_date,
        s.status,
        i.quantity,
        i.location,
        i.last_restocked_at
      FROM medical_supplies s
      LEFT JOIN supply_inventory i ON s.supply_id = i.supply_id
      ${whereSQL}
      ORDER BY s.name
    `;

    const { rows } = await client.query(query, values);
    return rows;
  } finally {
    client.release();
  }
};

const getHealthCheckupsForParent = async (parentId) => {
  const client = await connection.connect();
  try {
    const query = `
      SELECT hc.checkup_id, hc.student_id, s.full_name AS student_name,
             hc.nurse_account_id, hc.checkup_type, hc.result, hc.checkup_date
      FROM health_checkups hc
      JOIN students s ON hc.student_id = s.student_id
      JOIN accounts a ON s.father_email = a.email OR s.mother_email = a.email
      WHERE a.account_id = $1
      ORDER BY hc.checkup_date DESC
    `;
    const { rows } = await client.query(query, [parentId]);
    return rows;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

const getNurseCheckupList = async (nurseId) => {
  const client = await connection.connect();
  try {
    // 1. Lấy danh sách checkup như cũ
    const listQuery = `
      SELECT
        hc.checkup_id,
        s.full_name AS student_name,
        s.class_name,
        hc.checkup_date,
        hc.checkup_type,
        COALESCE(n.notification_status, 'PENDING') AS notification_status
      FROM health_checkups hc
      JOIN students s ON hc.student_id = s.student_id
      JOIN nurse_classes nc ON s.class_name = nc.class_name
      LEFT JOIN checkup_notifications n ON hc.checkup_id = n.checkup_id
      WHERE nc.nurse_account_id = $1
      ORDER BY hc.checkup_date DESC
    `;
    const { rows: checkupList } = await client.query(listQuery, [nurseId]);

    // 2. Lấy thống kê status theo từng lớp
    const countQuery = `
      SELECT
        s.class_name,
        COUNT(*) FILTER (WHERE COALESCE(n.notification_status, 'PENDING') IN ('PENDING', 'SENT', 'SEEN')) AS pending_count,
        COUNT(*) FILTER (WHERE n.notification_status = 'APPROVED') AS approved_count,
        COUNT(*) FILTER (WHERE n.notification_status = 'REJECT') AS rejected_count
      FROM health_checkups hc
      JOIN students s ON hc.student_id = s.student_id
      JOIN nurse_classes nc ON s.class_name = nc.class_name
      LEFT JOIN checkup_notifications n ON hc.checkup_id = n.checkup_id
      WHERE nc.nurse_account_id = $1
      GROUP BY s.class_name
      ORDER BY s.class_name
    `;
    const { rows: statusCountByClass } = await client.query(countQuery, [
      nurseId,
    ]);

    // 3. Lấy danh sách kiểm tra sức khỏe định kỳ
    const periodicQuery = `
  SELECT
    hc.checkup_id,
    hc.checkup_date,
    ct.display_name AS checkup_type_name
  FROM health_checkups hc
  JOIN checkup_types ct ON hc.checkup_type = ct.checkup_type
  JOIN students s ON hc.student_id = s.student_id
  JOIN nurse_classes nc ON s.class_name = nc.class_name
  WHERE nc.nurse_account_id = $1
  ORDER BY hc.checkup_date DESC
`;
    const { rows: periodicCheckups } = await client.query(periodicQuery, [
      nurseId,
    ]);

    return {
      checkupList,
      statusCountByClass,
      periodicCheckups,
    };
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

const fetchClassStatusByCheckupId = async (checkupId) => {
  const query = `
    SELECT
      s.class_name,
      s.student_id,
      s.full_name AS student_name,
      n.notification_status
    FROM health_checkups hc
    JOIN students s ON hc.student_id = s.student_id
    LEFT JOIN checkup_notifications n ON hc.checkup_id = n.checkup_id AND n.parent_account_id IS NOT NULL
    WHERE hc.checkup_id = $1
  `;
  const { rows } = await connection.query(query, [checkupId]);
  return rows;
};
const getPublicBlogsQuery = async (page = 1, limit = 5) => {
  const offset = (page - 1) * limit;

  const query = `
    SELECT
      blog_id,
      nurse_account_id,
      title,
      content,
      tags,
      visibility_status,
      published_at,
      created_at
    FROM blogs
    WHERE visibility_status = 'PUBLIC'
    ORDER BY published_at DESC
    LIMIT $1 OFFSET $2
  `;

  const result = await connection.query(query, [limit, offset]);

  const countResult = await connection.query(`
    SELECT COUNT(*) FROM blogs WHERE visibility_status = 'PUBLIC'
  `);

  const total = parseInt(countResult.rows[0].count);

  return {
    blogs: result.rows,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
};

module.exports = {
  confirmParentMedicationReceiptService,
  getPendingRequestsForNurse,
  getInforNurse,
  updateNurseInfo,
  getNurseClassList,
  getVaccinationSchedulesByNurse,
  getStudentName,
  getMedicalEventsByNurseId,
  getNurseDashboardStats,
  getReportsByNurseService,
  getHealthCheckupsByNurseService,
  getVaccinationReportsByNurseService,
  queryGetFilteredSupplies,
  getHealthCheckupsForParent,
  getNurseCheckupList,
  fetchClassStatusByCheckupId,
  getPublicBlogsQuery
};
