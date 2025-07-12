import React, { useRef, useState, useEffect, useContext } from "react";
import "./MedicalEvent.scss";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Modal, Button } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import ModalUpdateEvents from "./ModalUpdateEvents";

import {
  getStudentListByClassService,
  createMedicalEventService,
  getMedicalEventsByNurseService,
  updateMedicalEventService,
} from "../../service/service";

const MedicalEvent = () => {
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventType, setEventType] = useState("");
  const [customEventType, setCustomEventType] = useState("");
  const { refetchNurse, nurseData } = useOutletContext();
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user?.account_id) {
      fetchEvents(user.account_id);
    }
  }, [user]);

  const fetchEvents = async (nurse_id) => {
    try {
      const result = await getMedicalEventsByNurseService(nurse_id);
      setEvents(result);
    } catch (err) {
      console.error("Lỗi khi lấy sự kiện:", err.message);
    }
  };

  const [studentList, setStudentList] = useState([]);

  const handleClassChange = async (selectedClass) => {
    try {
      const result = await getStudentListByClassService(selectedClass);
      setStudentList(result);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách học sinh:", error.message);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    const localURL = URL.createObjectURL(file);
    setPreviewImage(localURL); // preview tạm

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "images");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dg1v9rju0/image/upload",
        formData
      );
      const uploadedUrl = res.data.secure_url;
      setPreviewImage(uploadedUrl);
    } catch (err) {
      console.error("Upload ảnh thất bại:", err);
      alert("Upload ảnh thất bại!");
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    fileInputRef.current.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const finalEventType =
        eventType === "Other" ? customEventType : eventType;

      const selectedStudent = studentList.find(
        (stu) => stu.full_name === document.getElementById("studentName").value
      );

      const eventData = {
        nurse_account_id: user.account_id,
        student_id: selectedStudent?.student_id,
        event_type: finalEventType,
        event_title: document.getElementById("eventTitle").value,
        event_description: document.getElementById("eventDesc").value,
        event_datetime: new Date().toISOString(),
        reported_by: document.getElementById("reportBy").value,
        severity_level: document.getElementById("severity").value,
        location: document.getElementById("location").value,
        follow_up_action: document.getElementById("notes").value,
        medication_description: document.getElementById("medicationName").value,
        file_url: previewImage, // nếu đã upload lên Firebase thì dùng URL thật
        file_type: "image",
      };

      const result = await createMedicalEventService(eventData);
      e.target.reset();
      setPreviewImage(null);
      setEventType("");
      setCustomEventType("");
      await fetchEvents(user.account_id);
      toast.success(" create evevent helthy success");
    } catch (err) {
      toast.error(err.message || "Đã xảy ra lỗi khi tạo sự kiện");
    }
  };
  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      const updatedEvent = {
        event_title: selectedEvent.eventTitle,
        event_description: selectedEvent.eventDesc,
        reported_by: selectedEvent.reportBy,
        severity_level: selectedEvent.severity,
        location: selectedEvent.location,
        follow_up_action: selectedEvent.notes,
        medication_description: selectedEvent.medicationName,
        dosage: selectedEvent.dosage,
        administration_method: selectedEvent.adminMethod,
        file_url: selectedEvent.image,
        file_type: "image", // bổ sung
        nurse_account_id: user.account_id, // từ AuthContext
        student_id: selectedEvent.student_id, // bạn cần gán khi mở View
        event_type: selectedEvent.eventType,
        event_datetime: new Date().toISOString(), // hoặc giữ nguyên thời gian cũ nếu có
      };

      await updateMedicalEventService(selectedEvent.event_id, updatedEvent);
      toast.success("Cập nhật sự kiện thành công");
      await fetchEvents(user.account_id);
      setSelectedEvent(null);
      setIsEditing(false);
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <div className="medical-event-container">
      <form className="medical-event-form" onSubmit={handleSubmit}>
        <Scrollbars style={{ height: "100%", width: "100%" }}>
          <div className="medical-form-content">
            <h2 className="medical-event-title">Health Event</h2>
            <div className="form-left">
              <div className="form-group floating-label">
                <label htmlFor="studentClass">Student Class:</label>
                <select
                  id="studentClass"
                  required
                  onChange={(e) => handleClassChange(e.target.value)}
                >
                  <option value="">Select class</option>
                  {nurseData?.class_names?.map((className, index) => (
                    <option key={index} value={className}>
                      {className}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group floating-label">
                <label htmlFor="studentName">Student Name:</label>
                <select id="studentName" required>
                  <option value="">Select Name of Student in class</option>
                  {studentList.map((student) => (
                    <option key={student.student_id} value={student.full_name}>
                      {student.full_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group floating-label">
                <label htmlFor="eventType">Event Type:</label>
                <select
                  id="eventType"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
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

              {eventType === "Other" && (
                <div className="form-group floating-label">
                  <input
                    type="text"
                    id="customEventType"
                    placeholder="Enter custom event type"
                    value={customEventType}
                    onChange={(e) => setCustomEventType(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="form-group floating-label">
                <label htmlFor="eventTitle">Event Title:</label>
                <input
                  type="text"
                  id="eventTitle"
                  placeholder="Enter event title"
                  required
                />
              </div>
              <div className="form-group floating-label">
                <label htmlFor="eventDesc">Event Description:</label>
                <textarea
                  id="eventDesc"
                  placeholder="Detailed description..."
                  required
                />
              </div>
              <div className="form-group floating-label">
                <label htmlFor="reportBy">Report by:</label>
                <input
                  type="text"
                  id="reportBy"
                  placeholder="Enter Name or roles"
                  required
                />
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
                <input
                  type="text"
                  id="location"
                  placeholder="Enter the event location"
                  required
                />
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
                <input
                  type="text"
                  id="dosage"
                  placeholder="Enter Dosage"
                  required
                />
              </div>
              <div className="form-group floating-label">
                <label htmlFor="adminMethod">Administration method:</label>
                <input
                  type="text"
                  id="adminMethod"
                  placeholder="Enter administration method"
                  required
                />
              </div>
              <div className="form-group floating-label">
                <label htmlFor="notes">Notes:</label>
                <textarea id="notes" placeholder="Additional notes..." />
              </div>

              <div className="form-group">
                <button
                  type="button"
                  className="upload-button"
                  onClick={handleUploadClick}
                >
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
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>

              <div className="image-preview">
                <div className="image-box">
                  {previewImage ? (
                    <div className="image-container">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="preview-img"
                      />
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

              <button type="submit" className="submit-button">
                SUBMIT
              </button>
            </div>
          </div>
        </Scrollbars>
      </form>

      <div className="recent-events">
        <h3>Recent Events</h3>
        <div className="recent-events-scroll">
          <Scrollbars style={{ height: "100%", width: "100%" }}>
            {events.length > 0 ? (
              events.map((ev, index) => (
                <div className="event-card" key={index}>
                  <p>
                    {ev.student_name} - {ev.class_name}
                  </p>
                  <p>
                    {ev.severity_level} {ev.event_type}
                  </p>
                  <p>{new Date(ev.event_datetime).toLocaleString()}</p>
                  <p>Medication given: {ev.medication_name || "None"}</p>
                  <button
                    className="view-button"
                    onClick={() =>
                      setSelectedEvent({
                        event_id: ev.event_id,
                        student_id: ev.student_id,
                        event_datetime: ev.event_datetime,
                        studentName: ev.student_name,
                        studentClass: ev.class_name,
                        eventType: ev.event_type,
                        eventTitle: ev.event_title,
                        eventDesc: ev.event_description,
                        reportBy: ev.reported_by,
                        severity: ev.severity_level,
                        location: ev.location,
                        medicationName: ev.medication_name,
                        dosage: ev.dosage,
                        adminMethod: ev.administration_method,
                        notes: ev.follow_up_action,
                        time: new Date(ev.event_datetime).toLocaleString(),
                        image: ev.file_url,
                      })
                    }
                  >
                    View
                  </button>
                </div>
              ))
            ) : (
              <p>No events found.</p>
            )}
          </Scrollbars>
        </div>
      </div>
      <ModalUpdateEvents
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        handleUpdateEvent={handleUpdateEvent}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
    </div>
  );
};

export default MedicalEvent;
