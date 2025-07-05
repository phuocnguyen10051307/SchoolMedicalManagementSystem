const connection = require("../../config/db");

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

const getPeriodicCheckupsByParentId = async (accountId) => {
  const client = await connection.connect();
  try {
    const { rows } = await client.query(
      `SELECT 
          me.event_id,
          me.event_title,
          me.event_datetime,
          me.severity_level,
          s.full_name AS student_name,
          s.class_name
    FROM medical_events me
    JOIN students s ON me.student_id = s.student_id
    JOIN parents p ON s.student_id = p.student_id
    WHERE me.event_type = 'fever'
      AND p.account_id = $1 
    ORDER BY me.event_datetime DESC;
    `,
      [accountId]
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
};