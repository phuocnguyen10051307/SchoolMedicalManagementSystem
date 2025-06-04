import React, { useState } from "react";
import "./Parent.css";

const initialParent = {
    fullName: "Robert Johnson",
    phone: "0123 456 789",
    address: "123 Main St, City",
    email: "robert.johnson@gmail.com",
    student: "Emma Johnson",
    studentClass: "5A"
};

const ParentProfile = () => {
    const [parent, setParent] = useState(initialParent);
    const [edit, setEdit] = useState(false);
    const [form, setForm] = useState(initialParent);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setSuccess(false);
    };

    const handleUpdate = () => setEdit(true);

    const handleSave = () => {
        setParent({
            ...parent,
            fullName: form.fullName,
            phone: form.phone,
            address: form.address,
            email: form.email
        });
        setEdit(false);
        setSuccess(true);
    };

    return (
        <div className="profile-container">
            <div className="profile-avatar">
                <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="avatar"
                />
            </div>
            <div className="profile-info">
                <div className="profile-update-btn">
                    {!edit && (
                        <button onClick={handleUpdate}>
                            <span role="img" aria-label="update">👤</span> Update Profile
                        </button>
                    )}
                </div>
                <div className="profile-row"><span>Full Name</span>: {edit ? (
                    <input name="fullName" value={form.fullName} onChange={handleChange} />
                ) : parent.fullName}</div>
                <div className="profile-row"><span>Phone Number</span>: {edit ? (
                    <input name="phone" value={form.phone} onChange={handleChange} />
                ) : parent.phone}</div>
                <div className="profile-row"><span>Address</span>: {edit ? (
                    <input name="address" value={form.address} onChange={handleChange} />
                ) : parent.address}</div>
                <div className="profile-row"><span>Email</span>: {edit ? (
                    <input name="email" value={form.email} onChange={handleChange} />
                ) : parent.email}</div>
                <div className="profile-row"><span>Parent of student</span>: {parent.student}</div>
                <div className="profile-row"><span>Class of student</span>: {parent.studentClass}</div>
                {edit && (
                    <div className="profile-save-btn">
                        <button onClick={handleSave}>Save</button>
                    </div>
                )}
                {success && (
                    <div className="success-text" style={{ color: "green", marginTop: 12 }}>
                        Profile updated successfully!
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParentProfile;