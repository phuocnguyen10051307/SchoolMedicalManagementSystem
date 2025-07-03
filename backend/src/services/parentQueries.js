const connection = require("../../config/db");
const sendEmail = require("../utils/mailer")

const handleParentAccountRequest = async ({
  student_code,
  cccd,
  phone,
  email,
  relationship,
}) => {
  const client = await connection.connect();
  try {
    await client.query("BEGIN");

    const { rows: studentRows } = await client.query(
      `SELECT * FROM students WHERE student_code = $1`,
      [student_code]
    );

    if (studentRows.length === 0) {
      throw new Error("Student code not found");
    }
    const student = studentRows[0];
    const match = (() => {
      if (relationship === "Father") {
        return (
          student.father_identity_number === cccd &&
          (student.father_phone_number === phone ||
            student.father_email === email)
        );
      }
      if (relationship === "Mother") {
        return (
          student.mother_identity_number === cccd &&
          (student.mother_phone_number === phone ||
            student.mother_email === email)
        );
      }
      if (relationship === "Guardian") {
        return (
          student.guardian_identity_number === cccd &&
          (student.guardian_phone_number === phone ||
            student.guardian_email === email)
        );
      }
      return false;
    })();

    const status = match ? "APPROVED" : "REJECTED";

    const { rows: pendingRows } = await client.query(
      `INSERT INTO pending_account_requests
        (request_id, student_code, identity_number, phone_number, email, relationship_type, request_status, requested_at, reviewed_by_id, reviewed_at)
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW(), NULL, NULL)
        RETURNING *`,
      [student_code, cccd, phone, email, relationship, status]
    );

    const request = pendingRows[0];

    if (!match) {
      await client.query("COMMIT");
      return {
        status: "REJECTED",
        message: "Information does not match",
        request,
      };
    }

    const username = `${relationship}_${student_code}`;
    const password = `${student_code}_${Math.floor(Math.random() * 1000) + 1}`;
    const full_name = (() => {
      if (relationship === "Father") return student.father_full_name;
      if (relationship === "Mother") return student.mother_full_name;
      if (relationship === "Guardian") return student.guardian_full_name;
      return "Parent";
    })();

    const { rows: accountRows } = await client.query(
      `INSERT INTO accounts 
        (account_id, username, password, email, phone_number, date_of_birth,address, full_name, avatar_url, role_id, account_status, created_at)
        VALUES (gen_random_uuid(), $1, $2, $3, $4, NULL,NULL, $5, NULL, 'PARENT', 'active', NOW())
        RETURNING *`,
      [username, password, email, phone, full_name]
    );

    const account = accountRows[0];
    const occupation = (() => {
      if (relationship === "Father") return student.father_occupation;
      if (relationship === "Mother") return student.mother_occupation;
      if (relationship === "Guardian") return student.guardian_occupation;
      return "That Nghiep";
    })();
    await client.query(
      `INSERT INTO parents (parent_id, account_id, student_id, relationship_type,occupation)
       VALUES (gen_random_uuid(), $1, $2, $3, $4)`,
      [account.account_id, student.student_id, relationship, occupation]
    );
    await sendEmail(
      email,
      "Tài khoản phụ huynh đã được tạo",
      `<h2>Chào ${full_name},</h2>
   <p>Tài khoản của bạn đã được phê duyệt.</p>
   <p><strong>Username:</strong> ${username}</p>
   <p><strong>Password:</strong> ${password}</p>
   <p>Vui lòng đăng nhập vào hệ thống để sử dụng các tính năng dành cho phụ huynh.</p>`
    );

    await client.query("COMMIT");

    return {
      status: "APPROVED",
      account,
      request,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const getParentByStudentId = async (accountid) => {
  const client = await connection.connect();
  try {
    const { rows } = await client.query(
      `SELECT * FROM parents WHERE account_id = $1`,
      [accountid]
    );
    const parent = rows[0];
    if (!parent) return null;
    if (parent.relationship_type === "Father") {
      const { rows: info } = await client.query(
        `select s.father_email AS email,
         s.father_full_name AS full_name,
         s.father_identity_number AS identity_number,
         s.father_phone_number AS phone_number,
         s.father_occupation AS occupation,
         p.relationship_type,
         s.address AS address,
         s.class_name AS class,
         s.full_name AS student_name
         from parents p join students s on s.student_id = p.student_id where p.account_id = $1`,
        [accountid]
      );
      return info[0] || null;
    } else if (parent.relationship_type === "Mother") {
      const { rows: info } = await client.query(
        `select s.mother_email AS email,
         s.mother_full_name AS full_name,
         s.mother_identity_number AS identity_number,
         s.mother_phone_number AS phone_number,
         s.mother_occupation AS occupation,
         p.relationship_type,
         s.address AS address,
         s.class_name AS class,
         s.full_name AS student_name
         from parents p join students s on s.student_id = p.student_id where p.account_id = $1`,
        [accountid]
      );
      return info[0] || null;
    } else if (parent.relationship_type === "Guardian") {
      const { rows: info } = await client.query(
        `select s.guardian_email AS email,
         s.guardian_full_name AS full_name, 
         s.guardian_identity_number AS identity_number, 
         s.guardian_phone_number AS phone_number, 
         s.guardian_occupation  AS occupation,
         p.relationship_type ,
         s.address AS address,
         s.class_name AS class,
         s.full_name AS student_name
         from parents p join students s on s.student_id = p.student_id where p.account_id = $1`,
        [accountid]
      );
      return info[0] || null;
    }
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

module.exports = {
  handleParentAccountRequest,
  getParentByStudentId,
};
