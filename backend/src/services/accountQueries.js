const jwt = require("jsonwebtoken");
const connection = require("../../config/db");

const ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN;
const REFRESH_SECRET = process.env.JWT_REFRESH_TOKEN;

const getAccount = async (req, res) => {
  const { username, password } = req.body;
  const client = await connection.connect();

  try {
    const { rows } = await client.query(
      `SELECT * FROM accounts WHERE username = $1 AND password = $2 LIMIT 1`,
      [username, password]
    );

    if (rows.length === 0)
      return res.status(401).json({ message: "Sai tên đăng nhập hoặc mật khẩu" });

    const account = rows[0];
    if (account.account_status.toLowerCase() !== "active")
      return res.status(403).json({ message: `Tài khoản đang bị khóa` });

    delete account.password;

    const payload = {
      user_id: account.user_id,
      username: account.username,
      role: account.role_id,
    };

    const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });

    // (tùy chọn) Lưu refresh token vào DB hoặc bộ nhớ nếu muốn kiểm soát

    res.status(200).json({
      message: "Đăng nhập thành công",
      access_token: accessToken,
      refresh_token: refreshToken,
      account,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

module.exports = {
  getAccount,
};
