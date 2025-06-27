import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import "./ParentProfile.css";

const ParentProfile = () => {
  const { data } = useOutletContext();
  const parentData = data?.Parents?.[0] || null;

  const [parent, setParent] = useState(parentData);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(parentData);
  const [imagePreview, setImagePreview] = useState(parentData?.ImageUrl || "https://randomuser.me/api/portraits/men/32.jpg");

  useEffect(() => {
    if (edit) {
      import("./ParentProfileEdit.css");
    } else {
      import("./ParentProfile.css");
    }
  }, [edit]);

  if (!parent) return <div>No parent data</div>;

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleUpdate = () => setEdit(true);
  const handleSave = () => {
    setParent({ ...parent, ...form, ImageUrl: imagePreview });
    setEdit(false);
  };
  const handleImageChange = e => {
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
    <div className={edit ? "parent-profile-container-edit" : "parent-profile-container-view"}>
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
          {["FullName", "PhoneNumber", "Email"].map(field => (
            <div key={field} className="profile-row">
              <span className="profile-label">{field.replace(/([A-Z])/g, " $1")}</span>
              <span className="profile-colon">:</span>
              <span className="profile-value">
                {edit ? (
                  <input name={field} value={form?.[field] || ""} onChange={handleChange} />
                ) : (
                  parent?.[field]
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="profile-divider" />

      <div className="profile-right">
        <div className="profile-info-block-right">
          {[
            "DateOfBirth",
            "Occupation",
            "Address",
            "CitizenId",
            "Students",
            "Relationship"
          ].map(field => (
            <div key={field} className="profile-row-right">
              <span>{field.replace(/([A-Z])/g, " $1")}{field !== "Students" && ":"}</span>
              <span>
                {edit ? (
                  <input
                    name={field}
                    value={
                      field === "Students"
                        ? parent?.Students?.join(", ")
                        : form?.[field] || ""
                    }
                    onChange={handleChange}
                    disabled={field === "Students"}
                  />
                ) : field === "Students" ? parent?.Students?.join(", ") : parent?.[field]}
              </span>
            </div>
          ))}
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