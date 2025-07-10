import React, { useEffect, useState } from 'react';
import './Profile.css';
import nurse2 from '../../images/nurse2.png';
import { Modal, Button, Form } from 'react-bootstrap';

const formatDateForInput = (dob) => {
  if (!dob.includes('/')) return dob;
  const [day, month, year] = dob.split('/');
  return `${year}-${month}-${day}`;
};

const formatDateForDisplay = (inputDate) => {
  if (!inputDate.includes('-')) return inputDate;
  const [year, month, day] = inputDate.split('-');
  return `${day}/${month}/${year}`;
};

const Profile = () => {
  const [nurse, setNurse] = useState({
    image: nurse2,
    fullName: 'Sarah Pino',
    phone: '+84 912 345 678',
    email: 'sarah.nurse@example.com',
    dob: '15/08/1990',
    occupation: 'School Nurse',
    managedClass: '1A15',
  });

  const [editedNurse, setEditedNurse] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('nurseProfile');
    if (saved) setNurse(JSON.parse(saved));
  }, []);

  const handleShow = () => {
    setEditedNurse({ ...nurse });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false); 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === 'dob' ? formatDateForDisplay(value) : value;
    setEditedNurse((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSave = () => {
    setNurse(editedNurse);
    localStorage.setItem('nurseProfile', JSON.stringify(editedNurse));
    setShowModal(false);
  };

  const profileFields = [
    { label: 'Full Name', name: 'fullName', type: 'text' },
    { label: 'Phone', name: 'phone', type: 'text' },
    { label: 'Email', name: 'email', type: 'email' },
    { label: 'Date of Birth', name: 'dob', type: 'date' },
    { label: 'Occupation', name: 'occupation', type: 'text' },
    { label: 'Managed Class', name: 'managedClass', type: 'text' },
  ];

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>My Profile</h2>
        <button className="update-btn" onClick={handleShow}>
          Update Profile
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-image">
          <img src={nurse.image} alt="Nurse Avatar" />
        </div>
        <div className="profile-info">
          <div className="info-item"><strong>Full Name:</strong> {nurse.fullName}</div>
          <div className="info-item"><strong>Phone:</strong> {nurse.phone}</div>
          <div className="info-item"><strong>Email:</strong> {nurse.email}</div>
          <div className="info-item"><strong>Date of Birth:</strong> {formatDateForDisplay(nurse.dob)}</div>
          <div className="info-item"><strong>Occupation:</strong> {nurse.occupation}</div>
          <div className="info-item"><strong>Managed Class:</strong> {nurse.managedClass}</div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Nurse Profile</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            {profileFields.map(({ label, name, type }) => (
              <Form.Group key={name} className="mb-3">
                <Form.Label>{label}</Form.Label>
                <Form.Control
                  type={type}
                  name={name}
                  value={
                    name === 'dob'
                      ? formatDateForInput(editedNurse.dob || '')
                      : editedNurse[name] || ''
                  }
                  onChange={handleChange}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <div className="d-flex justify-content-end gap-2 w-100">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleSave}>
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profile;
