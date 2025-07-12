const connection = require("../../config/db");
const { v4: uuidv4 } = require("uuid");
const getInforNurse = async (account_id) => {
  const client = await connection.connect();
  try {
    const { rows } = await client.query(
      `
      SELECT 
        a.full_name,
        a.phone_number,
        a.email,
        a.avatar_url,
        a.date_of_birth,
        a.role_id,
        ARRAY_AGG(nc.class_name) AS class_names
      FROM accounts a
      JOIN nurse_classes nc ON nc.nurse_account_id = a.account_id 
      WHERE a.account_id = $1
      GROUP BY 
        a.full_name, 
        a.phone_number, 
        a.email, 
        a.avatar_url, 
        a.date_of_birth,
        a.role_id
      `,
      [account_id]
    );
    return rows[0];
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};
const updateNurseInfo = async (account_id,  full_name, phone_number, email, avatar_url, date_of_birth) => {
 

  const client = await connection.connect();
  try {
    await client.query(
      `
      UPDATE accounts
      SET 
        full_name = $1,
        phone_number = $2,
        email = $3,
        avatar_url = $4,
        date_of_birth = $5
      WHERE account_id = $6
      `,
      [full_name, phone_number, email, avatar_url, date_of_birth, account_id]
    );
    return { message: 'Nurse info updated successfully (excluding class assignment).' };
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};


const confirmParentMedicationReceiptService = async ({
  request_id,
  nurse_account_id,
  received_quantity,
}) => {
  const client = await connection.connect();
  try {
    await client.query("BEGIN");
    const { rows: requests } = await client.query(
      `SELECT student_id FROM parent_medication_requests WHERE request_id = $1 AND request_status = 'PENDING'`,
      [request_id]
    );

    if (requests.length === 0) {
      throw new Error("Không tìm thấy yêu cầu thuốc hợp lệ");
    }

    const student_id = requests[0].student_id;
    const { rowCount } = await client.query(
      `SELECT 1
       FROM nurse_classes nc
       JOIN students s ON s.class_name = nc.class_name
       WHERE nc.nurse_account_id = $1 AND s.student_id = $2`,
      [nurse_account_id, student_id]
    );

    if (rowCount === 0) {
      throw {
        status: 403,
        message: "Bạn không có quyền nhận thuốc của học sinh này",
      };
    }

    await client.query(
      `UPDATE parent_medication_requests
       SET request_status = 'APPROVED', reviewed_by_id = $1, reviewed_at = NOW()
       WHERE request_id = $2`,
      [nurse_account_id, request_id]
    );
    const receipt_id = uuidv4();

    await client.query(
      `INSERT INTO nurse_medication_receipts (
        receipt_id, request_id, nurse_account_id, received_at, received_quantity, status
      ) VALUES (
        $1, $2, $3, NOW(), $4, 'RECEIVED'
      )`,
      [receipt_id, request_id, nurse_account_id, received_quantity]
    );

    await client.query("COMMIT");

    return { receipt_id };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
const getPendingRequestsForNurse = async (nurse_id) => {
  const client = await connection.connect();
  try {
    const { rows } = await client.query(
      `
      SELECT 
        r.request_id,
        r.student_id,
        s.full_name AS student_name,
        s.class_name,
        r.medication_name,
        r.dosage,
        r.instructions,
        r.notes,
        r.medication_type,
        r.requested_at
      FROM parent_medication_requests r
      JOIN students s ON s.student_id = r.student_id
      JOIN nurse_classes nc ON nc.class_name = s.class_name
      WHERE r.request_status = 'PENDING'
        AND nc.nurse_account_id = $1
      ORDER BY r.requested_at DESC
      `,
      [nurse_id]
    );

    return rows;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

module.exports = {
  confirmParentMedicationReceiptService,
  getPendingRequestsForNurse,
  getInforNurse,
  updateNurseInfo
};
