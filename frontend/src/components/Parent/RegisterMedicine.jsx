import React, { useState, useContext } from "react";
import "./RegisterMedicine.scss";
import { createParentMedicationRequest } from "../../service/service";
import { useOutletContext } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

const RegisterMedicine = () => {
  const { user } = useContext(AuthContext);
  const { data } = useOutletContext();

  const [form, setForm] = useState({
    medicineName: "",
    dosage: "",
    instructions: "",
    note: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = {};

    if (!form.medicineName) e2.medicineName = "Required";
    if (!form.dosage) e2.dosage = "Required";
    if (!form.instructions) e2.instructions = "Required";

    setErrors(e2);
    if (Object.keys(e2).length > 0) return;

    try {
      await createParentMedicationRequest({
        student_id: data.student_id,
        medication_name: form.medicineName,
        dosage: form.dosage,
        instructions: form.instructions,
        notes: form.note,
        requested_by_id: user.account_id,
      });
      setForm({
        medicineName: "",
        dosage: "",
        instructions: "",
        note: "",
      });
      toast.success("parent sent medicane success");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Đã có lỗi xảy ra khi gửi yêu cầu");
    }
  };

  return (
    <>
      <div className="medicine-form-wrapper">
        <div className="medicine-form-container">
          <h2 className="form-title">Register medicine to be sent to school</h2>
          <form className="medicine-form" onSubmit={handleSubmit} noValidate>
            <div className="medicine-row">
              <label>* Medicine Name:</label>
              <input
                name="medicineName"
                value={form.medicineName}
                onChange={handleChange}
                className={errors.medicineName ? "input-error" : ""}
              />
              {errors.medicineName && (
                <span className="error-text">{errors.medicineName}</span>
              )}
            </div>

            <div className="medicine-row">
              <label>* Dosage:</label>
              <input
                name="dosage"
                value={form.dosage}
                onChange={handleChange}
                className={errors.dosage ? "input-error" : ""}
              />
              {errors.dosage && (
                <span className="error-text">{errors.dosage}</span>
              )}
            </div>

            <div className="medicine-row">
              <label>* Instructions:</label>
              <textarea
                name="instructions"
                value={form.instructions}
                onChange={handleChange}
                rows={3}
                className={errors.instructions ? "input-error" : ""}
              />
              {errors.instructions && (
                <span className="error-text">{errors.instructions}</span>
              )}
            </div>

            <div className="medicine-row">
              <label>Note:</label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <button type="submit" className="medicine-submit-btn">
              SUBMIT
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterMedicine;
