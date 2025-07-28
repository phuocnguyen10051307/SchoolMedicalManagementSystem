import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Image, Spinner } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const ModalUpdateProfile = ({ show, onHide, user = {}, onSubmit }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
    date_of_birth: "",
    avatar_url: "",
  });

  const [localImagePreview, setLocalImagePreview] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        address: user.address || "",
        date_of_birth: user.date_of_birth ? user.date_of_birth.slice(0, 10) : "",
        avatar_url: user.avatar_url || "",
      });
      setLocalImagePreview(user.avatar_url || "");
      setSelectedImageFile(null);
    }
  }, [user, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const localURL = URL.createObjectURL(file);
    setLocalImagePreview(localURL);
    setSelectedImageFile(file);
  };

  const handleSubmit = async () => {
    let updatedAvatarUrl = formData.avatar_url;

    if (selectedImageFile) {
      const uploadData = new FormData();
      uploadData.append("file", selectedImageFile);
      uploadData.append("upload_preset", "images"); // Cloudinary preset

      try {
        setUploading(true);
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dg1v9rju0/image/upload",
          uploadData
        );
        updatedAvatarUrl = res.data.secure_url;
      } catch (err) {
        toast.error("Image upload failed");
        console.error(err);
        return;
      } finally {
        setUploading(false);
      }
    }

    if (onSubmit) {
      onSubmit({ ...formData, avatar_url: updatedAvatarUrl });
    }

    onHide();
  };

  const isFormValid = () =>
    formData.full_name.trim() &&
    formData.email.trim() &&
    formData.phone_number.trim();

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Avatar */}
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
              htmlFor="avatar-upload"
              className="btn btn-outline-primary btn-sm d-block mt-2"
              style={{ cursor: "pointer" }}
            >
              {uploading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Uploading...
                </>
              ) : (
                "Choose Image"
              )}
            </Form.Label>
            <Form.Control
              type="file"
              id="avatar-upload"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
              disabled={uploading}
            />
          </div>

          {/* Form Fields */}
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter full name"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={uploading}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!isFormValid() || uploading}
        >
          {uploading ? "Saving..." : "Save Changes"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalUpdateProfile;
