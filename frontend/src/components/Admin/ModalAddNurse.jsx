import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { createNurseAccount } from "../../service/service";

const ModalAddNurse = ({ show, onClose }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    assigned_class: "", // Thêm vào đây
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createNurseAccount(formData);
      onClose(); 
    } catch (err) {
      console.error("Lỗi khi tạo tài khoản y tá:", err.message);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Tạo tài khoản y tá</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="full_name">
            <Form.Label>Họ tên</Form.Label>
            <Form.Control
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="phone_number">
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="assigned_class">
            <Form.Label>Lớp phụ trách</Form.Label>
            <Form.Control
              type="text"
              name="assigned_class"
              value={formData.assigned_class}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3">
            Tạo tài khoản
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};


export default ModalAddNurse;
