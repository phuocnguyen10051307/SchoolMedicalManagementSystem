
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { createVaccinationSchedule } from "../../service/service";

const ModalVaccinationSchedule = ({ show, onClose, accountId, onSuccess }) => {
  const [vaccineName, setVaccineName] = useState("");
  const [vaccinationDate, setVaccinationDate] = useState("");
  const [targetAgeGroup, setTargetAgeGroup] = useState("");

  const handleSubmit = async () => {
    try {
      await createVaccinationSchedule({
        account_id: accountId,
        vaccine_name: vaccineName,
        vaccination_date: vaccinationDate,
        target_age_group: targetAgeGroup,
      });
      alert("Tạo lịch tiêm chủng thành công!");
      onClose();
      onSuccess && onSuccess(); // optional refresh
    } catch (err) {
      alert(err.message || "Tạo lịch thất bại");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Tạo Lịch Tiêm Chủng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Tên vaccine</Form.Label>
            <Form.Control
              type="text"
              value={vaccineName}
              onChange={(e) => setVaccineName(e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Ngày tiêm</Form.Label>
            <Form.Control
              type="date"
              value={vaccinationDate}
              onChange={(e) => setVaccinationDate(e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Nhóm tuổi mục tiêu</Form.Label>
            <Form.Control
              type="text"
              value={targetAgeGroup}
              onChange={(e) => setTargetAgeGroup(e.target.value)}
              placeholder="VD: 3-5"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Tạo lịch
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalVaccinationSchedule;
