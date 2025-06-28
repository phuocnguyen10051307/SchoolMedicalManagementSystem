const connection = require("../../config/db");
const { sendEmail } = require("../utils/mailer");

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
    let occupation = null;
    const student = studentRows[0];
    const match = (() => {
      if (relationship === "Father") {
        occupation = student.father_occupation;
        return (
          student.father_identity_number === cccd &&
          (student.father_phone_number === phone ||
            student.father_email === email)
        );
      }
      if (relationship === "Mother") {
        occupation = student.mother_occupation;
        return (
          student.mother_identity_number === cccd &&
          (student.mother_phone_number === phone ||
            student.mother_email === email)
        );
      }
      if (relationship === "Guardian") {
        occupation = student.guardian_occupation;
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
      await client.query(
        `INSERT INTO logs (log_id, account_id, action_type, target_table, target_record_id, description, created_at)
         VALUES (gen_random_uuid(), NULL, 'REJECT_REQUEST', 'pending_account_requests', $1, $2, NOW())`,
        [
          request.request_id,
          `Request rejected for relationship ${relationship} on student_code ${student_code}`,
        ]
      );
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
      if (relationship === "Father") return student.father_name;
      if (relationship === "Mother") return student.mother_name;
      if (relationship === "Guardian") return student.guardian_name;
      return "Parent";
    })();

    const { rows: accountRows } = await client.query(
      `INSERT INTO accounts 
        (account_id, username, password, email, phone_number, date_of_birth, full_name, avatar_url, role_id, created_at)
        VALUES (gen_random_uuid(), $1, $2, $3, $4, NULL, $5, NULL, 'PARENT', NOW())
        RETURNING *`,
      [username, password, email, phone, full_name]
    );

    const account = accountRows[0];
    const { rows: healthyProfile } = await client.query(
      `INSERT INTO public.health_profiles (profile_id,student_id,submitted_by_id,review_status,created_at,
        updated_at) VALUES (gen_random_uuid(),$1,$2,'pending',NOW(),NOW());`,
      [student.student_id, account.account_id]
    );

    await client.query(
      `INSERT INTO parents (parent_id, account_id, student_id, relationship_type,occupation)
       VALUES (gen_random_uuid(), $1, $2, $3,$4)`,
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

const getAccount = async (req, res) => {
  const { username, password } = req.body;

  const client = await connection.connect();

  try {
    const { rows } = await client.query(
      `SELECT * FROM accounts WHERE username = $1 AND password = $2 LIMIT 1`,
      [username, password]
    );

    if (rows.length === 0) {
      return res
        .status(401)
        .json({ message: "Sai tên đăng nhập hoặc mật khẩu" });
    }

    const account = rows[0];

    if (account.status !== "ACTIVE") {
      return res
        .status(403)
        .json({ message: `Tài khoản đang ở trạng thái ${account.status}` });
    }

    res.status(200).json({ message: "Đăng nhập thành công", account });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
module.exports = { handleParentAccountRequest, getAccount, putHeathyProfile };
