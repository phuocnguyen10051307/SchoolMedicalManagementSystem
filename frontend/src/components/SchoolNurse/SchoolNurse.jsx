import React, { useState } from 'react';
import './SchoolNurse.css';

const SchoolNurse = () => {
  const [active, setActive] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', icon: '📋', label: 'DashBoard' },
    { id: 'events', icon: '📈', label: 'Medical Events' },
    { id: 'vaccination', icon: '🧬', label: 'Vaccination' },
    { id: 'checkup', icon: '🩺', label: 'Health Checkup' },
    { id: 'records', icon: '📁', label: 'Student Health Records' },
    { id: 'reports', icon: '📄', label: 'Reports' },
    { id: 'profile', icon: 'ℹ️', label: 'My Profile' },
  ];

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
            <li
              key={item.id}
              className={`menu-item ${active === item.id ? 'active' : ''}`}
              onClick={() => setActive(item.id)}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

  
    </div>
  );
};

export default SchoolNurse;
