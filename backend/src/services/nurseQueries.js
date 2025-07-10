const connection = require("../../config/db");

const getNurseClassList = async (nurseId) => {
  const client = await connection.connect();
  try {
    const { rows } = await client.query(
      `SELECT class_name
       FROM nurse_classes
       WHERE nurse_account_id = $1
       ORDER BY class_name`,
      [nurseId]
    );
    return rows;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

module.exports = {
  getNurseClassList
};
