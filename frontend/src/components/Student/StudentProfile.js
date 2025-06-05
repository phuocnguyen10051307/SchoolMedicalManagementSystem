import React, { useState } from "react";
const StudentProfile = ({ data }) => {
  const studentData = data && data.Students && data.Students.length > 0 ? data.Students[1] : null;
  const [student, setStudent] = useState(studentData);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(studentData);

  if (!student) return <div>No student data</div>;

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleUpdate = () => setEdit(true);
  const handleSave = () => {
    setStudent({ ...student, ...form });
    setEdit(false);
  };
  return (
      <div className="profile-info">
        <div className="profile-update-btn">
          {!edit && <button onClick={handleUpdate}>Update Profile</button>}
        </div>
        <div className="profile-row"><span>Full Name</span>: {edit ? <input name="FullName"  value={form.FullName} onChange={handleChange} /> : student.FullName}</div>
        <div className="profile-row"><span>DateOfBirth</span>: {edit ? <input name="DateOfBirth" value={form.DateOfBirth} onChange={handleChange} /> : student.DateOfBirth}</div>
        <div className="profile-row"><span>Gender</span>: {edit ? <input name = "Gender"value={form.Gender} onChange={handleChange} /> : student.Gender}</div>
        <div className="profile-row"><span>Class</span>: {edit ? <input name ="Class"value={form.Class} onChange={handleChange} /> : student.Class}</div>
        <div className="profile-row"><span>Address</span>: {student.Address}</div>
        <div className="profile-row"><span>Email</span>: {student.Email}</div>
        {edit && <div className="profile-save-btn"><button onClick={handleSave}>Save</button></div>}
      </div>
  );
};
export default StudentProfile;