import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const UpdateProfileModal = ({ show, handleClose, handleSave, form, editedNurse, handleChange, setForm }) => {
  const [localImagePreview, setLocalImagePreview] = useState(form.image);

  // Cập nhật preview khi modal mở lại hoặc form.image thay đổi
  useEffect(() => {
    setLocalImagePreview(form.image);
  }, [form.image, show]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const localURL = URL.createObjectURL(file);
    setLocalImagePreview(localURL);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "images"); // Thay bằng preset Cloudinary của bạn nếu khác

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dg1v9rju0/image/upload",
        formData
      );
      const uploadedUrl = res.data.secure_url;
      console.log(uploadedUrl)
      setForm((prev) => ({ ...prev, image: uploadedUrl }));
    } catch (err) {
      console.error("Upload ảnh thất bại:", err);
      alert("Upload ảnh thất bại!");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Profile</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <div className="text-center mb-3">
            <img
              src={localImagePreview}
              alt="Avatar"
              width={120}
              height={120}
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #007bff",
              }}
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
              name="fullName"
              value={editedNurse.fullName ?? form.fullName ?? ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={editedNurse.phone ?? form.phone ?? ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={editedNurse.email ?? form.email ?? ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              name="dob"
              value={
                editedNurse.dob
                  ? editedNurse.dob.includes("/")
                    ? ""
                    : editedNurse.dob
                  : form?.dob?.includes("/")
                    ? ""
                    : form.dob ?? ""
              }
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Occupation</Form.Label>
            <Form.Control
              type="text"
              name="occupation"
              value={form.occupation}
              disabled
              readOnly
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Managed Class</Form.Label>
            <Form.Control
              type="text"
              name="managedClass"
              value={form.managedClass}
              disabled
              readOnly
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateProfileModal;
