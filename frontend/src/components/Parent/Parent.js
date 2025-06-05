import React, { useState, useEffect } from "react";
import ParentProfile from "./ParentProfile";
import StudentHealthRecordDeclaration from "./StudentHealthRecordDeclaration";
import RegisterMedicine from "./RegisterMedicine";
import "./Parent.css";

const TABS = [
  { label: "Parent Profile", key: "profile", component: ParentProfile },
  { label: "Student Health Record Declaration", key: "health", component: StudentHealthRecordDeclaration },
  { label: "Register medicine to be sent to school", key: "medicine", component: RegisterMedicine }
];

const Parent = () => {
  const [tab, setTab] = useState("profile");
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
          {TABS.map(t => (
            <button
              key={t.key}
              className={`parent-tab${tab === t.key ? " active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
          <div className="parent-tab blank"></div>
        </div>
        <div className="parent-notify">
          <span className="bell">🔔</span>
          <span className="notify-badge">3</span>
        </div>
      </div>
      <div className="parent-content">
        {data && tab === "profile" && <ParentProfile data={data} />}
        {data && tab === "health" && <StudentHealthRecordDeclaration data={data} />}
        {data && tab === "medicine" && <RegisterMedicine data={data} />}
      </div>
    </div>
  );
};

export default Parent;