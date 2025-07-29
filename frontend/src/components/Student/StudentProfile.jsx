import React from "react";
import { useOutletContext } from "react-router-dom";
import "./StudentProfile.scss";

const StudentProfile = () => {
  const { user } = useOutletContext();

  if (!user) return <div>Không có dữ liệu học sinh</div>;

  return (
    <div className="student-profile">
      <h2>Hồ sơ học sinh</h2>
      <div className="profile-section">
        <img
          src={user.avatar_url || "/default-avatar.png"}
          alt="avatar"
          className="student-avatar"
        />
        <div className="info">
          <p><strong>Họ và tên:</strong> {user.full_name}</p>
          <p><strong>Email:</strong> {user.father_email}</p>
          <p><strong>Mã học sinh:</strong> {user.student_code}</p>
          <p><strong>Lớp:</strong> {user.class_name}</p>
          <p><strong>Ngày sinh:</strong> {new Date(user.date_of_birth).toLocaleDateString()}</p>
        </div>
      </div>

      <h3>Thông tin phụ huynh</h3>
      <ul className="parent-list">
        <li className="parent-item">
          <div>
            <p><strong>Cha:</strong> {user.father_full_name}</p>
            <p><strong>Email:</strong> {user.father_email}</p>
            <p><strong>Nghề nghiệp:</strong> {user.father_occupation}</p>
            <p><strong>SĐT:</strong> {user.father_phone_number}</p>
          </div>
        </li>
        <li className="parent-item">
          <div>
            <p><strong>Mẹ:</strong> {user.mother_full_name}</p>
            <p><strong>Email:</strong> {user.mother_email}</p>
            <p><strong>Nghề nghiệp:</strong> {user.mother_occupation}</p>
            <p><strong>SĐT:</strong> {user.mother_phone_number}</p>
          </div>
        </li>
        <li className="parent-item">
          <div>
            <p><strong>Người giám hộ:</strong> {user.guardian_full_name}</p>
            <p><strong>Email:</strong> {user.guardian_email}</p>
            <p><strong>Nghề nghiệp:</strong> {user.guardian_occupation}</p>
            <p><strong>SĐT:</strong> {user.guardian_phone_number}</p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default StudentProfile;
