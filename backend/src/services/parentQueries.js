const connection = require("../../config/db");
const sendEmail = require("../utils/mailer");

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
const putHeathyProfile = async (req, res) => {
  const {
    account_id,
    height,
    weight,
    blood_type,
    chronic_conditions,
    allergies,
    regular_medications,
    additional_notes,
  } = req.body;
  const client = await connection.connect();
  try {
    const { rows: accountUser } = await client.query(
      `select * from accounts a where a.account_id = $1`,
      [account_id]
    );
    const account = accountUser[0];
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }
    if (account.role_id === "PARENT") {
      const { rows: accountParent } = await client.query(
        `SELECT p.*, s.student_id FROM parents p
         JOIN students s ON p.student_id = s.student_id WHERE p.account_id = $1`,
        [account_id]
      );
      if (accountParent.length === 0) {
        return res
          .status(403)
          .json({ error: "Not authorized to access any student" });
      }
      const student_id = accountParent[0].student_id;
      const { rows: existingProfiles } = await client.query(
        `SELECT * FROM health_profiles WHERE student_id = $1`,
        [student_id]
      );
      if (existingProfiles.length === 0) {
        return res.status(404).json({ error: "Health profile not found" });
      }
      await client.query(
        `UPDATE health_profiles 
         SET updated_at = NOW(), review_status = 'pending',
         height_cm=$1, weight_kg=$2, 
         blood_type=$3, chronic_conditions=$4, allergies=$5, regular_medications=$6,
         additional_notes=$7
         WHERE student_id = $8`,
        [
          height,
          weight,
          blood_type,
          chronic_conditions,
          allergies,
          regular_medications,
          additional_notes,
          student_id,
        ]
      );
      return res
        .status(200)
        .json({ message: "Health profile updated (pending review)" });
    }
    return res
      .status(403)
      .json({ error: "Role not permitted to update health profile" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};
const updateProfileParent = async (
  user_id,
  full_name,
  phone_number,
  email,
  date_of_birth,
  occupation,
  address,
  identity_number,
  avatar_url
) => {
  const client = await connection.connect();
  try {
    // Cập nhật bảng accounts
    await client.query(
      `UPDATE public.accounts
       SET email=$1, phone_number=$2, date_of_birth=$3, address=$4, full_name=$5, avatar_url=$6
       WHERE account_id=$7`,
      [
        email,
        phone_number,
        date_of_birth,
        address,
        full_name,
        avatar_url,
        user_id
      ]
    );
    console.log("parentID:", user_id)


    // Lấy thông tin student_id và relationship
    const { rows: studentRows } = await client.query(
      `SELECT s.student_id AS student_id, p.relationship_type AS relationship
       FROM students s
       JOIN parents p ON p.student_id = s.student_id
       WHERE p.account_id = $1`,
      [user_id]
    );

    if (studentRows.length === 0) {
      throw new Error("Parent not linked to a student");
    }

    const student = studentRows[0];
    const relationship = student.relationship;
    const student_id = student.student_id;

    let query = "";
    let values = [];

    if (relationship === "Father") {
      query = `
        UPDATE public.students
        SET address=$1,
            father_full_name=$2,
            father_phone_number=$3,
            father_email=$4,
            father_identity_number=$5,
            father_occupation=$6
        WHERE student_id=$7`;
    } else if (relationship === "Mother") {
      query = `
        UPDATE public.students
        SET address=$1,
            mother_full_name=$2,
            mother_phone_number=$3,
            mother_email=$4,
            mother_identity_number=$5,
            mother_occupation=$6
        WHERE student_id=$7`;
    } else if (relationship === "Guardian") {
      query = `
        UPDATE public.students
        SET address=$1,
            guardian_full_name=$2,
            guardian_phone_number=$3,
            guardian_email=$4,
            guardian_identity_number=$5,
            guardian_occupation=$6
        WHERE student_id=$7`;
    } else {
      throw new Error("Invalid relationship type");
    }

    values = [
      address,
      full_name,
      phone_number,
      email,
      identity_number,
      occupation,
      student_id,
    ];

    await client.query(query, values);
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};


module.exports = {
  handleParentAccountRequest,
  getParentByStudentId,
  updateProfileParent,
  putHeathyProfile,
};
