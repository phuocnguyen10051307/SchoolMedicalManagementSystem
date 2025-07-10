import React, { useState, useEffect, useContext } from "react";
import { useOutletContext } from "react-router-dom";
import "./ParentProfile.scss";
import { AuthContext } from "../../context/AuthContext";
import { getInforAccount } from "../../service/service";
import UpdateModal from "./UpdateModal";
import { putParentProfile } from "../../service/service";
import { toast } from "react-toastify";
import im from "../../images/user.png";

const ParentProfile = () => {
  const { data } = useOutletContext();
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  console.log(data);
  useEffect(() => {
    if (data) {
      const mappedData = {
        ...data, 
        avatar_url:data.image|| im
      }
      setForm(mappedData);
    }
    console.log(data);
  }, [data]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const response = await putParentProfile(
        user.account_id,
        form.full_name,
        form.phone_number,
        form.email,
        form.date_of_birth,
        form.occupation,
        form.address,
        form.identity_number,
        form.avatar_url
      );
      setShowModal(false);
      const updated = await getInforAccount(form.account_id);
      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Cập nhật thất bại:", error);
      toast.error("Cập nhật thất bại.");
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
          <img src={`${form?.avatar_url}?v=${Date.now()}`} alt="avatar" />
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
      {console.log("avatar_url đang dùng:", form.avatar_url)}

      <UpdateModal
        showModal={showModal}
        handleClose={() => setShowModal(false)}
        handleSave={handleSave}
        form={form}
        setForm={setForm}
        handleChange={handleChange}
      />
    </div>
  );
};

export default ParentProfile;
