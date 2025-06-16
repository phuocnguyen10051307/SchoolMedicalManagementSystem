import React from 'react';
import './MedicalEvent.css';

const MedicalEvent = () => {
    return (
        <div className="medical-event-container">
            <form className="medical-event-form">
                <h2 className="medical-event-title">Health Event</h2>

                <div className="medical-form-content">
                    <div className="form-left">
                        <div className="form-group floating-label">
                            <label htmlFor="studentName">Student Name:</label>
                            <select id="studentName">
                                <option>Select Name of Student in class</option>
                            </select>
                        </div>

                        <div className="form-group floating-label">
                            <label htmlFor="eventType">Event Type:</label>
                            <select id="eventType">
                                <option>Select Event Type</option>
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
                    </div>

                    {/* ĐƯỜNG NGĂN CÁCH */}
                    <div className="separator"></div>

                    <div className="form-right">
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
                            <button type="button" className="upload-button">
                                <img
                                    src="https://img.icons8.com/?size=100&id=102544&format=png&color=000000"
                                    alt="Upload Icon"
                                    className="plus-icon"
                                />
                                Upload file image event
                            </button>

                        </div>

                        <div className="image-preview">
                            <div className="image-box">Review Image</div>
                        </div>

                        <button type="submit" className="submit-button">SUBMIT</button>
                    </div>
                </div>
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
