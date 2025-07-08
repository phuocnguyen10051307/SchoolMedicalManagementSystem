const connection = require("../../config/db");
 const { v4: uuidv4 } = require("uuid");

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
const createClassHealthCheckupService = async ({ nurse_account_id, checkup_date, checkup_type, notes }) => {
  const client = await connection.connect();
  try {
    await client.query("BEGIN");

    // 1. Lấy danh sách học sinh từ lớp mà y tá quản lý
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

      // 2. Tạo record health_checkup
      await client.query(
        `INSERT INTO health_checkups (
          checkup_id, student_id, checkup_date, checkup_type, status, notes, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, 'PENDING', $5, NOW(), NOW())`,
        [checkup_id, student_id, checkup_date, checkup_type, notes]
      );

      // 3. Lấy danh sách phụ huynh của học sinh
      const { rows: parents } = await client.query(
        `SELECT a.account_id
         FROM parents p
         JOIN accounts a ON a.account_id = p.account_id
         WHERE p.student_id = $1`,
        [student_id]
      );

      // 4. Gửi thông báo cho phụ huynh
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
    return { message: "Tạo sự kiện kiểm tra định kỳ và gửi thông báo thành công" };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};


module.exports = {
  getEventNotificationsByParentId, 
  createClassHealthCheckupService
};