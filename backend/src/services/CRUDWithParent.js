const connection = require("../../config/db");

const handleParentAccountRequest = async ({ student_code, cccd, phone, email, relationship }) => {
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
          student.father_cccd === cccd &&
          (student.father_phone === phone || student.father_email === email)
        );
      }
      if (relationship === "Mother") {
        return (
          student.mother_cccd === cccd &&
          (student.mother_phone === phone || student.mother_email === email)
        );
      }
      if (relationship === "Guardian") {
        return (
          student.guardian_cccd === cccd &&
          (student.guardian_phone === phone || student.guardian_email === email)
        );
      }
      return false;
    })();

    const status = match ? "APPROVED" : "REJECTED";

    const { rows: pendingRows } = await client.query(
      `INSERT INTO pending_account_requests
        (id, student_code, cccd, phone, email, relationship, status, requested_at, reviewed_by, reviewed_at)
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
      if (relationship === "Father") return student.father_name;
      if (relationship === "Mother") return student.mother_name;
      if (relationship === "Guardian") return student.guardian_name;
      return "Parent";
    })();

    const { rows: accountRows } = await client.query(
      `INSERT INTO accounts 
        (id, username, password, email, phone, dateOfBirth, full_name, image, role, status, created_at)
        VALUES (gen_random_uuid(), $1, $2, $3, $4, NULL, $5, NULL, 'PARENT', 'ACTIVE', NOW())
        RETURNING *`,
      [username, password, email, phone, full_name]
    );

    const account = accountRows[0];

    await client.query(
      `INSERT INTO parents (id, user_id, student_id, relationship)
       VALUES (gen_random_uuid(), $1, $2, $3)`,
      [account.id, student.id, relationship]
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
      return res.status(401).json({ message: "Sai tên đăng nhập hoặc mật khẩu" });
    }

    const account = rows[0];

    if (account.status !== "ACTIVE") {
      return res.status(403).json({ message: `Tài khoản đang ở trạng thái ${account.status}` });
    }

    res.status(200).json({ message: "Đăng nhập thành công", account });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

const getAllStudents = async (userid) => {
  const client = await connection.connect();
  try {
    const { rows } = await client.query(`SELECT s.* FROM students s JOIN parents p ON s.student_id = p.student_id WHERE p.account_id = $1`, [userid]);
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
    const { rows } = await client.query(`SELECT h.*, s.full_name AS student_name, s.class_name  FROM health_profiles h JOIN students s ON h.student_id = s.student_id JOIN parents p ON s.student_id = p.student_id WHERE p.account_id = $1`, [userid]);
    return rows;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

const getParentByStudentId = async (accountid) => {
  const client = await connection.connect();
  try {
    const { rows } = await client.query(`SELECT * FROM parents WHERE account_id = $1`, [accountid]);
    const parent = rows[0];
    if (!parent) return null;
    if (parent.relationship_type === "father") {
      const { rows: info } = await client.query(`select s.father_email, s.father_full_name, s.father_identity_number, s.father_phone_number from parents p join students s on s.student_id = p.student_id where p.account_id = $1`, [accountid])
      return info;
    } else if (parent.relationship_type === "mother") {
      const { rows: info } = await client.query(`select s.mother_email, s.mother_full_name, s.mother_identity_number, s.mother_phone_number from parents p join students s on s.student_id = p.student_id where p.account_id = $1`, [accountid])
      return info;
    } else if (parent.relationship_type === "guardian") {
      const { rows: info } = await client.query(`select s.guardian_email, s.guardian_full_name, s.guardian_identity_number , s.guardian_phone_number  from parents p join students s on s.student_id = p.student_id where p.account_id = $1`, [accountid])
      return info;
    }
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};
module.exports = { handleParentAccountRequest, getAccount, getAllStudents, getHeathProfiles, getParentByStudentId };
