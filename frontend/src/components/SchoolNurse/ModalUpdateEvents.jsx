import React from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";

const ModalUpdateEvents = ({
  selectedEvent,
  setSelectedEvent,
  handleUpdateEvent,
  isEditing,
  setIsEditing,
}) => {
  if (!selectedEvent) return null;

  const renderInfoRow = (label, value) => (
    <Row className="mb-2">
      <Col xs={4} className="fw-bold text-end">
        {label}:
      </Col>
      <Col xs={8}>{value || <span className="text-muted">N/A</span>}</Col>
    </Row>
  );

  const handleInputChange = (field, value) => {
    setSelectedEvent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "images");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dg1v9rju0/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      const uploadedUrl = data.secure_url;
      setSelectedEvent((prev) => ({
        ...prev,
        image: uploadedUrl,
      }));
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Upload ảnh thất bại!");
    }
  };

  return (
    <Modal
      show={!!selectedEvent}
      onHide={() => {
        setSelectedEvent(null);
        setIsEditing(false);
      }}
      centered
      size="lg"
    >
      <form onSubmit={handleUpdateEvent}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Update Medical Event" : "View Medical Event"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!isEditing ? (
            <>
              {renderInfoRow("Student Name", selectedEvent.studentName)}
              {renderInfoRow("Class", selectedEvent.studentClass)}
              {renderInfoRow("Event Type", selectedEvent.eventType)}
              {renderInfoRow("Title", selectedEvent.eventTitle)}
              {renderInfoRow("Description", selectedEvent.eventDesc)}
              {renderInfoRow("Reported By", selectedEvent.reportBy)}
              {renderInfoRow("Severity", selectedEvent.severity)}
              {renderInfoRow("Location", selectedEvent.location)}
              {renderInfoRow("Medication", selectedEvent.medicationName)}
              {renderInfoRow("Dosage", selectedEvent.dosage)}
              {renderInfoRow("Admin Method", selectedEvent.adminMethod)}
              {renderInfoRow("Notes", selectedEvent.notes)}
              {renderInfoRow("Time", selectedEvent.time)}
              {selectedEvent.image && (
                <div className="text-center mt-4">
                  <img
                    src={selectedEvent.image}
                    alt="Event"
                    style={{
                      maxWidth: "100%",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              {/* Editable Fields */}
              <div className="form-group mb-2">
                <label>Event Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedEvent.eventTitle || ""}
                  onChange={(e) =>
                    handleInputChange("eventTitle", e.target.value)
                  }
                />
              </div>

              <div className="form-group mb-2">
                <label>Description</label>
                <textarea
                  className="form-control"
                  value={selectedEvent.eventDesc || ""}
                  onChange={(e) =>
                    handleInputChange("eventDesc", e.target.value)
                  }
                />
              </div>

              <div className="form-group mb-2">
                <label>Reported By</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedEvent.reportBy || ""}
                  onChange={(e) =>
                    handleInputChange("reportBy", e.target.value)
                  }
                />
              </div>

              <div className="form-group mb-2">
                <label>Severity</label>
                <select
                  className="form-control"
                  value={selectedEvent.severity || ""}
                  onChange={(e) =>
                    handleInputChange("severity", e.target.value)
                  }
                >
                  <option value="">Select Severity</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="form-group mb-2">
                <label>Location</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedEvent.location || ""}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                />
              </div>

              <div className="form-group mb-2">
                <label>Medication</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedEvent.medicationName || ""}
                  onChange={(e) =>
                    handleInputChange("medicationName", e.target.value)
                  }
                />
              </div>

              <div className="form-group mb-2">
                <label>Dosage</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedEvent.dosage || ""}
                  onChange={(e) =>
                    handleInputChange("dosage", e.target.value)
                  }
                />
              </div>

              <div className="form-group mb-2">
                <label>Admin Method</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedEvent.adminMethod || ""}
                  onChange={(e) =>
                    handleInputChange("adminMethod", e.target.value)
                  }
                />
              </div>

              <div className="form-group mb-2">
                <label>Notes</label>
                <textarea
                  className="form-control"
                  value={selectedEvent.notes || ""}
                  onChange={(e) =>
                    handleInputChange("notes", e.target.value)
                  }
                />
              </div>

              {/* Upload Image */}
              <div className="form-group mb-3">
                <label>Update Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleImageUpload}
                />
                {selectedEvent.image && (
                  <div className="text-center mt-3">
                    <img
                      src={selectedEvent.image}
                      alt="Updated"
                      style={{
                        maxWidth: "100%",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        marginTop: "10px",
                      }}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setSelectedEvent(null);
              setIsEditing(false);
            }}
          >
            Close
          </Button>
          {!isEditing ? (
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          ) : (
            <Button variant="success" type="submit">
              Save Changes
            </Button>
          )}
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default ModalUpdateEvents;
