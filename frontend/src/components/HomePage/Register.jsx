import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [form, setForm] = useState({
    studentcode: "",
    cccd: "",
    email: "",
    phone: ""
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const checkRes = await axios.get(
        `http://localhost:8080/api/v1/school/check?studentcode=${form.studentcode}`
      );
      if (checkRes.data.exists) {
        setErrorMsg("Student code or CCCD already exists.");
        return;
      }

      await axios.post("/api/parents/register", form);
      setSuccessMsg("Đăng ký thành công!");
      setForm({
        studentcode: "",
        cccd: "",
        email: "",
        phone: ""
      });
    } catch (error) {
      setErrorMsg("Đăng ký thất bại!");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Student code</label>
          <input
            type="text"
            name="studentcode"
            value={form.studentcode}
            onChange={handleChange}
            placeholder="Enter your student code"
          />
        </div>
        <div>
          <label>Identify</label>
          <input
            type="text"
            name="cccd"
            value={form.cccd}
            onChange={handleChange}
            placeholder="Enter your identify card number"
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
        </div>
        <button type="submit">Đăng ký</button>
      </form>
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
    </div>
  );
};

export default Register;
