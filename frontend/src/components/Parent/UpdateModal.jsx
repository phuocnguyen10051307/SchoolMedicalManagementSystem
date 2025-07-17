import React, { useState } from "react";
import { Modal, Button, Form, Image } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const UpdateModal = ({
  showModal,
  handleClose,
  handleSave,
  form,
  setForm,
  handleChange,
}) => {
  const [localImagePreview, setLocalImagePreview] = useState(form.avatar_url);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const localURL = URL.createObjectURL(file);
    setLocalImagePreview(localURL);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "images"); // Cloudinary preset

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dg1v9rju0/image/upload",
        formData
      );

      const uploadedUrl = res.data.secure_url;
      setForm((prev) => ({ ...prev, avatar_url: uploadedUrl }));
    } catch (error) {
      console.error("Upload thất bại:", error);
      toast.error("Upload ảnh thất bại");
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Parent Profile</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <div className="text-center mb-3">
            <Image
              src={form.avatar_url}
              roundedCircle
              width={120}
              height={120}
              alt="avatar"
              style={{ objectFit: "cover", border: "2px solid #007bff", boxShadow: "0 0 6px rgba(0,0,0,0.2)" }}
            />
            <Form.Label
              htmlFor="avatar-upload-modal"
              className="btn btn-outline-primary btn-sm d-block mt-2"
              style={{ cursor: "pointer" }}
            >
              Chọn ảnh mới
            </Form.Label>
            <Form.Control
              type="file"
              id="avatar-upload-modal"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>

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
            <Form.Label>CCCD</Form.Label>
            <Form.Control
              type="text"
              name="identity_number"
              value={form.identity_number || ""}
              onChange={handleChange}
              placeholder="Enter identity number"
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
