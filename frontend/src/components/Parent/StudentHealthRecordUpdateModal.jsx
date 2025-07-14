import React, { useState, useEffect, useContext } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { putHealthProfileOfStudent } from "../../service/service";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

const StudentHealthRecordUpdateModal = ({
  show,
  handleClose,
  currentForm,
  onSave,
}) => {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState(currentForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(currentForm);
    setErrors({});
  }, [show, currentForm]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const validate = () => {
    const e = {};
    if (!form.height_cm) e.height_cm = "Required";
    if (!form.weight_kg) e.weight_kg = "Required";
    if (!form.blood_type) e.blood_type = "Required";
    // if (!form.chronic_conditions) e.chronic_conditions = "Required";
    // if (!form.allergies) e.allergies = "Required";
    // if (!form.regular_medications) e.regular_medications = "Required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    // ✨ Convert empty fields to null
    const cleanedForm = {
      height: form.height_cm || null,
      weight: form.weight_kg || null,
      blood_type: form.blood_type || null,
      chronic_conditions: form.chronic_conditions || null,
      allergies: form.allergies || null,
      regular_medications: form.regular_medications || null,
      additional_notes: form.additional_notes || null,
    };

    try {
      await putHealthProfileOfStudent(
        user.account_id,
        cleanedForm.height,
        cleanedForm.weight,
        cleanedForm.blood_type,
        cleanedForm.chronic_conditions,
        cleanedForm.allergies,
        cleanedForm.regular_medications,
        cleanedForm.additional_notes
      );

      toast.success("Cập nhật thành công!");
      onSave({ ...form }); // giữ lại form để UI update
      handleClose();
    } catch (err) {
      toast.error(err.message || "Cập nhật thất bại!");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Update Health Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Height (cm)</Form.Label>
            <Form.Control
              name="height_cm"
              type="number"
              value={form.height_cm}
              onChange={handleChange}
              isInvalid={!!errors.height_cm}
            />
            <Form.Control.Feedback type="invalid">
              {errors.height_cm}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Weight (kg)</Form.Label>
            <Form.Control
              name="weight_kg"
              type="number"
              value={form.weight_kg}
              onChange={handleChange}
              isInvalid={!!errors.weight_kg}
            />
            <Form.Control.Feedback type="invalid">
              {errors.weight_kg}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Blood Type</Form.Label>
            <Form.Select
              name="blood_type"
              value={form.blood_type}
              onChange={handleChange}
              isInvalid={!!errors.blood_type}
            >
              <option value="">Select</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
              <option value="O">O</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.blood_type}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Chronic Conditions</Form.Label>
            <Form.Control
              name="chronic_conditions"
              value={form.chronic_conditions}
              onChange={handleChange}
              isInvalid={!!errors.chronic_conditions}
            />
            <Form.Control.Feedback type="invalid">
              {errors.chronic_conditions}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Allergies</Form.Label>
            <Form.Control
              name="allergies"
              value={form.allergies}
              onChange={handleChange}
              isInvalid={!!errors.allergies}
            />
            <Form.Control.Feedback type="invalid">
              {errors.allergies}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Regular Medications</Form.Label>
            <Form.Control
              name="regular_medications"
              value={form.regular_medications}
              onChange={handleChange}
              isInvalid={!!errors.regular_medications}
            />
            <Form.Control.Feedback type="invalid">
              {errors.regular_medications}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Additional Notes</Form.Label>
            <Form.Control
              as="textarea"
              name="additional_notes"
              rows={3}
              value={form.additional_notes}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default StudentHealthRecordUpdateModal;
