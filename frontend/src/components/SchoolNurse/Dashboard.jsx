import React, { useEffect, useState, useContext } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  TimeScale,
} from "chart.js";
import { getNurseDashboardService } from "../../service/service";
import { useOutletContext } from "react-router-dom";
import "chartjs-adapter-date-fns";
import { AuthContext } from "../../context/AuthContext";
import "./Dashboard.scss";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  TimeScale
);

const DashBoard = () => {
  const { nurseData } = useOutletContext();
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getNurseDashboardService(user?.account_id);
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard:", error.message);
      }
    };

    if (user?.account_id) {
      fetchDashboard();
    }
  }, [user]);

  if (!dashboardData) return <div className="loading">Đang tải thống kê...</div>;

  const {
    eventTypeStats,
    severityStats,
    monthlyEventStats,
    medicationRequestStats,
    healthProfileReviewStats,
  } = dashboardData;

  return (
    <div className="dashboard-wrapper">
      <h2 className="dashboard-title">📊 Nurse Dashboard</h2>
      <div className="dashboard-grid">
        <div className="chart-container">
          <h4>Sự kiện theo loại</h4>
          <Bar
            data={{
              labels: eventTypeStats.map((e) => e.event_type),
              datasets: [
                {
                  label: "Số lượng",
                  data: eventTypeStats.map((e) => e.total),
                  backgroundColor: "#57c2b0",
                },
              ],
            }}
          />
        </div>

        <div className="chart-container">
          <h4>Mức độ nghiêm trọng</h4>
          <Doughnut
            data={{
              labels: severityStats.map((e) => e.severity_level),
              datasets: [
                {
                  data: severityStats.map((e) => e.total),
                  backgroundColor: ["#f87171", "#facc15", "#34d399"],
                },
              ],
            }}
          />
        </div>

        <div className="chart-container">
          <h4>Sự kiện theo tháng</h4>
          <Line
            data={{
              labels: monthlyEventStats.map((e) =>
                new Date(e.month).toLocaleDateString("vi-VN", {
                  month: "short",
                  year: "numeric",
                })
              ),
              datasets: [
                {
                  label: "Số sự kiện",
                  data: monthlyEventStats.map((e) => e.total),
                  fill: false,
                  borderColor: "#3b82f6",
                  tension: 0.3,
                },
              ],
            }}
          />
        </div>

        <div className="chart-container">
          <h4>Trạng thái gửi thuốc</h4>
          <Bar
            data={{
              labels: medicationRequestStats.map((e) => e.request_status),
              datasets: [
                {
                  label: "Số yêu cầu",
                  data: medicationRequestStats.map((e) => e.count),
                  backgroundColor: "#a78bfa",
                },
              ],
            }}
          />
        </div>

        <div className="chart-container">
          <h4>Hồ sơ sức khỏe học sinh</h4>
          <Doughnut
            data={{
              labels: healthProfileReviewStats.map((e) => e.review_status),
              datasets: [
                {
                  data: healthProfileReviewStats.map((e) => e.count),
                  backgroundColor: ["#fbbf24", "#4ade80", "#60a5fa"],
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DashBoard;