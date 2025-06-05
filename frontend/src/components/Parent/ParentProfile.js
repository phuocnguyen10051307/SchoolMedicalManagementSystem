import React, { useState } from "react";
import "./Parent.css";

const ParentProfile = ({ data }) => {
  // Đặt hook ở đầu hàm, KHÔNG return sớm!
  const parentData = data && data.Parents && data.Parents.length > 0 ? data.Parents[1] : null;
  const [parent, setParent] = useState(parentData);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(parentData);

  if (!parent) return <div>No parent data</div>;

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleUpdate = () => setEdit(true);
  const handleSave = () => {
    setParent({ ...parent, ...form });
    setEdit(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-avatar">
        <img src={parent.ImageUrl || "https://randomuser.me/api/portraits/men/32.jpg"} alt="avatar" />
      </div>
      <div className="profile-info">
        <div className="profile-update-btn">
          {!edit && <button onClick={handleUpdate}>Update Profile</button>}
        </div>
        <div className="profile-row"><span>Full Name</span>: {edit ? <input name="FullName" value={form.FullName} onChange={handleChange} /> : parent.FullName}</div>
        <div className="profile-row"><span>Phone Number</span>: {edit ? <input name="PhoneNumber" value={form.PhoneNumber} onChange={handleChange} /> : parent.PhoneNumber}</div>
        <div className="profile-row"><span>Address</span>: {edit ? <input name="Address" value={form.Address} onChange={handleChange} /> : parent.Address}</div>
        <div className="profile-row"><span>Email</span>: {edit ? <input name="Email" value={form.Email} onChange={handleChange} /> : parent.Email}</div>
        <div className="profile-row"><span>Username</span>: {parent.Username}</div>
        <div className="profile-row"><span>Last Login</span>: {parent.LastLoginAt}</div>
        {edit && <div className="profile-save-btn"><button onClick={handleSave}>Save</button></div>}
      </div>
    </div>
  );
};

export default ParentProfile;