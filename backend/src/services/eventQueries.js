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

const getVaccinationNotificationsByParent = async (accountId) => {
  const client = await connection.connect();
  try {
    const { rows } = await client.query(
      `SELECT 
         vn.notification_id,
         vn.student_vaccination_id,
         vn.notification_status,
         vn.sent_at,
         vn.seen_at,
         vn.acknowledged_at,
         vn.rejection_reason,
         vn.notes
       FROM vaccination_notifications vn
       WHERE vn.parent_account_id = $1
       ORDER BY vn.sent_at DESC`,
      [accountId]
    );
    return rows;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};


module.exports = {
  getEventNotificationsByParentId,
  getPeriodicCheckupsByParentId,
  getVaccinationNotificationsByParent
};