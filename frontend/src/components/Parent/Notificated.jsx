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

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const [vaccineRes, checkupRes, eventRes] = await Promise.all([
        getVaccinationNotifications(user.account_id),
        getCheckupNotifications(user.account_id),
        getEventNotifications(user.account_id),
      ]);
      console.log("Vaccination data:", vaccineRes.data);
      setVaccinations(vaccineRes.data);
      setCheckups(checkupRes);
      setEvents(eventRes);
    } catch (err) {
      console.error("Lỗi khi lấy thông báo:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user.account_id]);

  const openModal = async (item, type) => {
    setModalData({ ...item, type });
    if (type === "vaccination") {
      await markVaccinationNotificationSeen(item.notification_id);
    } else if (type === "checkup") {
      await markCheckupNotificationSeen(item.notification_id);
    }
  };

  const handleApprove = async () => {
    let res;
    if (modalData.type === "vaccination") {
      res = await approveVaccinationNotification(modalData.notification_id);
    } else if (modalData.type === "checkup") {
      res = await approveCheckupNotification(modalData.notification_id);
    }
    console.log("Kết quả từ API sau khi đồng ý:", res);
    fetchNotifications();
    setModalData(null);
  };

  const handleReject = async () => {
    if (modalData.type === "vaccination") {
      await rejectVaccinationNotification(modalData.notification_id);
    } else if (modalData.type === "checkup") {
      await rejectCheckupNotification(modalData.notification_id);
    }
    fetchNotifications();
    setModalData(null);
  };

  if (loading) {
    return <div className="notificated-container">Đang tải thông báo...</div>;
  }

  return (
    <>
      <div className="notificated-container">
        <h2>Health Notifications</h2>
        <div className="notificated-tabs">
          <button
            className={activeTab === "vaccination" ? "active" : ""}
            onClick={() => setActiveTab("vaccination")}
          >
            💉 Vaccinations
          </button>
          <button
            className={activeTab === "checkup" ? "active" : ""}
            onClick={() => setActiveTab("checkup")}
          >
            🩺 Checkups
          </button>
          <button
            className={activeTab === "event" ? "active" : ""}
            onClick={() => setActiveTab("event")}
          >
            📅 Events
          </button>
        </div>
      </div>

      <div className="notificated-table-wrapper">
        <div className="notificated-container">
          {activeTab === "vaccination" && (
            <section>
              <h3>Vaccination Notifications</h3>
              <table className="notificated-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Student</th>
                    <th>Vaccine</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {vaccinations.length === 0 ? (
                    <tr>
                      <td colSpan={5}>No vaccination notifications.</td>
                    </tr>
                  ) : (
                    vaccinations.map((item, idx) => (
                      <tr key={idx} className={item.seen_at !== null ? "seen-row" : "unseen-row"}>
                        <td>{new Date(item.sent_at).toLocaleDateString()}</td>
                        <td>{item.student_name}</td>
                        <td>{item.vaccine_name}</td>
                        <td>{item.student_vaccine_status}</td>
                        <td>
                          <button
                            onClick={() => openModal(item, "vaccination")}
                          >
                            👁 View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </section>
          )}

          {activeTab === "checkup" && (
            <section>
              <h3>Checkup Notifications</h3>
              <table className="notificated-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Student</th>
                    <th>Checkup Type</th>
                    <th>Result</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {checkups.length === 0 ? (
                    <tr>
                      <td colSpan={5}>No checkup notifications.</td>
                    </tr>
                  ) : (
                    checkups.map((item, idx) => (
                      <tr key={idx} className={item.seen_at !== null ? "seen-row" : "unseen-row"}>
                        <td>{new Date(item.sent_at).toLocaleDateString()}</td>
                        <td>{item.student_name}</td>
                        <td>{item.checkup_type}</td>
                        <td>{item.result_details || "Đang chờ kết quả"}</td>
                        <td>
                          <button onClick={() => openModal(item, "checkup")}>
                            👁 View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </section>
          )}

          {activeTab === "event" && (
            <section>
              <h3>Event Notifications</h3>
              <table className="notificated-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Student</th>
                    <th>Event</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {events.length === 0 ? (
                    <tr>
                      <td colSpan={4}>No event notifications.</td>
                    </tr>
                  ) : (
                    events.map((item, idx) => (
                      <tr key={idx} className={item.seen_at !== null ? "seen-row" : "unseen-row"}>
                        <td>
                          {new Date(item.event_datetime).toLocaleDateString()}
                        </td>
                        <td>{item.student_name}</td>
                        <td>{item.event_title}</td>
                        <td>{item.event_description}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </section>
          )}
        </div>
      </div>

      <ModalNotification
        data={modalData}
        onApprove={handleApprove}
        onReject={handleReject}
        onClose={() => setModalData(null)}
      />
    </>
  );
};

export default Notificated;
