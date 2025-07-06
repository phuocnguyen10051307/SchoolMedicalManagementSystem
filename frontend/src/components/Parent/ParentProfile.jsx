import React, { useState, useEffect, useContext } from "react";
import { useOutletContext } from "react-router-dom";
import "./ParentProfile.css";
import { AuthContext } from "../../context/AuthContext";
import { getInforAccount } from "../../service/service";
import UpdateModal from "./UpdateModal";
import { putParentProfile } from "../../service/service";
import { toast } from "react-toastify";
import axios from "axios";
import im from "../../images/user.png";

const ParentProfile = () => {
  const { data } = useOutletContext();
  const { user } = useContext(AuthContext);

  const [parent, setParent] = useState(user);
  const [form, setForm] = useState(user);
  const [imagePreview, setImagePreview] = useState(
    data?.ImageUrl || im
  );
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const info = await getInforAccount(parent.account_id);
        if (info) setForm(info);
      } catch (error) {
        console.error("Error fetching parent info:", error);
      }
    };
    if (parent?.account_id) fetchInfo();
  }, [parent.account_id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Cập nhật: Upload ảnh lên Cloudinary
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "images"); // 🔁 thay bằng preset bạn tạo trong Cloudinary

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dg1v9rju0/image/upload",
        formData
      );

      const imageUrl = res.data.secure_url;
      setImagePreview(imageUrl);
      setForm({ ...form, avatar_url: imageUrl });

      toast.success("Upload ảnh thành công!");
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Upload ảnh thất bại");
    }
  };

  const handleSave = async () => {
    try {
      await putParentProfile(
        parent.account_id,
        form.full_name,
        form.phone_number,
        form.email,
        form.date_of_birth,
        form.occupation,
        form.address,
        form.identity_number,
        form.avatar_url
      );

      setParent({ ...parent, ...form });
      setShowModal(false);
      toast.success("Update successful!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="parent-profile-container-view">
      <button className="profile-update-btn" onClick={() => setShowModal(true)}>
        <span className="profile-update-icon">
          <span className="icon-user"></span>
          <span className="icon-plus">+</span>
        </span>
        Update Profile
      </button>

      <div className="profile-left">
        <div className="profile-avatar" style={{ position: "relative" }}>
          <img src={imagePreview} alt="avatar" />
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
        </div>

        <div className="profile-info-block">
          <div className="profile-row">
            <b>Full Name:</b> {form.full_name}
          </div>
          <div className="profile-row">
            <b>Phone Number:</b> {form.phone_number}
          </div>
          <div className="profile-row">
            <b>Email:</b> {form.email}
          </div>
        </div>
      </div>

      <div className="profile-divider" />

      <div className="profile-right">
        <div className="profile-info-block-right">
          <div className="profile-row-right">
            <b>Date of Birth:</b>{" "}
            {form.date_of_birth
              ? new Date(form.date_of_birth).toLocaleDateString("en-CA")
              : "N/A"}
          </div>

          <div className="profile-row-right">
            <b>Occupation:</b> {form.occupation}
          </div>
          <div className="profile-row-right">
            <b>Address:</b> {form.address}
          </div>
          <div className="profile-row-right">
            <b>CCCD:</b> {form.identity_number}
          </div>
          <div className="profile-row-right">
            <b>Students:</b> {form.student_name} - {form.class}
          </div>
          <div className="profile-row-right">
            <b>Relationship:</b> {form.relationship_type}
          </div>
        </div>
      </div>

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
