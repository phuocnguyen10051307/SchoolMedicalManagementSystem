import React, { useState } from "react";
const StudentProfile = ({ data }) => {
  const studentData = data && data.Students && data.Students.length > 0 ? data.Students[1] : null;
  const [student, setStudent] = useState(studentData);
  //trạng thái của học sinh, được sử dụng để lưu trữ thông tin cá nhân của học sinh.
  //hàm để cập nhật trạng thái học sinh khi người dùng chỉnh sửa thông tin cá nhân.  
  //hook để quản lý trạng thái trong component.
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(studentData);
  if (!student) return <div>No student data</div>;
// Kiểm tra xem dữ liệu học sinh có tồn tại hay không, nếu không thì hiển thị thông báo "No student data".

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  // Hàm để xử lý sự kiện khi người dùng thay đổi thông tin trong biểu mẫu.
  // setForm({ ...form, [e.target.name]: e.target.value }): tạo một bản sao của biểu mẫu hiện tại và cập nhật trường thông tin tương ứng với giá trị mới.
  const handleUpdate = () => setEdit(true); 
  // setEdit(true): cập nhật trạng thái chỉnh sửa thành true, cho phép người dùng chỉnh sửa thông tin cá nhân.

  const handleSave = () => {// Hàm để lưu thông tin cá nhân sau khi người dùng chỉnh sửa.
    setStudent({ ...student, ...form });
    setEdit(false);//
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
//trạng thái để xác định xem người dùng đang ở chế độ chỉnh sửa thông tin cá nhân hay không.
//hàm để cập nhật trạng thái chỉnh sửa.
//khởi tạo trạng thái chỉnh sửa với giá trị mặc định là false (không ở chế độ chỉnh sửa).

//trạng thái của biểu mẫu, được sử dụng để lưu trữ dữ liệu khi người dùng chỉnh sửa thông tin cá nhân.
//hàm để cập nhật trạng thái biểu mẫu khi người dùng thay đổi thông tin cá nhân.
//khởi tạo trạng thái biểu mẫu với dữ liệu của học sinh ban đầu.