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
import { Button } from "react-bootstrap";
import ModalCreateBlog from "./ModalCreateBlog";

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
  const [showModal, setShowModal] = useState(false);

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

  if (!dashboardData)
    return <div className="loading">Loading statistics...</div>;

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
      <Button variant="success" onClick={() => setShowModal(true)}>
        ✍️ Viết Blog
      </Button>
      <div className="dashboard-grid">
        <div className="chart-container">
          <h4>Events by Type</h4>
          <Bar
            data={{
              labels: eventTypeStats.map((e) => e.event_type),
              datasets: [
                {
                  label: "Quantity",
                  data: eventTypeStats.map((e) => e.total),
                  backgroundColor: "#57c2b0",
                },
              ],
            }}
          />
        </div>

        <div className="chart-container">
          <h4>Severity Levels</h4>
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
          <h4>Events by Month</h4>
          <Bar
            data={{
              labels: monthlyEventStats.map((e) =>
                new Date(e.month).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              ),
              datasets: [
                {
                  label: "Number of Events",
                  data: monthlyEventStats.map((e) => e.total),
                  backgroundColor: "#60a5fa",
                },
              ],
            }}
            options={{
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "Month",
                  },
                },
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Events",
                  },
                },
              },
            }}
          />
        </div>

        <div className="chart-container">
          <h4>Medication Request Status</h4>
          <Bar
            data={{
              labels: medicationRequestStats.map((e) => e.request_status),
              datasets: [
                {
                  label: "Number of Requests",
                  data: medicationRequestStats.map((e) => e.count),
                  backgroundColor: "#a78bfa",
                },
              ],
            }}
          />
        </div>

        <div className="chart-container">
          <h4>Student Health Profiles</h4>
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
      <ModalCreateBlog
        show={showModal}
        handleClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default DashBoard;
