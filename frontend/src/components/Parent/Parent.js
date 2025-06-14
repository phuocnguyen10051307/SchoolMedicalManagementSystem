import React, { useEffect, useState } from "react";
import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import ParentProfile from "./ParentProfile";
import StudentHealthRecordDeclaration from "./StudentHealthRecordDeclaration";
import RegisterMedicine from "./RegisterMedicine";
import HealthHistory from "./HealthHistory";
import "./Parent.css";

const Parent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/data/school_health_data.json")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div className="parent-bg">
      <div className="parent-header">
        <div className="parent-tabs">
          <NavLink to="profile" className={({isActive}) => isActive ? "parent-tab active" : "parent-tab"}>Parent Profile</NavLink>
          <NavLink to="health" className={({isActive}) => isActive ? "parent-tab active" : "parent-tab"}>Student Health Record Declaration</NavLink>
          <NavLink to="medicine" className={({isActive}) => isActive ? "parent-tab active" : "parent-tab"}>Register medicine to be sent to school</NavLink>
          <NavLink to="history" className={({isActive}) => isActive ? "parent-tab active" : "parent-tab"}>Health History</NavLink> 
          <div className="parent-tab blank"></div>
        </div>
        <div className="parent-notify">
          <span className="bell">🔔</span>
          <span className="notify-badge">3</span>
        </div>
      </div>
      <div className="parent-content">
        <Routes>
          <Route path="/" element={<Navigate to="profile" replace />} />
          <Route path="profile" element={data ? <ParentProfile data={data} /> : null} />
          <Route path="health" element={data ? <StudentHealthRecordDeclaration data={data} /> : null} />
          <Route path="medicine" element={data ? <RegisterMedicine data={data} /> : null} />
          <Route path="history" element={data ? <HealthHistory data={data} /> : null} /> 
        </Routes>
      </div>
    </div>
  );
};

export default Parent;