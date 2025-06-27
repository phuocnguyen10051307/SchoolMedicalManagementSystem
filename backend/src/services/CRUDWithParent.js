const connection = require("../../config/db");

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
      [account.id, student.id, relationship,occupation]
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

    if (account.account_status !== "active") {
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

const getAllStudents = async () => {
  const client = await connection.connect();
  try {
    const { rows } = await client.query("SELECT * FROM students");
    return rows;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

module.exports = { handleParentAccountRequest, getAccount, getAllStudents };
