import React, { useState } from "react";
import "./Parent.css";

const UpdateHealthyStudent = {
  
  allergies: "",
  chronicDiseases: "",
  treatmentHistory: "",
  vision: "",
  hearing: "",
  note: ""
};

const StudentHealthRecordDeclaration = ({ studentName = "Hung" }) => {
  const [form, setForm] = useState(UpdateHealthyStudent);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};//TAO MOT OBJECT RONG DE LUU CAC LOI, BỊ BỎ TRỐNG SẼ BÁO LỖI
    if (!form.allergies) e.allergies = "Required";
    if (!form.chronicDiseases) e.chronicDiseases = "Required";
    if (!form.treatmentHistory) e.treatmentHistory = "Required";
    if (!form.vision) e.vision = "Required";
    if (!form.hearing) e.hearing = "Required";
    if (!form.note) e.note = "Required";
    return e;
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
    setSuccess(false);
  };

  const handleSubmit = e => {
    e.preventDefault();//Ngăn trình duyệt reload trang khi submit form.
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); setSuccess(false); return; }
    setErrors({});
    setSuccess(true);
  };

  return (
    <div className="health-form-container">
      <h2>Update healthy student</h2>
      <form className="health-form" onSubmit={handleSubmit} noValidate>
        <div className="health-form-left">
          <div className="health-row">
            <label>Student name :</label>
            <span>{studentName}</span>
          </div>
          <div className="health-row">
            <label>* Allergies :</label>
            <input name="allergies" value={form.allergies} onChange={handleChange} className={errors.allergies ? "input-error" : ""} />
            {errors.allergies && <span className="error-text">{errors.allergies}</span>}
          </div>
          <div className="health-row">
            <label>* Chronic Diseases:</label>
            <input name="chronicDiseases" value={form.chronicDiseases} onChange={handleChange} className={errors.chronicDiseases ? "input-error" : ""} />
            {errors.chronicDiseases && <span className="error-text">{errors.chronicDiseases}</span>}
          </div>
          <div className="health-row">
            <label>* Treatment History:</label>
            <input name="treatmentHistory" value={form.treatmentHistory} onChange={handleChange} className={errors.treatmentHistory ? "input-error" : ""} />
            {errors.treatmentHistory && <span className="error-text">{errors.treatmentHistory}</span>}
          </div>
          <div className="health-row">
            <label>* Vision :</label>
            <select name="vision" value={form.vision} onChange={handleChange} className={errors.vision ? "input-error" : ""}>
              <option value="">Select</option>
              <option value="normal">Normal</option>
              <option value="weak">Weak</option>
              <option value="other">Other</option>
            </select>
            {errors.vision && <span className="error-text">{errors.vision}</span>}
          </div>
        </div>
        <div className="health-form-right">
          <div className="health-row">
            <label>* Hearing :</label>
            <select name="hearing" value={form.hearing} onChange={handleChange} className={errors.hearing ? "input-error" : ""}>
              <option value="">Select</option>
              <option value="normal">Normal</option>
              <option value="weak">Weak</option>
              <option value="other">Other</option>
            </select>
            {errors.hearing && <span className="error-text">{errors.hearing}</span>}
          </div>
          <div className="health-row">
            <label>* Note:</label>
            <textarea name="note" value={form.note} onChange={handleChange} rows={6} className={errors.note ? "input-error" : ""} />
            {errors.note && <span className="error-text">{errors.note}</span>}
          </div>
          <div className="health-row">
            <span style={{ color: "red" }}>(* : Required)</span>
          </div>
          <button type="submit" className="health-submit-btn">SUBMIT</button>
          {success && <div className="success-text" style={{ color: "green", marginTop: 12 }}>Health record submitted!</div>}
        </div>
      </form>
    </div>
  );
};

export default StudentHealthRecordDeclaration;