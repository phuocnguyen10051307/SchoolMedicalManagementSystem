import React, { useRef, useState, useEffect } from 'react';
import './MedicalEvent.scss';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { Modal, Button } from 'react-bootstrap';

const MedicalEvent = () => {
    const fileInputRef = useRef(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventType, setEventType] = useState('');
    const [customEventType, setCustomEventType] = useState('');

    useEffect(() => {
        const storedEvents = JSON.parse(localStorage.getItem('medicalEvents')) || [];
        setEvents(storedEvents);
    }, []);

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
        reader.onloadend = () => setPreviewImage(reader.result);
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setPreviewImage(null);
        fileInputRef.current.value = null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const finalEventType = eventType === 'Other' ? customEventType : eventType;

        const newEvent = {
            studentName: document.getElementById("studentName").value,
            studentClass: document.getElementById("studentClass").value,
            eventType: finalEventType,
            eventTitle: document.getElementById("eventTitle").value,
            eventDesc: document.getElementById("eventDesc").value,
            reportBy: document.getElementById("reportBy").value,
            severity: document.getElementById("severity").value,
            location: document.getElementById("location").value,
            medicationName: document.getElementById("medicationName").value,
            dosage: document.getElementById("dosage").value,
            adminMethod: document.getElementById("adminMethod").value,
            notes: document.getElementById("notes").value,
            image: previewImage,
            time: new Date().toLocaleString()
        };

        const updatedEvents = [...events, newEvent];
        setEvents(updatedEvents);
        localStorage.setItem('medicalEvents', JSON.stringify(updatedEvents));

        e.target.reset();
        setPreviewImage(null);
        setEventType('');
        setCustomEventType('');
    };

    return (
        <div className="medical-event-container">
            <form className="medical-event-form" onSubmit={handleSubmit}>
                <Scrollbars style={{ height: '100%', width: '100%' }}>
                    <div className="medical-form-content">
                        <h2 className="medical-event-title">Health Event</h2>
                        <div className="form-left">
                            <div className="form-group floating-label">
                                <label htmlFor="studentName">Student Name:</label>
                                <select id="studentName" required>
                                    <option value="">Select Name of Student in class</option>
                                    <option value="Emma">Emma Johnson</option>
                                    <option value="Liam">Liam Smith</option>
                                    <option value="Noah">Noah Brown</option>
                                </select>
                            </div>
                            <div className='form-group floating-label'>
                                <label htmlFor='studentClass'>Student Class:</label>
                                <input type='text' id="studentClass" placeholder='Enter class of student' required />
                            </div>
                            <div className="form-group floating-label">
                                <label htmlFor="eventType">Event Type:</label>
                                <select
                                    id="eventType"
                                    value={eventType}
                                    onChange={e => setEventType(e.target.value)}
                                    required
                                >
                                    <option value="">Select Event Type</option>
                                    <option value="Fever">Fever</option>
                                    <option value="Injury">Injury</option>
                                    <option value="Fall">Fall</option>
                                    <option value="Epidemic">Epidemic case</option>
                                    <option value="Allergic">Allergic reaction</option>
                                    <option value="Stomachache">Stomachache</option>
                                    <option value="Nosebleed">Nosebleed</option>
                                    <option value="Headache">Headache</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {eventType === 'Other' && (
                                <div className="form-group floating-label">
                                    <input
                                        type="text"
                                        id="customEventType"
                                        placeholder="Enter custom event type"
                                        value={customEventType}
                                        onChange={e => setCustomEventType(e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            <div className="form-group floating-label">
                                <label htmlFor="eventTitle">Event Title:</label>
                                <input type="text" id="eventTitle" placeholder="Enter event title" required/>
                            </div>
                            <div className="form-group floating-label">
                                <label htmlFor="eventDesc">Event Description:</label>
                                <textarea id="eventDesc" placeholder="Detailed description..." required/>
                            </div>
                            <div className="form-group floating-label">
                                <label htmlFor="reportBy">Report by:</label>
                                <input type="text" id="reportBy" placeholder="Enter Name or roles" required/>
                            </div>
                            <div className="form-group floating-label">
                                <label htmlFor="severity">Severity level:</label>
                                <select id="severity" required>
                                    <option value="">Select severity level</option>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                            <div className="form-group floating-label">
                                <label htmlFor="location">Location:</label>
                                <input type="text" id="location" placeholder="Enter the event location" required/>
                            </div>
                            <div className="form-group floating-label">
                                <label htmlFor="medicationName">Medication Name:</label>
                                <select id="medicationName" required>
                                    <option value="">Select medication</option>
                                    <option value="Paracetamol">Paracetamol</option>
                                    <option value="Ibuprofen">Ibuprofen</option>
                                    <option value="Antihistamine">Antihistamine</option>
                                </select>
                            </div>
                            <div className="form-group floating-label">
                                <label htmlFor="dosage">Dosage:</label>
                                <input type="text" id="dosage" placeholder="Enter Dosage" required/>
                            </div>
                            <div className="form-group floating-label">
                                <label htmlFor="adminMethod">Administration method:</label>
                                <input type="text" id="adminMethod" placeholder="Enter administration method" required/>
                            </div>
                            <div className="form-group floating-label">
                                <label htmlFor="notes">Notes:</label>
                                <textarea id="notes" placeholder="Additional notes..." required/>
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
                <div className="recent-events-scroll">
                    <Scrollbars style={{ height: '100%', width: '100%' }}>
                        {events.map((ev, index) => (
                            <div className="event-card" key={index}>
                                <p>{ev.studentName} - {ev.studentClass}</p>
                                <p>{ev.severity} {ev.eventType}</p>
                                <p>{ev.time}</p>
                                <p>Medication given: {ev.medicationName} {ev.dosage}</p>
                                <button
                                    className="view-button"
                                    onClick={() => setSelectedEvent(ev)} 
                                >
                                    View
                                </button>
                            </div>
                        ))}
                    </Scrollbars>
                </div>
            </div>

            <Modal show={!!selectedEvent} onHide={() => setSelectedEvent(null)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Event Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedEvent && (
                        <>
                            <p><strong>Name:</strong> {selectedEvent.studentName}</p>
                            <p><strong>Class:</strong> {selectedEvent.studentClass}</p>
                            <p><strong>Event Type:</strong> {selectedEvent.eventType}</p>
                            <p><strong>Event Title:</strong> {selectedEvent.eventTitle}</p>
                            <p><strong>Description:</strong> {selectedEvent.eventDesc}</p>
                            <p><strong>Reported By:</strong> {selectedEvent.reportBy}</p>
                            <p><strong>Severity:</strong> {selectedEvent.severity}</p>
                            <p><strong>Location:</strong> {selectedEvent.location}</p>
                            <p><strong>Medication:</strong> {selectedEvent.medicationName}</p>
                            <p><strong>Dosage:</strong> {selectedEvent.dosage}</p>
                            <p><strong>Admin Method:</strong> {selectedEvent.adminMethod}</p>
                            <p><strong>Notes:</strong> {selectedEvent.notes}</p>
                            <p><strong>Time:</strong> {selectedEvent.time}</p>
                            {selectedEvent.image && (
                                <img src={selectedEvent.image} alt="Event" className="img-fluid mt-3 rounded border" />
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setSelectedEvent(null)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MedicalEvent;
