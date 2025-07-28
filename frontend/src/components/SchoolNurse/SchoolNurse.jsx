import React, { useContext } from "react";
import "./SchoolNurse.scss";
import {
  FaClipboardList,
  FaHeartbeat,
  FaSyringe,
  FaNotesMedical,
  FaFolderOpen,
  FaFileMedicalAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { NavLink, Outlet } from "react-router-dom";
import { useNurseData } from "../../hooks/useNurseData";
import { AuthContext } from "../../context/AuthContext";

const menuItems = [
  {
    id: "dashboard",
    icon: <FaClipboardList />,
    label: "Dashboard",
    path: "dashboard",
  },
  {
    id: "events",
    icon: <FaHeartbeat />,
    label: "Medical Events",
    path: "event",
  },
  {
    id: "vaccination",
    icon: <FaSyringe />,
    label: "Vaccination",
    path: "vaccination",
  },
  {
    id: "checkup",
    icon: <FaNotesMedical />,
    label: "Health Checkup",
    path: "checkup",
  },
  {
    id: "records",
    icon: <FaFolderOpen />,
    label: "Get medicine",
    path: "records",
  },
  {
    id: "reports",
    icon: <FaFileMedicalAlt />,
    label: "Reports",
    path: "reports",
  },
  {
    id: "profile",
    icon: <FaInfoCircle />,
    label: "My Profile",
    path: "profile",
  },
];

const SchoolNurse = () => {
  const { user, logout } = useContext(AuthContext);
  const { data, loading, error, refetch } = useNurseData();
  if (loading) return <div>Loading nurse data...</div>;
  if (error) return <div>Error loading nurse data: {error}</div>;

  return (
    <div className="nurse-container">
      <div className="sidebar">
        <div className="profile">
          <img src={data.avatar_url} alt="User Avatar" className="avatar" />
          <h2 className="username">{data.full_name}</h2>
        </div>

        <ul className="menu">
          {menuItems.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `menu-item ${isActive ? "active" : ""}`
                }
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </NavLink>
            </li>
          ))}
          <li>
            <button className="menu-item logout-button" onClick={logout}>
              <span className="icon">
                <i className="fas fa-sign-out-alt" />{" "}
                {/* Font Awesome fallback */}
              </span>
              <span className="label">Logout</span>
            </button>
          </li>
        </ul>
      </div>

      <div className="main-content">
        <Outlet context={{ refetchNurse: refetch, nurseData: data }} />
      </div>
    </div>
  );
};

export default SchoolNurse;
