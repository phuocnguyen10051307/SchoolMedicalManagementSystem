import React, { useState } from "react";
import "./Parent.css";

const initialForm = {
    medicineName: "",
    dosage: "",
    note: ""
};

const RegisterMedicine = () => {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!form.medicineName.trim()) newErrors.medicineName = "Medicine name is required";
        if (!form.dosage.trim()) newErrors.dosage = "Dosage is required";
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setErrors({ ...errors, [name]: undefined });
        setSuccess(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setSuccess(false);
            return;
        }
        setErrors({});
        setSuccess(true);
        // Gửi dữ liệu lên server tại đây nếu cần
        // reset form nếu muốn: setForm(initialForm);
    };

    return (
        <div className="medicine-form-container">
            <h2>Register medicine to be sent to school</h2>
            <form className="medicine-form" onSubmit={handleSubmit} noValidate>
                <div className="medicine-row">
                    <label><span className="required">*</span> Medicine Name:</label>
                    <input
                        name="medicineName"
                        value={form.medicineName}
                        onChange={handleChange}
                        className={errors.medicineName ? "input-error" : ""}
                    />
                    {errors.medicineName && <span className="error-text">{errors.medicineName}</span>}
                </div>
                <div className="medicine-row">
                    <label><span className="required">*</span> Dosage:</label>
                    <input
                        name="dosage"
                        value={form.dosage}
                        onChange={handleChange}
                        className={errors.dosage ? "input-error" : ""}
                    />
                    {errors.dosage && <span className="error-text">{errors.dosage}</span>}
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
                <button type="submit" className="medicine-submit-btn">SUBMIT</button>
                {success && (
                    <div className="success-text" style={{ color: "green", marginTop: 12 }}>
                        Medicine registered successfully!
                    </div>
                )}
            </form>
        </div>
    );
};

export default RegisterMedicine;