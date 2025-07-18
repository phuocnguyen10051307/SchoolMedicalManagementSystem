import React from "react";
import  useStudentData  from "../../hooks/useStudentData";
import "./StudentProfile.scss";

const StudentProfile = () => {
  const { data, loading, error } = useStudentData();

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div style={{ color: "red" }}>Lỗi: {error}</div>;
  if (!data) return <div>Không có dữ liệu học sinh</div>;

  return (
    <div className="student-profile">
      <h2>Hồ sơ học sinh</h2>
      <div className="profile-section">
        <img
          src={data.avatar_url || "/default-avatar.png"}
          alt="avatar"
          className="student-avatar"
        />
        <div className="info">
          <p><strong>Họ và tên:</strong> {data.account_name}</p>
          <p><strong>Email:</strong> {data.email}</p>
          <p><strong>Mã học sinh:</strong> {data.student_code}</p>
          <p><strong>Lớp:</strong> {data.class_name}</p>
          <p><strong>Ngày sinh:</strong> {data.date_of_birth}</p>
        </div>
      </div>

      <h3>Thông tin phụ huynh</h3>
      <ul className="parent-list">
        {data.parents?.map((parent, index) => (
          <li key={index} className="parent-item">
            <img
              src={parent.avatar_url || "/default-avatar.png"}
              alt="parent"
              className="parent-avatar"
            />
            <div>
              <p><strong>Họ tên:</strong> {parent.full_name}</p>
              <p><strong>Email:</strong> {parent.email}</p>
              <p><strong>Quan hệ:</strong> {parent.relationship_type}</p>
              <p><strong>Nghề nghiệp:</strong> {parent.occupation}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentProfile;
