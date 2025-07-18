import { Link, Outlet, useLocation } from "react-router-dom";
import "./Student.scss"; // Tùy chỉnh style riêng nếu muốn
import useStudentData from "../../hooks/useStudentData"; 

const Student = () => {
  const { data, loading, error } = useStudentData();
  const location = useLocation();

  const isActive = (path) => location.pathname.endsWith(path);

  return (
    <div className="student-bg">
      <div className="student-header">
        <div className="student-tabs">
          <Link
            to="profile"
            className={isActive("profile") ? "student-tab active" : "student-tab"}
          >
            Student Profile
          </Link>
          <Link
            to="health"
            className={isActive("health") ? "student-tab active" : "student-tab"}
          >
            Health Profile
          </Link>
        </div>
      </div>
      <div className="student-content">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: "red" }}>Error: {error}</div>
        ) : (
          <Outlet context={{ data }} />
        )}
      </div>
    </div>
  );
};

export default Student;
