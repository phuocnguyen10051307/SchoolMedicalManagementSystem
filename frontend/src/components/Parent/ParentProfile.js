import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import "./Parent.css";

const ParentProfile = () => {
  const { data } = useOutletContext(); // Lấy data từ context

  const parentData = data && data.Parents && data.Parents.length > 0 ? data.Parents[0] : null;
  const [parent, setParent] = useState(parentData);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(parentData);
  const [imagePreview, setImagePreview] = useState(parentData?.ImageUrl || "https://randomuser.me/api/portraits/men/32.jpg");

  if (!parent) return <div>No parent data</div>;

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = () => setEdit(true);

  const handleSave = () => {
    setParent({ ...parent, ...form, ImageUrl: imagePreview });
    setEdit(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setForm({ ...form, ImageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-container">
      {!edit && (
        <button className="profile-update-btn" onClick={handleUpdate}>
          <span className="profile-update-icon">
            <span className="icon-user"></span>
            <span className="icon-plus">+</span>
          </span>
          Update Profile
        </button>
      )}
      <div className="profile-left">
        <div className="profile-avatar" style={{ position: "relative" }}>
          <img src={imagePreview} alt="avatar" />
          {edit && (
            <>
              <input
                type="file"
                accept="image/*"
                id="avatar-upload"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <label htmlFor="avatar-upload" className="avatar-upload-btn">
                Update Image
              </label>
            </>
          )}
        </div>
        <div className="profile-info-block">
          <div className="profile-row">
            <span className="profile-label">Full Name</span>
            <span className="profile-colon">:</span>
            <span className="profile-value">
              {edit ? (
                <input name="FullName" value={form.FullName} onChange={handleChange} />
              ) : (
                parent.FullName
              )}
            </span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Phone Number</span>
            <span className="profile-colon">:</span>
            <span className="profile-value">
              {edit ? (
                <input name="PhoneNumber" value={form.PhoneNumber} onChange={handleChange} />
              ) : (
                parent.PhoneNumber
              )}
            </span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Email</span>
            <span className="profile-colon">:</span>
            <span className="profile-value">
              {edit ? (
                <input name="Email" value={form.Email} onChange={handleChange} />
              ) : (
                parent.Email
              )}
            </span>
          </div>
        </div>
      </div>
      <div className="profile-divider" />
      <div className="profile-right">
        <div className="profile-info-block-right">
          <div className="profile-row-right">
            <span>Date of birth:</span>
            <span>{edit ? <input name="DateOfBirth" value={form.DateOfBirth || ""} onChange={handleChange} /> : parent.DateOfBirth}</span>
          </div>
          <div className="profile-row-right">
            <span>Occupation :</span>
            <span>{edit ? <input name="Occupation" value={form.Occupation || ""} onChange={handleChange} /> : parent.Occupation}</span>
          </div>
          <div className="profile-row-right">
            <span>Address :</span>
            <span>{edit ? <input name="Address" value={form.Address || ""} onChange={handleChange} /> : parent.Address}</span>
          </div>
          <div className="profile-row-right">
            <span>citizen identification card:</span>
            <span>{edit ? <input name="CitizenId" value={form.CitizenId || ""} onChange={handleChange} /> : parent.CitizenId}</span>
          </div>
          <div className="profile-row-right">
            <span>Student(s):</span>
            <span>{parent.Students ? parent.Students.join(", ") : ""}</span>
          </div>
          <div className="profile-row-right">
            <span>Relationship :</span>
            <span>{edit ? <input name="Relationship" value={form.Relationship || ""} onChange={handleChange} /> : parent.Relationship}</span>
          </div>
        </div>
        {edit && (
          <div className="profile-save-btn">
            <button onClick={handleSave}>Save</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentProfile;