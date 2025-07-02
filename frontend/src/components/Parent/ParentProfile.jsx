import React, { useState, useEffect, useContext } from "react";
import { useOutletContext } from "react-router-dom";
import "./ParentProfile.css";
import { AuthContext } from "../../context/AuthContext";
import { getInforAccount } from "../../service/service";
import UpdateModal from "./UpdateModal"; // Import component modal mới

const ParentProfile = () => {
  const { data } = useOutletContext();
  const parentData = data || null;
  const { user } = useContext(AuthContext);

  const [parent, setParent] = useState(user);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(user);
  const [profileLeft, setProfileLeft] = useState([
    "FullName",
    "PhoneNumber",
    "Email",
  ]);
  const [profileRight, setProfileRight] = useState([
    "DateOfBirth",
    "Occupation",
    "Address",
    "CitizenId",
    "Students",
    "Relationship",
  ]);
  const [imagePreview, setImagePreview] = useState(
    parentData?.ImageUrl || "https://randomuser.me/api/portraits/men/32.jpg"
  );

  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const infor = await getInforAccount(parent.account_id); // Call API to get parent info
        if (infor) {
          setForm(infor); // Update the form state with the data returned from the API
        }
      } catch (error) {
        console.error("Error fetching parent info:", error);
      }
    };

    if (parent?.account_id) {
      fetchInfo(); // Fetch parent data when component mounts
    }
  }, [parent.account_id]);
  console.log(form)

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = () => setShowModal(true);

  const handleSave = () => {
    setParent({ ...parent, ...form, ImageUrl: imagePreview });
    setShowModal(false);
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
    <div
      className={
        edit ? "parent-profile-container-edit" : "parent-profile-container-view"
      }
    >
      <button className="profile-update-btn" onClick={handleUpdate}>
        <span className="profile-update-icon">
          <span className="icon-user"></span>
          <span className="icon-plus">+</span>
        </span>
        Update Profile
      </button>

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
            <span className="profile-label">{profileLeft[0]}</span>
            <span className="profile-colon">:</span>
            <span className="profile-value">{user.full_name}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">{profileLeft[1]}</span>
            <span className="profile-colon">:</span>
            <span className="profile-value">{user.phone_number}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">{profileLeft[2]}</span>
            <span className="profile-colon">:</span>
            <span className="profile-value">{user.email}</span>
          </div>
        </div>
      </div>

      <div className="profile-divider" />

      <div className="profile-right">
        <div className="profile-info-block-right">
          <div className="profile-row-right">
            <span>{profileRight[0]}:</span>
            <span>{}</span>
          </div>
          <div className="profile-row-right">
            <span>{profileRight[1]}:</span>
            <span>{form.occupation}</span>
          </div>
          <div className="profile-row-right">
            <span>{profileRight[2]}:</span>
            <span>{form.address}</span>
          </div>
          <div className="profile-row-right">
            <span>{profileRight[3]}:</span>
            <span>{form.identity_number}</span>
          </div>
          <div className="profile-row-right">
            <span>{profileRight[4]}:</span>
            <span>{form.student_name} - {form.class}</span>
          </div>
          <div className="profile-row-right">
            <span>{profileRight[5]}:</span>
            <span>{form.relationship_type}</span>
          </div>
        </div>
      </div>

      {/* Import and use the UpdateModal component */}
      <UpdateModal
        showModal={showModal}
        handleClose={() => setShowModal(false)}
        handleSave={handleSave}
        form={form}
        handleChange={handleChange}
      />
    </div>
  );
};

export default ParentProfile;
