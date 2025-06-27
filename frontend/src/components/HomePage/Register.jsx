import React, { useState } from "react";
import "./register.scss";
import { createAccount } from "../../service/service";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [studentCode, setStudentCode] = useState("");
  const [cccd, setCccd] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const checkRes = await createAccount(
        studentCode,
        cccd,
        phone,
        email,
        relationship
      );
      const status = checkRes.status;
      if (status === "APPROVED") {
        setSuccessMsg(
          "Tạo tài khoản thành công! Vui lòng kiểm tra email hoặc liên hệ nhà trường."
        );
        navigate("/")
        return;
      } else if (status === "REJECTED") {
        setErrorMsg("Thông tin không khớp. Vui lòng kiểm tra lại.");
      }

      setSuccessMsg("Đăng ký thành công!");
    } catch (error) {
      setErrorMsg("Đăng ký thất bại!");
      console.error(error);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2 className="register-title">Register</h2>
        <form onSubmit={handleSubmit}>
          <label>Student code</label>
          <input
            type="text"
            name="studentcode"
            value={studentCode}
            onChange={(e) => setStudentCode(e.target.value)}
            placeholder="Enter your student code"
          />
          <label>Identify</label>
          <input
            type="text"
            name="cccd"
            value={cccd}
            onChange={(e) => setCccd(e.target.value)}
            placeholder="Enter your identify card number"
          />
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <label>Phone</label>
          <input
            type="number"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
          />
          <label>Relationship</label>
          <select
            name="relationship"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
          >
            <option value="">-- Select Relationship --</option>
            <option value="Mother">Mother</option>
            <option value="Father">Father</option>
            <option value="Guardian">Guardian</option>
          </select>
          <button type="submit">Đăng ký</button>
        </form>

        {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      </div>
    </div>
  );
};

export default Register;
