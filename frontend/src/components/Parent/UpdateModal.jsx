import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const UpdateModal = ({ showModal, handleClose, handleSave, form, handleChange }) => {
  return (
    <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Parent Profile</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="full_name"
              value={form.full_name || ""}
              onChange={handleChange}
              placeholder="Enter full name"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              name="phone_number"
              value={form.phone_number || ""}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email || ""}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              name="date_of_birth"
              value={form.date_of_birth?.substring(0, 10) || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Occupation</Form.Label>
            <Form.Control
              type="text"
              name="occupation"
              value={form.occupation || ""}
              onChange={handleChange}
              placeholder="Enter occupation"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={form.address || ""}
              onChange={handleChange}
              placeholder="Enter address"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Identity Number (CCCD)</Form.Label>
            <Form.Control
              type="text"
              name="identity_number"
              value={form.identity_number || ""}
              onChange={handleChange}
              placeholder="Enter CCCD"
            />
          </Form.Group>

          {/* ✅ Avatar URL: hiển thị dạng readonly */}
          <Form.Group className="mb-3">
            <Form.Label>Avatar URL (auto-uploaded)</Form.Label>
            <Form.Control
              type="text"
              name="avatar_url"
              value={form.avatar_url || ""}
              readOnly
              plaintext
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateModal;
