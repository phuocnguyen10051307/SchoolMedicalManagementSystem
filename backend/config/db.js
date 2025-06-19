const { Pool} = require("pg");
require("dotenv").config();
const connection= new Pool({
  host: process.env.DB_LOCALHOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
});

module.exports = connection