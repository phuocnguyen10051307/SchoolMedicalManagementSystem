import React, { useEffect, useState, useContext } from "react";
import {
  getAllVaccinationSchedules,
  activateVaccinationScheduleService,
} from "../../service/service";
import "./Vaccination.scss";
import { AuthContext } from "../../context/AuthContext";
import { Button, Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";

const Vaccination = () => {
  const { user } = useContext(AuthContext);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState({ notes: "" });
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // 🔹 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSchedules = schedules.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(schedules.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await getAllVaccinationSchedules();
      const sortedData = data.sort((a, b) => {
        if (a.status === "PENDING" && b.status !== "PENDING") return -1;
        if (a.status !== "PENDING" && b.status === "PENDING") return 1;
        return 0;
      });

      setSchedules(sortedData);
    } catch (error) {
      console.error("Error loading vaccination schedules:", error.message);
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
    setMessage({ notes: "" });
  };

  const handleSendNotification = async () => {
    if (!message.notes || !selectedSchedule) {
      return toast("Please enter a note and select a vaccination schedule.");
    }

    const payload = {
      nurse_account_id: user?.account_id,
      schedule_id: selectedSchedule.schedule_id,
      notes: message.notes,
    };

    try {
      const result = await activateVaccinationScheduleService(payload);
      toast.success("Notification sent successfully!");
      setShowModal(false);
      setMessage({ notes: "" });
      setSelectedSchedule(null);
      fetchSchedules();
    } catch (error) {
      console.error("❌ Error sending notification:", error.message);
      toast.error(error.message || "Unable to send notification.");
    }
  };

  return (
    <div className="vaccination-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Available Vaccination Schedules</h2>
      </div>

      {loading ? (
        <p>Loading vaccination schedules...</p>
      ) : (
        <div className="schedule-list">
          <table>
            <thead>
              <tr>
                <th>Vaccine Name</th>
                <th>Vaccination Date</th>
                <th>Age Group</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentSchedules.map((schedule) => {
                const isPast = new Date(schedule.vaccination_date) < new Date();

                return (
                  <tr key={schedule.schedule_id}>
                    <td>{schedule.vaccine_name}</td>
                    <td>
                      {new Date(schedule.vaccination_date).toLocaleDateString()}
                    </td>
                    <td>{schedule.target_age_group}</td>
                    <td>{schedule.status}</td>
                    <td>
                      {isPast ? (
                        <span className="text-muted">Expired</span>
                      ) : schedule.status === "ACTIVE" ? (
                        <span className="text-muted">Already Sent</span>
                      ) : (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleOpenModal(schedule)}
                        >
                          Send Notification
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* 🔹 Pagination buttons */}
          {totalPages > 1 && (
            <div className="pagination d-flex justify-content-center mt-3">
              {[...Array(totalPages)].map((_, index) => (
                <Button
                  key={index + 1}
                  variant={
                    currentPage === index + 1 ? "primary" : "outline-primary"
                  }
                  onClick={() => handlePageChange(index + 1)}
                  className="mx-1"
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal for creating notification */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Notification and Vaccination Schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formVaccineName" className="mb-3">
              <Form.Label>Vaccine Name</Form.Label>
              <Form.Control
                type="text"
                value={selectedSchedule?.vaccine_name || ""}
                readOnly
              />
            </Form.Group>

            <Form.Group controlId="formVaccinationDate" className="mb-3">
              <Form.Label>Vaccination Date</Form.Label>
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
              <Form.Label>Age Group</Form.Label>
              <Form.Control
                type="text"
                value={selectedSchedule?.target_age_group || ""}
                readOnly
              />
            </Form.Group>

            <Form.Group controlId="formNotes" className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter additional notes (optional)..."
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
            Close
          </Button>
          <Button variant="success" onClick={handleSendNotification}>
            Send Notification
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Vaccination;
