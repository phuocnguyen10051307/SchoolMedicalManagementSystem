const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_ACCESS_TOKEN;

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ message: "Token không hợp lệ" });

      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ message: "Bạn chưa đăng nhập (không có token)" });
  }
};

module.exports = { authenticateJWT };
