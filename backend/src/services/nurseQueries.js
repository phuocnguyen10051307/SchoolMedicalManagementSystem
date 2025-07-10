const connection = require("../../config/db");

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

module.exports = {
  getNurseClassList,
  getVaccinationSchedulesByNurse
};
