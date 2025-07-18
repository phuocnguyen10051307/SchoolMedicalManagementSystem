const connection = require("../../config/db");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../utils/mailer");
const createVaccinationScheduleServiceByManager = async ({
  account_id,
  vaccine_name,
  vaccination_date,
  target_age_group,
}) => {
  const client = await connection.connect();

  try {
    // Kiểm tra vai trò tài khoản
    const { rows } = await client.query(
      `SELECT role_id FROM accounts WHERE account_id = $1`,
      [account_id]
    );

    if (rows.length === 0) {
      throw { status: 404, message: "Không tìm thấy tài khoản." };
    }

    if (rows[0].role_id !== "MANAGER") {
      throw {
        status: 403,
        message: "Bạn không có quyền thêm lịch tiêm chủng.",
      };
    }

    // Kiểm tra ngày tiêm chủng
    if (new Date(vaccination_date) < new Date()) {
      throw {
        status: 400,
        message: "Ngày tiêm chủng không được nhỏ hơn ngày hiện tại.",
      };
    }

    const schedule_id = `vs_${uuidv4().slice(0, 8)}`;
    const now = new Date();

    await client.query(
      `INSERT INTO vaccination_schedules (
        schedule_id, vaccine_name, vaccination_date, target_age_group, status, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, 'PENDING', $5, $5
      )`,
      [schedule_id, vaccine_name, vaccination_date, target_age_group, now]
    );

    return { message: "Tạo lịch tiêm chủng thành công", schedule_id };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};
const fetchAllStudents = async () => {
  const client = await connection.connect();
  try {
    const { rows } = await client.query(`SELECT * FROM students`);
    return rows;
  } finally {
    client.release();
  }
};

const fetchAllNurses = async () => {
  const client = await connection.connect();
  try {
    const { rows } = await client.query(`
      SELECT *
      FROM accounts
      WHERE role_id = 'NURSE'
    `);
    return rows;
  } finally {
    client.release();
  }
};

const fetchAllParents = async () => {
  const client = await connection.connect();
  try {
    const { rows } = await client.query(`
      SELECT account_id, full_name, email, phone_number
      FROM accounts
      WHERE role_id = 'PARENT'
    `);
    return rows;
  } finally {
    client.release();
  }
};
const fetchAllClasses = async () => {
  const client = await connection.connect();
  try {
    const { rows } = await client.query(`
      SELECT DISTINCT class_name FROM students ORDER BY class_name
    `);
    return rows;
  } finally {
    client.release();
  }
};

const fetchStudentsByClass = async (className) => {
  const client = await connection.connect();
  try {
    const { rows } = await client.query(
      `SELECT * FROM students WHERE class_name = $1`,
      [className]
    );
    return rows;
  } finally {
    client.release();
  }
};

const fetchParentsByClass = async (className) => {
  const client = await connection.connect();
  try {
    const { rows } = await client.query(
      `
      SELECT a.account_id, a.full_name, a.email, a.phone_number
      FROM accounts a
      JOIN parents p ON a.account_id = p.account_id
      JOIN students s ON p.student_id = s.student_id
      WHERE a.role_id = 'PARENT' AND s.class_name = $1
    `,
      [className]
    );
    return rows;
  } finally {
    client.release();
  }
};

const insertStudent = async (studentData) => {
  const client = await connection.connect();
  try {
    const student_id = uuidv4().slice(0, 8);
    const student_code = `STU${student_id.slice(0, 4)}`;

    const query = `
      INSERT INTO students (
        student_id, student_code, full_name, date_of_birth, class_name,
        avatar_url, address,
        father_full_name, father_phone_number, father_email, father_identity_number, father_occupation,
        mother_full_name, mother_phone_number, mother_email, mother_identity_number, mother_occupation,
        guardian_full_name, guardian_phone_number, guardian_email, guardian_identity_number, guardian_occupation
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7,
        $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17,
        $18, $19, $20, $21, $22
      )
    `;

    const values = [
      student_id,
      student_code,
      studentData.full_name,
      studentData.date_of_birth,
      studentData.class_name,
      studentData.avatar_url,
      studentData.address,
      studentData.father_full_name,
      studentData.father_phone_number,
      studentData.father_email,
      studentData.father_identity_number,
      studentData.father_occupation,
      studentData.mother_full_name,
      studentData.mother_phone_number,
      studentData.mother_email,
      studentData.mother_identity_number,
      studentData.mother_occupation,
      studentData.guardian_full_name,
      studentData.guardian_phone_number,
      studentData.guardian_email,
      studentData.guardian_identity_number,
      studentData.guardian_occupation,
    ];

    await client.query(query, values);

    return { student_id, student_code };
  } finally {
    client.release();
  }
};
const insertNurse = async (nurseData) => {
  const client = await connection.connect();
  try {
    await client.query("BEGIN");

    const account_id = uuidv4().slice(0, 8);
    const username = `nurse_${account_id.slice(0, 4)}`;
    const hashedPassword = `${account_id}_@${account_id.slice(0,2)}` // Hoặc password từ FE

    // Insert vào bảng accounts
    const insertAccountQuery = `
      INSERT INTO accounts (
        account_id, username, password, email, phone_number, full_name, role_id, account_status, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, 'NURSE', 'ACTIVE', NOW()
      )
    `;
    const accountValues = [
      account_id,
      username,
      hashedPassword,
      nurseData.email,
      nurseData.phone_number,
      nurseData.full_name
    ];
    await client.query(insertAccountQuery, accountValues);

    // Insert vào bảng nurse_classes
    if (nurseData.assigned_class) {
      const assignment_id = uuidv4().slice(0, 8);
      const insertClassQuery = `
        INSERT INTO nurse_classes (
          assignment_id, nurse_account_id, class_name
        ) VALUES ($1, $2, $3)
      `;
      await client.query(insertClassQuery, [assignment_id, account_id, nurseData.assigned_class]);
    }

    await client.query("COMMIT");
    return { account_id, username };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

module.exports = {
  createVaccinationScheduleServiceByManager,
  fetchAllStudents,
  fetchAllNurses,
  fetchAllParents,
  fetchAllClasses,
  fetchStudentsByClass,
  fetchParentsByClass,
  insertStudent,
   insertNurse
};
