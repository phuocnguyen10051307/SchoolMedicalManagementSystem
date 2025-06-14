import React from "react";
import "./Parent.css";

const HealthHistory = ({ data, parentId = 2 }) => {
  // Lấy danh sách học sinh của phụ huynh này
  const students = data.Students.filter(stu => stu.ParentID === parentId);

  // Lấy các sự kiện y tế liên quan đến các học sinh này
  const events = data.MedicalEvents.filter(ev =>
    students.some(stu => stu.StudentID === ev.StudentID)
  );

  // Lấy tên học sinh theo StudentID
  const getStudentName = (studentId) => {
    const stu = students.find(s => s.StudentID === studentId);
    return stu ? stu.FullName : "";
  };

  return (
    <div className="health-history-container">
      <h2>Health History</h2>
      <table className="health-history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Student</th>
            <th>Event</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>No health history found.</td>
            </tr>
          ) : (
            events.map((item, idx) => (
              <tr key={idx}>
                <td>{new Date(item.EventDate).toLocaleDateString()}</td>
                <td>{getStudentName(item.StudentID)}</td>
                <td>{item.EventType}</td>
                <td>{item.Description}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HealthHistory;