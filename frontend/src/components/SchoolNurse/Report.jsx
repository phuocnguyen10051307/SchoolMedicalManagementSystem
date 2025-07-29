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
      console.error("Error fetching report data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, nurse_id]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Nurse Report</h2>
      <div className="report-tab-buttons">
        <button
          onClick={() => setActiveTab("events")}
          className={activeTab === "events" ? "active-button" : ""}
        >
          Medical Events
        </button>
        <button
          onClick={() => setActiveTab("checkups")}
          className={activeTab === "checkups" ? "active-button" : ""}
        >
          Health Checkups
        </button>
        <button
          onClick={() => setActiveTab("vaccinations")}
          className={activeTab === "vaccinations" ? "active-button" : ""}
        >
          Vaccinations
        </button>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div>
          {data.length === 0 ? (
            <p>No data available</p>
          ) : (
            <div className="report-content-scroll">
              <ListGroup>
                {[...data]
                  .sort((a, b) => {
                    const now = new Date();

                    const dateA =
                      activeTab === "events"
                        ? new Date(a.event_datetime)
                        : activeTab === "checkups"
                        ? new Date(a.checkup_date)
                        : new Date(a.vaccination_date);

                    const dateB =
                      activeTab === "events"
                        ? new Date(b.event_datetime)
                        : activeTab === "checkups"
                        ? new Date(b.checkup_date)
                        : new Date(b.vaccination_date);

                    const isFutureA = dateA > now;
                    const isFutureB = dateB > now;

                    if (isFutureA && !isFutureB) return -1;
                    if (!isFutureA && isFutureB) return 1;

                    return dateB - dateA;
                  })
                  .map((item, index) => (
                    <ListGroup.Item
                      key={index}
                      className="d-flex justify-content-between align-items-center"
                      style={{
                        borderLeft: "5px solid #0d6efd",
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
                              Health
                            </Badge>
                            <div className="text-muted small">
                              Date:{" "}
                              {new Date(item.checkup_date).toLocaleDateString()}
                            </div>
                          </>
                        )}
                        {activeTab === "vaccinations" && (
                          <>
                            <strong>{item.vaccine_name}</strong>{" "}
                            <Badge bg="warning" text="dark" className="ms-2">
                              Vaccination
                            </Badge>
                            <div className="text-muted small">
                              Date:{" "}
                              {new Date(
                                item.vaccination_date
                              ).toLocaleDateString()}
                            </div>
                          </>
                        )}
                      </div>
                    </ListGroup.Item>
                  ))}
              </ListGroup>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Report;
