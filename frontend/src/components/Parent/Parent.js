import React, { useState } from "react";
import ParentProfile from "./ParentProfile";
import StudentHealthRecordDeclaration from "./StudentHealthRecordDeclaration";
import RegisterMedicine from "./RegisterMedicine";
import "./Parent.css";

const TABS = [
    { label: "Parent Profile", key: "profile" },
    { label: "Student Health Record Declaration", key: "health" },
    { label: "Register medicine to be sent to school", key: "medicine" }
];

const Parent = () => {
    const [tab, setTab] = useState("profile");

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
                {tab === "profile" && <ParentProfile />}
                {tab === "health" && <StudentHealthRecordDeclaration />}
                {tab === "medicine" && <RegisterMedicine />}
            </div>
        </div>
    );
};

export default Parent;