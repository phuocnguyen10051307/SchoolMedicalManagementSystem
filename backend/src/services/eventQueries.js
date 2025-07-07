const connection = require("../../config/db");

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


module.exports = {
  getEventNotificationsByParentId,
  getPeriodicCheckupsByParentId,
  getVaccinationNotificationsByParent
};