// src/pages/Admin/ModalDashboardChart.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần của chart.js
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ModalDashboardChart = ({ show, onHide, data }) => {
  if (!data) return null;

  // Chuẩn bị dữ liệu cho biểu đồ
  const chartData = {
    labels: [
      "Tổng học sinh",
      "Khám sức khỏe",
      "Sự kiện y tế",
      "Tiêm chủng xong",
      "Yêu cầu thuốc",
    ],
    datasets: [
      {
        label: "Số lượng",
        data: [
          data.total_students,
          data.total_checkups,
          data.total_medical_events,
          data.total_vaccinations_completed,
          data.total_medicine_requests,
        ],
        backgroundColor: [
          "#36a2eb",
          "#ffcd56",
          "#4bc0c0",
          "#ff6384",
          "#9966ff",
        ],
        borderRadius: 6,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Thống kê hệ thống</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ padding: "1rem" }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDashboardChart;
