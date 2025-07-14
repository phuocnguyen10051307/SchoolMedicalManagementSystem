import React, { useState, useEffect , useContext} from "react";
import {
  getMedicalEventsByNurseService,
  getHealthCheckupsByNurseService,
  getVaccinationReportsByNurseService,
} from "../../service/service";
import { useOutletContext } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Report.scss"

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
      <div style={{ marginBottom: "20px" }}>
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
            <ul>
              {data.map((item, index) => (
                <li key={index} style={{ marginBottom: "10px" }}>
                  {activeTab === "events" && (
                    <>
                      <strong>{item.event_title}</strong> - {item.event_type} (
                      {new Date(item.event_datetime).toLocaleString()})
                    </>
                  )}
                  {activeTab === "checkups" && (
                    <>
                      <strong>{item.checkup_type}</strong> - Ngày kiểm tra:{" "}
                      {new Date(item.checkup_date).toLocaleDateString()}
                    </>
                  )}
                  {activeTab === "vaccinations" && (
                    <>
                      <strong>{item.vaccine_name}</strong> - Tiêm vào:{" "}
                      {new Date(item.vaccination_date).toLocaleDateString()}
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Report;
