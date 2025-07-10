import React, { useState, useEffect } from "react";
// useState: hook để quản lý trạng thái trong component.
// useEffect: hook để thực hiện các tác vụ phụ, như tải dữ liệu từ máy chủ.
import StudentProfile from "./StudentProfile";
const TABS = [
  { label: "Student Profile", key: "profile", component: StudentProfile }
];
//mảng chứa các tab cho giao diện học sinh.
//tên hiển thị trên nút bấm.
//được sử dụng để xác định tab nào đang được chọn.
//component hiển thị thông tin cá nhân của học sinh.
const Student = () => {
  const [tab, setTab] = useState("profile");
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("/data/school_health_data.json")
      .then(res => res.json())
      .then(setData);
  }, []);
  //useEffect: hook để thực hiện các tác vụ phụ, trong trường hợp này là tải dữ liệu từ file JSON.
  //fetch: hàm để gửi yêu cầu HTTP đến máy chủ và nhận dữ liệu.
  return (
    <div className="student-bg">
        <div className="student-tabs">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`student-tab${tab === t.key ? " active" : ""}`}
              onClick={() => setTab(t.key)}//chuyen tab
            >
              {t.label}
            </button>
          ))}
        </div>
        {data && tab === "profile" && <StudentProfile data={data} />}
        {/* Hiển thị component StudentProfile nếu dữ liệu đã được tải và tab hiện tại là "profile". */}
        {/* data && tab === "profile": kiểm tra xem dữ liệu đã được tải và tab hiện tại có phải là "profile" hay không. */}
    </div>
  );
};
export default Student;
// trạng thái hiện tại của tab đang được chọn, mặc định là "profile".
  // hàm để cập nhật trạng thái tab khi người dùng chọn một tab khác.
  // khởi tạo trạng thái tab với giá trị mặc định là "profile".