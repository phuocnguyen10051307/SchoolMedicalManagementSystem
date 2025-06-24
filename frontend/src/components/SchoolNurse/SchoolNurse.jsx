import React from 'react';
import './SchoolNurse.css';
import { FaClipboardList, FaHeartbeat, FaSyringe, FaNotesMedical, FaFolderOpen, FaFileMedicalAlt, FaInfoCircle } from 'react-icons/fa';
import { NavLink, Outlet } from 'react-router-dom';


const menuItems = [
  { id: 'dashboard', icon: <FaClipboardList />, label: 'Dashboard', path: 'dashboard' },
  { id: 'events', icon: <FaHeartbeat />, label: 'Medical Events', path: 'event' },
  { id: 'vaccination', icon: <FaSyringe />, label: 'Vaccination', path: 'vaccination' },
  { id: 'checkup', icon: <FaNotesMedical />, label: 'Health Checkup', path: 'checkup' },
  { id: 'records', icon: <FaFolderOpen />, label: 'Student Health Records', path: 'records' },
  { id: 'reports', icon: <FaFileMedicalAlt />, label: 'Reports', path: 'reports' },
  { id: 'profile', icon: <FaInfoCircle />, label: 'My Profile', path: 'profile' },
];

const SchoolNurse = () => {
  return (
    <div className="nurse-container">
      <div className="sidebar">
        <div className="profile">
          <img
            src="https://www.kindpng.com/picc/m/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png"
            alt="User Avatar"
            className="avatar"
          />
          <h2 className="username">Hacker</h2>
        </div>

        <ul className="menu">
          {menuItems.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default SchoolNurse;
