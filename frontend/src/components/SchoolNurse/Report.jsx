import React, { useState, useEffect, useContext } from "react";
import {
  getMedicalEventsByNurseService,
  getHealthCheckupsByNurseService,
  getVaccinationReportsByNurseService,
} from "../../service/service";
import { useOutletContext } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Report.scss";
import { Card, ListGroup, Badge } from "react-bootstrap";

const Report = () => {
  const { user } = useContext(AuthContext);
  const { nurseData } = useOutletContext();
  const nurse_id = user?.account_id;

  const [activeTab, setActiveTab] = useState("events");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!nurse_id) return;
    setLoading(true);
    try {
      let res;
      if (activeTab === "events") {
        res = await getMedicalEventsByNurseService(nurse_id);
      } else if (activeTab === "checkups") {
        res = await getHealthCheckupsByNurseService(nurse_id);
      } else if (activeTab === "vaccinations") {
        res = await getVaccinationReportsByNurseService(nurse_id);
      }
      setData(res);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu báo cáo:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, nurse_id]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Báo cáo của Y tá</h2>
      <div className="report-tab-buttons">
        <button
          onClick={() => setActiveTab("events")}
          className={activeTab === "events" ? "active-button" : ""}
        >
          Sự kiện y tế
        </button>
        <button
          onClick={() => setActiveTab("checkups")}
          className={activeTab === "checkups" ? "active-button" : ""}
        >
          Kiểm tra sức khỏe
        </button>
        <button
          onClick={() => setActiveTab("vaccinations")}
          className={activeTab === "vaccinations" ? "active-button" : ""}
        >
          Tiêm chủng
        </button>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div>
          {data.length === 0 ? (
            <p>Không có dữ liệu</p>
          ) : (
            <ListGroup>
              {data.map((item, index) => (
                <ListGroup.Item
                  key={index}
                  className="d-flex justify-content-between align-items-center"
                  style={{
                    borderLeft: "5px solid #0d6efd", // Bootstrap blue
                    marginBottom: "10px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  }}
                >
                  <div>
                    {activeTab === "events" && (
                      <>
                        <strong>{item.event_title}</strong>{" "}
                        <Badge bg="primary" className="ms-2">
                          {item.event_type}
                        </Badge>
                        <div className="text-muted small">
                          {new Date(item.event_datetime).toLocaleString()}
                        </div>
                      </>
                    )}
                    {activeTab === "checkups" && (
                      <>
                        <strong>{item.checkup_type}</strong>{" "}
                        <Badge bg="success" className="ms-2">
                          Sức khỏe
                        </Badge>
                        <div className="text-muted small">
                          Ngày kiểm tra:{" "}
                          {new Date(item.checkup_date).toLocaleDateString()}
                        </div>
                      </>
                    )}
                    {activeTab === "vaccinations" && (
                      <>
                        <strong>{item.vaccine_name}</strong>{" "}
                        <Badge bg="warning" text="dark" className="ms-2">
                          Tiêm chủng
                        </Badge>
                        <div className="text-muted small">
                          Tiêm vào:{" "}
                          {new Date(item.vaccination_date).toLocaleDateString()}
                        </div>
                      </>
                    )}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>
      )}
    </div>
  );
};

export default Report;
