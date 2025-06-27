import React from "react";
import { useOutletContext } from "react-router-dom";
import "./HealthHistory.css";

const HealthHistory = ({ parentId = 2 }) => {
  const { data } = useOutletContext();

  if (!data || !data.Students || !data.MedicalEvents) {
    return <div className="health-history-container">No health history data.</div>;
  }

  const students = data.Students.filter(stu => stu.ParentID === parentId);
  const events = data.MedicalEvents.filter(ev =>
    students.some(stu => stu.StudentID === ev.StudentID)
  );

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