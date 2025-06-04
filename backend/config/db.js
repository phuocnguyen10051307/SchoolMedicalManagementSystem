const { Pool } = require("pg");
const pool = new Pool({
  host: "localhost",
  user: "postgres",
  port: 5436,
  database: "SchoolMedicalManagementSystem",
  password: "12345",
});
// client.query('SELECT * FROM students', (err, results)=>{
//     if(!err){
//         console.log(results.rows)
//     } else {
//         console.log(err.message)
//     }
//     client.end();
// })
const sdt = "0911000001";

async function a(sdt) {
  try {
    const students = await pool.query(
      "select * from students where father_phone like $1",
      [sdt]
    );
    console.log(students.rows[0].full_name);
  } catch (error) {
    console.error("Query error:", error.message);
  }
}
a(sdt);
