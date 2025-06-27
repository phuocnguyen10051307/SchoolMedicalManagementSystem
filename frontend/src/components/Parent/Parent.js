import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./Parent.css";

const Parent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    fetch("/data/school_health_data.json")
      .then(res => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const isActive = (path) => location.pathname.endsWith(path);

  return (
    <div className="parent-bg">
      <div className="parent-header">
        <div className="parent-tabs">
          <Link to="profile" className={isActive("profile") ? "parent-tab active" : "parent-tab"}>Parent Profile</Link>
          <Link to="health" className={isActive("health") ? "parent-tab active" : "parent-tab"}>Student Health Record Declaration</Link>
          <Link to="medicine" className={isActive("medicine") ? "parent-tab active" : "parent-tab"}>Register medicine to be sent to school</Link>
          <Link to="history" className={isActive("history") ? "parent-tab active" : "parent-tab"}>Health History</Link>
          <div className="parent-tab blank"></div>
        </div>
        <div className="parent-notify">
          <span className="bell">🔔</span>
          <span className="notify-badge">3</span>
        </div>
      </div>
      <div className="parent-content">
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

export default Parent;