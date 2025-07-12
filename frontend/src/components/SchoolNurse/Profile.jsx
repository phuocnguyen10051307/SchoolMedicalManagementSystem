import React, { useEffect, useState, useContext } from "react";
import "./Profile.scss";
import im from "../../images/user.png";
import { useOutletContext } from "react-router-dom";
import { putNurseProfile } from "../../service/service";
import UpdateProfileModal from "./ModalUpdateProfile";
import { AuthContext } from "../../context/AuthContext";

const formatDateForInput = (dob) => {
  if (!dob.includes("/")) return dob;
  const [day, month, year] = dob.split("/");
  return `${year}-${month}-${day}`;
};

const formatDateForDisplay = (inputDate) => {
  if (!inputDate.includes("-")) return inputDate;
  const [year, month, day] = inputDate.split("-");
  return `${day}/${month}/${year}`;
};

const Profile = () => {
  const { refetchNurse, nurseData } = useOutletContext();
  const { user } = useContext(AuthContext);

  const [editedNurse, setEditedNurse] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(null);


  useEffect(() => {
    if (nurseData) {
      const formatted = {
        fullName: nurseData.full_name,
        phone: nurseData.phone_number,
        email: nurseData.email,
        dob: nurseData.date_of_birth
          ? formatDateForDisplay(nurseData.date_of_birth.slice(0, 10))
          : "",
        occupation: "School Nurse",
        managedClass: nurseData.class_names?.join(", ") || "",
        image: nurseData.avatar_url,
      };
      setForm(formatted);
    }
  }, [nurseData]);
  console.log(nurseData);
  console.log(form);
  const handleShow = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "dob" ? formatDateForDisplay(value) : value;
    setEditedNurse((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSave = async () => {
    try {
      const full_name = editedNurse.fullName ?? form.fullName;
      const phone_number = editedNurse.phone ?? form.phone;
      const email = editedNurse.email ?? form.email;
      const avatar_url = form.image;
      const date_of_birth = editedNurse.dob
        ? formatDateForInput(editedNurse.dob)
        : formatDateForInput(form.dob);

      await putNurseProfile(
        user.account_id,
        full_name,
        phone_number,
        email,
        avatar_url,
        date_of_birth
      );

      setShowModal(false);
      refetchNurse();
    } catch (error) {
      alert(error.message || "Cập nhật thất bại!");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>My Profile</h2>
        <button className="update-btn" onClick={handleShow}>
          Update Profile
        </button>
      </div>
      {form && (
        <div className="profile-content">
          <div className="profile-image">
            <img src={form?.image ? form.image : im} alt="Nurse Avatar" />
          </div>
          <div className="profile-info">
            <div className="info-item">
              <strong>Full Name:</strong> {form.fullName}
            </div>
            <div className="info-item">
              <strong>Phone:</strong> {form.phone}
            </div>
            <div className="info-item">
              <strong>Email:</strong> {form.email}
            </div>
            <div className="info-item">
              <strong>Date of Birth:</strong> {form.dob}
            </div>
            <div className="info-item">
              <strong>Occupation:</strong> {form.occupation}
            </div>
            <div className="info-item">
              <strong>Managed Class:</strong> {form.managedClass}
            </div>
          </div>
        </div>
      )}
      {form && (
        <UpdateProfileModal
          show={showModal}
          handleClose={handleClose}
          handleSave={handleSave}
          form={form}
           setForm={setForm}
          editedNurse={editedNurse}
          handleChange={handleChange}
        />
      )}
    </div>
  );
};

export default Profile;
