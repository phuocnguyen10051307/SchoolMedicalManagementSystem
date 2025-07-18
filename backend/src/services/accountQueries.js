const connection = require("../../config/db");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");

const ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN;
const REFRESH_SECRET = process.env.JWT_REFRESH_TOKEN;

const getAccount = async (req, res) => {
  const { username, password } = req.body;
  const client = await connection.connect();

  try {
    const { rows: accountRows } = await client.query(
      `SELECT * FROM accounts WHERE username = $1 LIMIT 1`,
      [username]
    );

    if (accountRows.length > 0) {
      const account = accountRows[0];

      if (account.password !== password)
        return res.status(401).json({ message: "Sai mật khẩu" });

      if (account.account_status.toLowerCase() !== "active")
        return res.status(403).json({ message: "Tài khoản đang bị khóa" });

      delete account.password;

      const payload = {
        account_id: account.account_id,
        role_id: account.role_id,
      };

      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      return res.status(200).json({
        message: "Đăng nhập thành công",
        access_token: accessToken,
        refresh_token: refreshToken,
        account,
      });
    }

    const { rows: studentRows } = await client.query(
      `SELECT * FROM students WHERE username = $1 LIMIT 1`,
      [username]
    );

    if (studentRows.length === 0)
      return res
        .status(401)
        .json({ message: "Sai tên đăng nhập hoặc mật khẩu" });

    const student = studentRows[0];

    if (student.password !== password)
      return res.status(401).json({ message: "Sai mật khẩu" });

    delete student.password;

    const payload = {
      account_id: student.student_id, 
      role_id: "STUDENT", 
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return res.status(200).json({
      message: "Đăng nhập thành công",
      access_token: accessToken,
      refresh_token: refreshToken,
      account: {
        ...student,
        role_id: "STUDENT",
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

const getLogsByAccountId = async (accountId) => {
  const client = await connection.connect();
  try {
    const { rows } = await client.query(
      `SELECT 
         log_id,
         action_type,
         target_table,
         target_record_id,
         description,
         created_at
       FROM logs
       WHERE account_id = $1
       ORDER BY created_at DESC`,
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
  getAccount,
  getLogsByAccountId,
};
