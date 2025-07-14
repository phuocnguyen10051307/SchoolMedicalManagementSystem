import React, { useEffect, useState, useContext } from "react";
import {
  getAllVaccinationSchedules,
  createVaccinationScheduleForFE,
} from "../../service/service";
import "./Vaccination.scss";
import { AuthContext } from "../../context/AuthContext";
import { Button, Modal, Form } from "react-bootstrap";

const Vaccination = () => {
  const { user } = useContext(AuthContext);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState({ notes: "" });
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await getAllVaccinationSchedules();
      setSchedules(data);
    } catch (error) {
      console.error("Lỗi khi tải lịch tiêm:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleOpenModal = (schedule) => {
    setSelectedSchedule(schedule);
    setShowModal(true);
    setMessage({ notes: "" }); // reset ghi chú
  };

  const handleSendNotification = async () => {
    if (!message.notes || !selectedSchedule) {
      return alert("Vui lòng nhập ghi chú và chọn lịch tiêm");
    }

    const payload = {
      nurse_account_id: user?.account_id,
      vaccine_name: selectedSchedule.vaccine_name,
      vaccination_date: selectedSchedule.vaccination_date,
      target_age_group: selectedSchedule.target_age_group,
      notes: message.notes,
    };

    console.log("🔍 Gửi lịch tiêm với dữ liệu:", payload);

    try {
      const result = await createVaccinationScheduleForFE(payload);
      console.log("✅ Kết quả:", result);
      alert("Gửi thông báo thành công!");
      setShowModal(false);
      setMessage({ notes: "" });
      setSelectedSchedule(null);
      fetchSchedules();
    } catch (error) {
      console.error("❌ Lỗi khi gửi:", error.message);
      alert(error.message || "Không thể gửi thông báo");
    }
  };

  return (
    <div className="vaccination-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Lịch Tiêm Chủng Có Sẵn</h2>
      </div>

      {loading ? (
        <p>Đang tải danh sách lịch tiêm...</p>
      ) : (
        <div className="schedule-list">
          <table>
            <thead>
              <tr>
                <th>Tên Vắc Xin</th>
                <th>Ngày Tiêm</th>
                <th>Nhóm Tuổi</th>
                <th>Trạng Thái</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => {
                const isPast =
                  new Date(schedule.vaccination_date) < new Date();

                return (
                  <tr key={schedule.schedule_id}>
                    <td>{schedule.vaccine_name}</td>
                    <td>
                      {new Date(
                        schedule.vaccination_date
                      ).toLocaleDateString()}
                    </td>
                    <td>{schedule.target_age_group}</td>
                    <td>{schedule.status}</td>
                    <td>
                      {isPast ? (
                        <span className="text-muted">Đã quá hạn</span>
                      ) : (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleOpenModal(schedule)}
                        >
                          Gửi Thông Báo
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal tạo thông báo */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Tạo Thông Báo và Lịch Tiêm Chủng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formVaccineName" className="mb-3">
              <Form.Label>Tên vắc xin</Form.Label>
              <Form.Control
                type="text"
                value={selectedSchedule?.vaccine_name || ""}
                readOnly
              />
            </Form.Group>

            <Form.Group controlId="formVaccinationDate" className="mb-3">
              <Form.Label>Ngày tiêm</Form.Label>
              <Form.Control
                type="date"
                value={
                  selectedSchedule?.vaccination_date
                    ? new Date(selectedSchedule.vaccination_date)
                        .toISOString()
                        .substring(0, 10)
                    : ""
                }
                readOnly
              />
            </Form.Group>

            <Form.Group controlId="formTargetAgeGroup" className="mb-3">
              <Form.Label>Nhóm tuổi</Form.Label>
              <Form.Control
                type="text"
                value={selectedSchedule?.target_age_group || ""}
                readOnly
              />
            </Form.Group>

            <Form.Group controlId="formNotes" className="mb-3">
              <Form.Label>Ghi chú</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Nhập ghi chú thêm (tuỳ chọn)..."
                value={message.notes}
                onChange={(e) =>
                  setMessage({ ...message, notes: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
          <Button variant="success" onClick={handleSendNotification}>
            Gửi thông báo
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Vaccination;
