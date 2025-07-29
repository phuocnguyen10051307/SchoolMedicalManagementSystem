import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Image, Spinner } from "react-bootstrap";
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
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setLocalImagePreview(form.avatar_url);
    setSelectedImageFile(null);
  }, [form.avatar_url, showModal]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const localURL = URL.createObjectURL(file);
    setLocalImagePreview(localURL);
    setSelectedImageFile(file);
  };

  const validateForm = (formData) => {
    if (!formData.full_name?.trim()) return "Full name is required";
    if (!/^\d{10}$/.test(formData.phone_number)) return "Phone number must be 10 digits";
    if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) return "Invalid email format";
    return null;
  };

  const handleModalSave = async () => {
    const validationError = validateForm(form);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    let updatedAvatarUrl = form.avatar_url;

    if (selectedImageFile) {
      const formData = new FormData();
      formData.append("file", selectedImageFile);
      formData.append("upload_preset", "images");

      try {
        setUploading(true);
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dg1v9rju0/image/upload",
          formData
        );
        updatedAvatarUrl = res.data.secure_url;
      } catch (error) {
        console.error("Upload ảnh thất bại:", error);
        toast.error("Upload ảnh thất bại");
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    setForm((prev) => ({ ...prev, avatar_url: updatedAvatarUrl }));
    handleSave();
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
              src={localImagePreview}
              roundedCircle
              width={120}
              height={120}
              alt="avatar"
              style={{
                objectFit: "cover",
                border: "2px solid #007bff",
                boxShadow: "0 0 6px rgba(0,0,0,0.2)",
              }}
            />
            <Form.Label
              htmlFor="avatar-upload-modal"
              className="btn btn-outline-primary btn-sm d-block mt-2"
              style={{ cursor: "pointer" }}
            >
              {uploading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Đang upload...
                </>
              ) : (
                "Chọn ảnh mới"
              )}
            </Form.Label>
            <Form.Control
              type="file"
              id="avatar-upload-modal"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
              disabled={uploading}
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
        <Button variant="secondary" onClick={handleClose} disabled={uploading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleModalSave} disabled={uploading}>
          {uploading ? "Đang lưu..." : "Save Changes"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateModal;
