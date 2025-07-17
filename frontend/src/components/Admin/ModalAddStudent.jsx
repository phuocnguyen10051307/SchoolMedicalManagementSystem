import { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { createStudentAccount } from "../../service/service";

const ModalAddStudent = ({ show, onClose, className, onSuccess }) => {
  const [form, setForm] = useState({
    full_name: "",
    date_of_birth: "",
    avatar_url: "",
    address: "",

    father_full_name: "",
    father_phone_number: "",
    father_email: "",
    father_identity_number: "",
    father_occupation: "",

    mother_full_name: "",
    mother_phone_number: "",
    mother_email: "",
    mother_identity_number: "",
    mother_occupation: "",

    guardian_full_name: "",
    guardian_phone_number: "",
    guardian_email: "",
    guardian_identity_number: "",
    guardian_occupation: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await createStudentAccount({ ...form, class_name: className });
      onSuccess(); // reload students
      onClose();
    } catch (err) {
      alert(err.message || "Thêm học sinh thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Thêm học sinh mới</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <h5>Thông tin học sinh</h5>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Họ và tên</Form.Label>
                <Form.Control
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Ngày sinh</Form.Label>
                <Form.Control
                  type="date"
                  name="date_of_birth"
                  value={form.date_of_birth}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Địa chỉ</Form.Label>
            <Form.Control
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ảnh đại diện (URL)</Form.Label>
            <Form.Control
              name="avatar_url"
              value={form.avatar_url}
              onChange={handleChange}
            />
          </Form.Group>

          <hr />
          <h5>Thông tin Cha</h5>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Họ tên cha</Form.Label>
                <Form.Control
                  name="father_full_name"
                  value={form.father_full_name}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="father_email"
                  value={form.father_email}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>CCCD</Form.Label>
                <Form.Control
                  name="father_identity_number"
                  value={form.father_identity_number}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>SĐT</Form.Label>
                <Form.Control
                  name="father_phone_number"
                  value={form.father_phone_number}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Nghề nghiệp</Form.Label>
                <Form.Control
                  name="father_occupation"
                  value={form.father_occupation}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <hr />
          <h5>Thông tin Mẹ</h5>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Họ tên mẹ</Form.Label>
                <Form.Control
                  name="mother_full_name"
                  value={form.mother_full_name}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="mother_email"
                  value={form.mother_email}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>CCCD</Form.Label>
                <Form.Control
                  name="mother_identity_number"
                  value={form.mother_identity_number}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>SĐT</Form.Label>
                <Form.Control
                  name="mother_phone_number"
                  value={form.mother_phone_number}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Nghề nghiệp</Form.Label>
                <Form.Control
                  name="mother_occupation"
                  value={form.mother_occupation}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <hr />
          <h5>Thông tin người giám hộ (nếu có)</h5>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Họ tên</Form.Label>
                <Form.Control
                  name="guardian_full_name"
                  value={form.guardian_full_name}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="guardian_email"
                  value={form.guardian_email}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>CCCD</Form.Label>
                <Form.Control
                  name="guardian_identity_number"
                  value={form.guardian_identity_number}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>SĐT</Form.Label>
                <Form.Control
                  name="guardian_phone_number"
                  value={form.guardian_phone_number}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Nghề nghiệp</Form.Label>
                <Form.Control
                  name="guardian_occupation"
                  value={form.guardian_occupation}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={submitting}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Đang thêm..." : "Thêm học sinh"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAddStudent;
