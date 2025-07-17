const connection = require("../../config/db");

const checkRole = (...allowedRoles) => {
  return async (req, res, next) => {
    const { account_id } = req.user || {};

    if (!account_id) {
      return res.status(401).json({ message: "Không xác thực được tài khoản." });
    }

    try {
      const client = await connection.connect();
      const { rows } = await client.query(
        `SELECT role_id FROM accounts WHERE account_id = $1`,
        [account_id]
      );
      client.release();

      if (rows.length === 0) {
        return res.status(404).json({ message: "Tài khoản không tồn tại." });
      }

      const role = rows[0].role_id;
      if (!allowedRoles.includes(role)) {
        return res.status(403).json({ message: "Bạn không có quyền truy cập." });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};

module.exports = { checkRole };
