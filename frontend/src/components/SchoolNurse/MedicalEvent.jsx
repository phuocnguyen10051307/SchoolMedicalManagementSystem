import React, { useRef, useState } from 'react';
import './MedicalEvent.css';
import { Scrollbars } from 'react-custom-scrollbars-2';

const MedicalEvent = () => {
    const fileInputRef = useRef(null);
    const [previewImage, setPreviewImage] = useState(null);

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setPreviewImage(null);
        fileInputRef.current.value = null;
    };

    return (
        <div className="medical-event-container">
            <form className="medical-event-form">
                <Scrollbars style={{ height: '100%', width: '100%' }}>
                    <div className="medical-form-content">
                        <h2 className="medical-event-title">Health Event</h2>

                        <div className="form-left">
                            <div className="form-group floating-label">
                                <label htmlFor="studentName">Student Name:</label>
                                <select id="studentName">
                                    <option>Select Name of Student in class</option>
                                </select>
                            </div>
                            <div className='form-group floating-label'>
                                <label htmlFor='studentClass'>Student Class:</label>
                                <input type='text' id="studentClass" placeholder='Enter class of student' />
                            </div>

                            <div className="form-group floating-label">
                                <label htmlFor="eventType">Event Type:</label>
                                <select id="eventType">
                                    <option>Select Event Type</option>
                                    <option>Fever</option>
                                    <option>injury</option>
                                    <option>fall</option>
                                    <option>epidemic case</option>
                                    <option>allergic reaction</option>
                                    <option>stomachache</option>
                                    <option>nosebleed</option>
                                    <option>headache</option>
                                </select>
                            </div>

                            <div className="form-group floating-label">
                                <label htmlFor="eventTitle">Event Title:</label>
                                <input type="text" id="eventTitle" placeholder="Enter event title" />
                            </div>

                            <div className="form-group floating-label">
                                <label htmlFor="eventDesc">Event Description:</label>
                                <textarea id="eventDesc" placeholder="Detailed description of the medical event..." />
                            </div>

                            <div className="form-group floating-label">
                                <label htmlFor="reportBy">Report by:</label>
                                <input type="text" id="reportBy" placeholder="Enter Name or roles" />
                            </div>

                            <div className="form-group floating-label">
                                <label htmlFor="severity">Severity level:</label>
                                <select id="severity">
                                    <option>Select severity level</option>
                                </select>
                            </div>

                            <div className="form-group floating-label">
                                <label htmlFor="location">Location:</label>
                                <input type="text" id="location" placeholder="Enter the event location" />
                            </div>

                            <div className="form-group floating-label">
                                <label htmlFor="medicationName">Medication Name:</label>
                                <select id="medicationName">
                                    <option>Enter medication name</option>
                                </select>
                            </div>

                            <div className="form-group floating-label">
                                <label htmlFor="dosage">Dosage:</label>
                                <input type="text" id="dosage" placeholder="Enter Dosage" />
                            </div>

                            <div className="form-group floating-label">
                                <label htmlFor="adminMethod">Administration method:</label>
                                <input type="text" id="adminMethod" placeholder="Enter administration method" />
                            </div>

                            <div className="form-group floating-label">
                                <label htmlFor="notes">Notes:</label>
                                <textarea id="notes" placeholder="Detailed description of the medical event..." />
                            </div>

                            <div className="form-group">
                                <button type="button" className="upload-button" onClick={handleUploadClick}>
                                    <img
                                        src="https://img.icons8.com/?size=100&id=102544&format=png&color=000000"
                                        alt="Upload Icon"
                                        className="plus-icon"
                                    />
                                    Upload file image event
                                </button>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                            </div>

                            <div className="image-preview">
                                <div className="image-box">
                                    {previewImage ? (
                                        <div className="image-container">
                                            <img src={previewImage} alt="Preview" className="preview-img" />
                                            <button
                                                type="button"
                                                className="remove-image-btn"
                                                onClick={handleRemoveImage}
                                            >
                                                ✖
                                            </button>
                                        </div>
                                    ) : (
                                        "Review Image"
                                    )}
                                </div>
                            </div>

                            <button type="submit" className="submit-button">SUBMIT</button>
                        </div>
                    </div>
                </Scrollbars>
            </form>

            <div className="recent-events">
                <h3>Recent Events</h3>
                <div className="event-card">
                    <p>Emma Johnson - 5A</p>
                    <p>High fever</p>
                    <p>10:30 AM, June 14, 2025</p>
                    <p>Medication given: Paracetamol 250mg</p>
                    <button className="view-button">view</button>
                </div>
            </div>
        </div>
    );
};

export default MedicalEvent;
