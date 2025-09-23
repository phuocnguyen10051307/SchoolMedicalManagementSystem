import React from "react";
import { Modal, Button } from "react-bootstrap";
import "./ModalNotification.scss";

const ModalNotification = ({ data, onApprove, onReject, onClose }) => {
  return (
    <Modal
      show={!!data}
      onHide={onClose}
      centered
      dialogClassName="modal-notification-custom"
    >
      <Modal.Header closeButton>
        <Modal.Title>Notification Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {data && (
          <div className="modal-notification-body">
            <p><strong>Student:</strong> {data.student_name}</p>
            <p><strong>Type:</strong> {data.type}</p>
            <div className="notification-details">
              <ul>
                {data.type === "vaccination" && (
                  <>
                    <li><strong>Vaccine:</strong> {data.vaccine_name || "—"}</li>
                    <li><strong>Vaccination Status:</strong> {data.student_vaccine_status || "—"}</li>
                  </>
                )}

                {data.type === "checkup" && (
                  <>
                    <li><strong>Checkup Type:</strong> {data.checkup_type}</li>
                    <li><strong>Result:</strong> {data.result_details || "Pending"}</li>
                  </>
                )}

                <li><strong>Acknowledged at:</strong> {data.acknowledged_at ? new Date(data.acknowledged_at).toLocaleString() : "Not acknowledged yet"}</li>
                <li><strong>Notes:</strong> {data.notes || "None"}</li>
              </ul>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        {(data?.type === "vaccination" || data?.type === "checkup") && (
          <>
            <Button variant="success" onClick={onApprove}>✅ Approve</Button>
            <Button variant="danger" onClick={onReject}>❌ Reject</Button>
          </>
        )}
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalNotification;
