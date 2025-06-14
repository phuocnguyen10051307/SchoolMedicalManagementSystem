import React, { useState } from "react";
import "./Parent.css";

const RegisterMedicine = () => {
  const [form, setForm] = useState({ medicineName: "", dosage: "", note: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
    setSuccess(false);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const e2 = {};
    if (!form.medicineName) e2.medicineName = "Required";
    if (!form.dosage) e2.dosage = "Required";
    setErrors(e2);
    setSuccess(Object.keys(e2).length === 0);
  };

  return (
    <div className="medicine-form-container">
      <h2>Register medicine to be sent to school</h2>
      <form className="medicine-form" onSubmit={handleSubmit} noValidate>
        <div className="medicine-row">
          <label>* Medicine Name:</label>
          <input name="medicineName" value={form.medicineName} onChange={handleChange} className={errors.medicineName ? "input-error" : ""} />
          {errors.medicineName && <span className="error-text">{errors.medicineName}</span>}
        </div>
        <div className="medicine-row">
          <label>* Dosage:</label>
          <input name="dosage" value={form.dosage} onChange={handleChange} className={errors.dosage ? "input-error" : ""} />
          {errors.dosage && <span className="error-text">{errors.dosage}</span>}
        </div>
        <div className="medicine-row">
          <label>Note:</label>
          <textarea name="note" value={form.note} onChange={handleChange} rows={4} />
        </div>
        <button type="submit" className="medicine-submit-btn">SUBMIT</button>
        {success && <div className="success-text" style={{ color: "green", marginTop: 12 }}>Medicine registered!</div>}
      </form>
    </div>
  );
};

export default RegisterMedicine;