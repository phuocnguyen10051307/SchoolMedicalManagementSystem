const connection = require("../../config/db");


const getInformationOfStudent = async (userid) => {
  const client = await connection.connect();
  try {
    const { rows } = await client.query(
      `SELECT s.* FROM students s JOIN parents p ON s.student_id = p.student_id WHERE p.account_id = $1`,
      [userid]
    );
    return rows;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};
const getHeathProfiles = async (userid) => {
  const client = await connection.connect();
  try {
    const { rows  } = await client.query(
      `SELECT h.*, s.full_name AS student_name, s.class_name  FROM health_profiles h
       JOIN students s ON h.student_id = s.student_id
       JOIN parents p ON s.student_id = p.student_id 
       WHERE p.account_id = $1`,
      [userid]
    );
    return rows[0] ;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

module.exports = {
  getInformationOfStudent,
  getHeathProfiles,
};