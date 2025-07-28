import { Link, Outlet, useLocation } from "react-router-dom";
import "./Parent.scss";
import { useParentData } from "../../hooks/useParentData";
import { useEffect } from "react";
import { getInforAccount } from "../../service/service";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Parent = () => {
  const { user, logout } = useContext(AuthContext);
  const { data, loading, error } = useParentData(getInforAccount, "PARENT");
  const location = useLocation();

  const isActive = (path) => location.pathname.endsWith(path);

  return (
    <div className="parent-bg">
      <div className="parent-header">
        <div className="parent-tabs">
          <Link
            to="profile"
            className={isActive("profile") ? "parent-tab active" : "parent-tab"}
          >
            Parent Profile
          </Link>
          <Link
            to="health"
            className={isActive("health") ? "parent-tab active" : "parent-tab"}
          >
            Student Health Record Declaration
          </Link>
          <Link
            to="medicine"
            className={
              isActive("medicine") ? "parent-tab active" : "parent-tab"
            }
          >
            Register medicine to be sent to school
          </Link>
          <Link
            to="notifications"
            className={
              isActive("notifications") ? "parent-tab active" : "parent-tab"
            }
          >
            Notifications
          </Link>
        </div>
        <div className="btn-logout">
          <button className="logout-tab" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="parent-content">
        {loading ? (
         <div className="status-text">Loading...</div>
        ) : error ? (
          <div className="status-text error">Error: {error}</div>
        ) : (
          <Outlet context={{ data }} />
        )}
      </div>
    </div>
  );
};

export default Parent;
