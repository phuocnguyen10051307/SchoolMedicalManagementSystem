import React, { useState, useContext } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { createBlogs } from "../../service/service";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

const ModalCreateBlog = ({ show, handleClose }) => {
  const { user } = useContext(AuthContext); // Lấy thông tin nurse đang đăng nhập

  const [form, setForm] = useState({
    title: "",
    content: "",
    tags: "",
    visibility_status: "PUBLIC",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        ...form,
        tags: form.tags.split(",").map((tag) => tag.trim()),
        nurse_account_id: user?.account_id,
      };

      await createBlogs(dataToSend);
      toast.success("Blog created successfully!");
      handleClose();
    } catch (err) {
      toast.error(err.message || "Failed to create blog");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>📝 Viết Blog mới</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Tiêu đề</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Nhập tiêu đề blog..."
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Nội dung</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Nội dung blog..."
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Tags (phân cách bằng dấu phẩy)</Form.Label>
            <Form.Control
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="ví dụ: sốt, ho, viêm họng"
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Trạng thái hiển thị</Form.Label>
            <Form.Select
              name="visibility_status"
              value={form.visibility_status}
              onChange={handleChange}
            >
              <option value="PUBLIC">Công khai</option>
              <option value="PRIVATE">Riêng tư</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Tạo Blog
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalCreateBlog;
