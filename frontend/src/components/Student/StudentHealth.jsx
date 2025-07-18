// StudentHealthProfile.jsx
import React from "react";
import { useOutletContext } from "react-router-dom";

const StudentHealthProfile = () => {
  const { data } = useOutletContext();

  return (
    <div className="student-health-profile">
      <h2>Health Profile</h2>
      <p><strong>Allergies:</strong> {data?.allergies || "None"}</p>
      <p><strong>Medical Conditions:</strong> {data?.medical_conditions || "None"}</p>
      <p><strong>Height:</strong> {data?.height} cm</p>
      <p><strong>Weight:</strong> {data?.weight} kg</p>
      {/* Tùy chỉnh hiển thị theo schema của bạn */}
    </div>
  );
};

export default StudentHealthProfile;
