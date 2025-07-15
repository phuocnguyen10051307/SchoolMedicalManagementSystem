const connection = require("../../config/db");
const { v4: uuidv4 } = require("uuid");
const createVaccinationScheduleServiceByManager = async ({
  account_id,
  vaccine_name,
  vaccination_date,
  target_age_group
}) => {
  const client = await connection.connect();

  try {
    // Kiểm tra vai trò tài khoản
    const { rows } = await client.query(
      `SELECT role_id FROM accounts WHERE account_id = $1`,
      [account_id]
    );

    if (rows.length === 0) {
      throw { status: 404, message: "Không tìm thấy tài khoản." };
    }

    if (rows[0].role_id !== "MANAGER") {
      throw { status: 403, message: "Bạn không có quyền thêm lịch tiêm chủng." };
    }

    const schedule_id = `vs_${uuidv4().slice(0, 8)}`;
    const now = new Date();

    await client.query(
      `INSERT INTO vaccination_schedules (
        schedule_id, vaccine_name, vaccination_date, target_age_group, status, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, 'PENDING', $5, $5
      )`,
      [schedule_id, vaccine_name, vaccination_date, target_age_group, now]
    );

    return { message: "Tạo lịch tiêm chủng thành công", schedule_id };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};
module.exports = {createVaccinationScheduleServiceByManager}