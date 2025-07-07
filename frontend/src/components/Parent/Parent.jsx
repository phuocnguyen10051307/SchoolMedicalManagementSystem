// src/components/Parent/Parent.js
import React, { useEffect, useState, useContext } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./Parent.css";
import { AuthContext } from "../../context/AuthContext";
import { getInforAccount } from "../../service/service";

const Parent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const isActive = (path) => location.pathname.endsWith(path);

  useEffect(() => {
    if (!user?.account_id) return;

    const fetchInfo = async () => {
      try {
        const res = await getInforAccount(user.account_id);
        setData(res);
      } catch (err) {
        setError(err.message || "Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, [user]);

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
            to="history"
            className={isActive("history") ? "parent-tab active" : "parent-tab"}
          >
            Health History
          </Link>
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
