import React, { useState, useEffect } from "react";
import StudentProfile from "./StudentProfile";
const TABS = [
  { label: "Student Profile", key: "profile", component: StudentProfile }
];
const Student = () => {
  const [tab, setTab] = useState("profile");
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("/data/school_health_data.json")
      .then(res => res.json())
      .then(setData);
  }, []);
  return (
    <div className="student-bg">
      
        <div className="student-tabs">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`student-tab${tab === t.key ? " active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
          <div className="student-tab blank"></div>
        </div>
      
      <div className="student-content">
        {data && tab === "profile" && <StudentProfile data={data} />}
        
      </div>
    </div>
  );
};
export default Student;