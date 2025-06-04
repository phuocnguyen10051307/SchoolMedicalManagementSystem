import React, { useState } from "react";
import "./Parent.css";

const initialForm = {
    allergies: "",
    chronicDiseases: "",
    treatmentHistory: "",
    vision: "",
    hearing: "",
    note: ""
};

const StudentHealthRecordDeclaration = ({ studentName = "Emma Johnson" }) => {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!form.allergies.trim()) newErrors.allergies = "Allergies is required";
        if (!form.chronicDiseases.trim()) newErrors.chronicDiseases = "Chronic diseases is required";
        if (!form.treatmentHistory.trim()) newErrors.treatmentHistory = "Treatment history is required";
        if (!form.vision) newErrors.vision = "Vision is required";
        if (!form.hearing) newErrors.hearing = "Hearing is required";
        if (!form.note.trim()) newErrors.note = "Note is required";
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
        <div className="health-form-container">
            <h2>Update healthy student</h2>
            <form className="health-form" onSubmit={handleSubmit} noValidate>
                <div className="health-form-left">
                    <div className="health-row">
                        <label>Student name :</label>
                        <span>{studentName}</span>
                    </div>
                    <div className="health-row">
                        <label><span className="required">*</span> Allergies :</label>
                        <input
                            name="allergies"
                            value={form.allergies}
                            onChange={handleChange}
                            className={errors.allergies ? "input-error" : ""}
                        />
                        {errors.allergies && <span className="error-text">{errors.allergies}</span>}
                    </div>
                    <div className="health-row">
                        <label><span className="required">*</span> Chronic Diseases:</label>
                        <input
                            name="chronicDiseases"
                            value={form.chronicDiseases}
                            onChange={handleChange}
                            className={errors.chronicDiseases ? "input-error" : ""}
                        />
                        {errors.chronicDiseases && <span className="error-text">{errors.chronicDiseases}</span>}
                    </div>
                    <div className="health-row">
                        <label><span className="required">*</span> Treatment History:</label>
                        <input
                            name="treatmentHistory"
                            value={form.treatmentHistory}
                            onChange={handleChange}
                            className={errors.treatmentHistory ? "input-error" : ""}
                        />
                        {errors.treatmentHistory && <span className="error-text">{errors.treatmentHistory}</span>}
                    </div>
                    <div className="health-row">
                        <label><span className="required">*</span> Vision :</label>
                        <select
                            name="vision"
                            value={form.vision}
                            onChange={handleChange}
                            className={errors.vision ? "input-error" : ""}
                        >
                            <option value="">Select your child’s vision condition</option>
                            <option value="normal">Normal</option>
                            <option value="weak">Weak</option>
                            <option value="other">Other</option>
                        </select>
                        {errors.vision && <span className="error-text">{errors.vision}</span>}
                    </div>
                </div>
                <div className="health-form-right">
                    <div className="health-row">
                        <label><span className="required">*</span> Hearing :</label>
                        <select
                            name="hearing"
                            value={form.hearing}
                            onChange={handleChange}
                            className={errors.hearing ? "input-error" : ""}
                        >
                            <option value="">Select your child’s hearing condition</option>
                            <option value="normal">Normal</option>
                            <option value="weak">Weak</option>
                            <option value="other">Other</option>
                        </select>
                        {errors.hearing && <span className="error-text">{errors.hearing}</span>}
                    </div>
                    <div className="health-row">
                        <label><span className="required">*</span> Note:</label>
                        <textarea
                            name="note"
                            value={form.note}
                            onChange={handleChange}
                            placeholder="Feel free to give more details about your child’s health, such as vision, hearing, chronic illnesses, or allergies"
                            rows={6}
                            className={errors.note ? "input-error" : ""}
                        />
                        {errors.note && <span className="error-text">{errors.note}</span>}
                    </div>
                    <div className="health-row">
                        <span style={{ color: "red" }}>
                            (* : Fields marked with an asterisk are required.)
                        </span>
                    </div>
                    <button type="submit" className="health-submit-btn">SUBMIT</button>
                    {success && (
                        <div className="success-text" style={{ color: "green", marginTop: 12 }}>
                            Health record submitted successfully!
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default StudentHealthRecordDeclaration;