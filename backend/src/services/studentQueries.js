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
    const { rows } = await client.query(
      `SELECT h.*, s.full_name AS student_name, s.class_name  FROM health_profiles h
       JOIN students s ON h.student_id = s.student_id
       JOIN parents p ON s.student_id = p.student_id 
       WHERE p.account_id = $1`,
      [userid]
    );
    return rows[0];
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

const getFullStudentProfile = async (accountId) => {
  const client = await db.connect();
  try {
    const studentRes = await client.query(
      `       
SELECT s.*
FROM students s
WHERE s.student_id = $1
LIMIT 1
    `,
      [accountId]
    );

    if (studentRes.rows.length === 0) return null;
    const student = studentRes.rows[0];

    const parentsRes = await client.query(
      `
      SELECT 
        p.relationship_type,
        p.occupation,
        acc.full_name,
        acc.email,
        acc.phone_number,
        acc.avatar_url
      FROM parents p
      JOIN accounts acc ON acc.account_id = p.account_id
      WHERE p.student_id = $1
    `,
      [student.student_id]
    );

    student.parents = parentsRes.rows;

    return student;
  } finally {
    client.release();
  }
};
const getStudentHealthProfileData = async (accountId) => {
  const client = await db.connect();
  try {
    // Lấy student_id từ account cha/mẹ
    const studentRes = await client.query(
      `
      SELECT s.*
      FROM students s
      JOIN parents p ON p.student_id = s.student_id
      WHERE p.account_id = $1
      LIMIT 1
    `,
      [accountId]
    );

    if (studentRes.rows.length === 0) return null;
    const student = studentRes.rows[0];

    const healthRes = await client.query(
      `
      SELECT *
      FROM health_profiles
      WHERE student_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `,
      [student.student_id]
    );

    const healthProfile = healthRes.rows[0] || null;

    return {
      student,
      health_profile: healthProfile,
    };
  } finally {
    client.release();
  }
};

module.exports = {
  getInformationOfStudent,
  getHeathProfiles,
  getFullStudentProfile,
  getStudentHealthProfileData,
};
