const jwt = require("jsonwebtoken");

const ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN;
const REFRESH_SECRET = process.env.JWT_REFRESH_TOKEN;

const generateAccessToken = (payload) => {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_SECRET);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
