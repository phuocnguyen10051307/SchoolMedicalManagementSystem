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
        <Modal.Title>Chi tiết thông báo y tế</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {data && (
          <div className="modal-notification-body">
            <p><strong>Học sinh:</strong> {data.student_name}</p>
            <p><strong>Loại:</strong> {data.type}</p>
            <div className="notification-details">
              <ul>
                <li><strong>ID Thông báo:</strong> {data.notification_id}</li>
                <li><strong>Vắc xin:</strong> {data.vaccine_name || "—"}</li>
                <li><strong>Trạng thái vắc xin:</strong> {data.student_vaccine_status || "—"}</li>
                <li><strong>Thời gian gửi:</strong> {new Date(data.sent_at).toLocaleString()}</li>
                <li><strong>Đã xem lúc:</strong> {data.seen_at ? new Date(data.seen_at).toLocaleString() : "Chưa xem"}</li>
                <li><strong>Đã duyệt lúc:</strong> {data.acknowledged_at ? new Date(data.acknowledged_at).toLocaleString() : "Chưa duyệt"}</li>
                <li><strong>Ghi chú:</strong> {data.notes || "Không có"}</li>
              </ul>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={onApprove}>✅ Đồng ý</Button>
        <Button variant="danger" onClick={onReject}>❌ Từ chối</Button>
        <Button variant="secondary" onClick={onClose}>Đóng</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalNotification;
