import React from "react";
import { Modal, Button, Table, Badge } from "react-bootstrap";
import "./CheckupViewModal.scss";

const CheckupViewModal = ({ show, handleClose, checkupData }) => {
  if (!checkupData) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Thống kê theo lớp</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {checkupData.data.length === 0 ? (
          <p>Không có dữ liệu</p>
        ) : (
          checkupData.data.map((cls, idx) => (
            <div className="class-section" key={idx}>
              <h5>Lớp: {cls.class_name}</h5>
              <div className="status-summary">
                <Badge bg="success">Đồng ý: {cls.statistics.APPROVED}</Badge>
                <Badge bg="warning" className="mx-2">
                  Chờ: {cls.statistics.PENDING}
                </Badge>
                <Badge bg="danger">Từ chối: {cls.statistics.REJECT}</Badge>
              </div>
              <Table striped bordered hover size="sm" className="mt-2">
                <thead>
                  <tr>
                    <th>Mã HS</th>
                    <th>Họ tên</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {cls.students.map((student) => (
                    <tr key={student.student_id}>
                      <td>{student.student_id}</td>
                      <td>{student.student_name}</td>
                      <td>
                        <Badge
                          bg={
                            student.notification_status === "APPROVED"
                              ? "success"
                              : student.notification_status === "REJECT"
                              ? "danger"
                              : "warning"
                          }
                        >
                          {student.notification_status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ))
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CheckupViewModal;
