import React, { useEffect, useState, useContext } from "react";
import {
  getVaccinationNotifications,
  getCheckupNotifications,
  getEventNotifications,
  markVaccinationNotificationSeen,
  rejectVaccinationNotification,
  approveVaccinationNotification,
  markCheckupNotificationSeen,
  rejectCheckupNotification,
  approveCheckupNotification,
} from "../../service/service";
import ModalNotification from "./ModalNotification";
import "./Notificated.scss";
import { AuthContext } from "../../context/AuthContext";

const Notificated = () => {
  const { user } = useContext(AuthContext);
  const [vaccinations, setVaccinations] = useState([]);
  const [checkups, setCheckups] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("vaccination");
  const [modalData, setModalData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchNotifications();
  }, [user.account_id]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const [vaccineRes, checkupRes, eventRes] = await Promise.all([
        getVaccinationNotifications(user.account_id),
        getCheckupNotifications(user.account_id),
        getEventNotifications(user.account_id),
      ]);
      setVaccinations(vaccineRes.data);
      setCheckups(checkupRes);
      setEvents(eventRes);
    } catch (err) {
      console.error("Lỗi khi lấy thông báo:", err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = async (item, type) => {
    setModalData({ ...item, type });
    if (type === "vaccination") {
      await markVaccinationNotificationSeen(item.notification_id);
    } else if (type === "checkup") {
      await markCheckupNotificationSeen(item.notification_id);
    }
  };

  const handleApprove = async () => {
    if (!modalData) return;
    if (modalData.type === "vaccination") {
      await approveVaccinationNotification(modalData.notification_id);
    } else if (modalData.type === "checkup") {
      await approveCheckupNotification(modalData.notification_id);
    }
    fetchNotifications();
    setModalData(null);
  };

  const handleReject = async () => {
    if (!modalData) return;
    if (modalData.type === "vaccination") {
      await rejectVaccinationNotification(modalData.notification_id);
    } else if (modalData.type === "checkup") {
      await rejectCheckupNotification(modalData.notification_id);
    }
    fetchNotifications();
    setModalData(null);
  };

  const getPaginatedData = (data) => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  };

  const renderPagination = (data) => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    if (totalPages <= 1) return null;
    return (
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    );
  };

  const renderTable = (type, data, columns) => (
    <section>
      <h3>{type} Notifications</h3>
      <div className="table-scroll">
        <table className="notificated-table">
          <thead>
            <tr>{columns.map((col) => <th key={col}>{col}</th>)}</tr>
          </thead>
          <tbody>
            {getPaginatedData(data).length === 0 ? (
              <tr>
                <td colSpan={columns.length}>No {type.toLowerCase()} notifications.</td>
              </tr>
            ) : (
              getPaginatedData(data).map((item, idx) => (
                <tr key={idx} className={item.seen_at ? "seen-row" : "unseen-row"}>
                  {type === "Vaccination" && (
                    <>
                      <td>{new Date(item.sent_at).toLocaleDateString()}</td>
                      <td>{item.student_name}</td>
                      <td>{item.vaccine_name}</td>
                      <td>{item.student_vaccine_status}</td>
                      <td>
                        <button onClick={() => openModal(item, "vaccination")}>👁 View</button>
                      </td>
                    </>
                  )}
                  {type === "Checkup" && (
                    <>
                      <td>{new Date(item.sent_at).toLocaleDateString()}</td>
                      <td>{item.student_name}</td>
                      <td>{item.checkup_type}</td>
                      <td>{item.result_details || "Đang chờ kết quả"}</td>
                      <td>
                        <button onClick={() => openModal(item, "checkup")}>👁 View</button>
                      </td>
                    </>
                  )}
                  {type === "Event" && (
                    <>
                      <td>{new Date(item.event_datetime).toLocaleDateString()}</td>
                      <td>{item.student_name}</td>
                      <td>{item.event_title}</td>
                      <td>{item.event_description}</td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {renderPagination(data)}
    </section>
  );

  if (loading) return <div className="notificated-container">Đang tải thông báo...</div>;

  return (
    <div className="notificated-wrapper">
      <div className="notificated-container">
        <div className="notificated-tabs">
          <button
            className={activeTab === "vaccination" ? "active" : ""}
            onClick={() => {
              setActiveTab("vaccination");
              setCurrentPage(1);
            }}
          >
            💉 Vaccinations
          </button>
          <button
            className={activeTab === "checkup" ? "active" : ""}
            onClick={() => {
              setActiveTab("checkup");
              setCurrentPage(1);
            }}
          >
            🩺 Checkups
          </button>
          <button
            className={activeTab === "event" ? "active" : ""}
            onClick={() => {
              setActiveTab("event");
              setCurrentPage(1);
            }}
          >
            📅 Events
          </button>
        </div>

        {activeTab === "vaccination" &&
          renderTable("Vaccination", vaccinations, [
            "Date",
            "Student",
            "Vaccine",
            "Status",
            "Action",
          ])}
        {activeTab === "checkup" &&
          renderTable("Checkup", checkups, [
            "Date",
            "Student",
            "Checkup Type",
            "Result",
            "Action",
          ])}
        {activeTab === "event" &&
          renderTable("Event", events, [
            "Date",
            "Student",
            "Event",
            "Description",
          ])}
      </div>

      <ModalNotification
        data={modalData}
        onApprove={handleApprove}
        onReject={handleReject}
        onClose={() => setModalData(null)}
      />
    </div>
  );
};

export default Notificated;
