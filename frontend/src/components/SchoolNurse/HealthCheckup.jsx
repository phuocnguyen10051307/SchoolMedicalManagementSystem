import React, { useEffect, useState, useContext } from "react";
import {
  getCheckupTypes,
  createClassHealthCheckupService,
  fetchNurseCheckupsWithNotifications,
  fetchClassStatusByCheckupId,
} from "../../service/service";
import { useOutletContext } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Button, Modal } from "react-bootstrap";
import CheckupViewModal from "./CheckupViewModal";
import "./HealthCheckup.scss";

const HealthCheckup = () => {
  const { user } = useContext(AuthContext);
  const { nurseData } = useOutletContext();

  const [checkupTypes, setCheckupTypes] = useState([]);
  const [checkupDate, setCheckupDate] = useState("");
  const [selectedCheckupType, setSelectedCheckupType] = useState("");
  const [notes, setNotes] = useState("");
  const [periodicCheckups, setPeriodicCheckups] = useState([]);
  const [selectedCheckup, setSelectedCheckup] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [types, checkups] = await Promise.all([
          getCheckupTypes(),
          fetchNurseCheckupsWithNotifications(user.account_id),
        ]);
        setCheckupTypes(types);
        setPeriodicCheckups(checkups.periodicCheckups || []);
      } catch (err) {
        console.error("Error loading:", err);
      }
    };

    fetchData();
  }, [user.account_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!checkupDate || !selectedCheckupType) {
      toast.warning("Please fill in all required information.");
      return;
    }

    if (new Date(checkupDate) < new Date(today)) {
      toast.error("Checkup date cannot be in the past.");
      return;
    }

    try {
      await createClassHealthCheckupService({
        nurse_account_id: user.account_id,
        checkup_date: checkupDate,
        checkup_type: selectedCheckupType,
        notes,
      });

      toast.success("Health checkup event created successfully!");

      setCheckupDate("");
      setSelectedCheckupType("");
      setNotes("");

      const refreshed = await fetchNurseCheckupsWithNotifications(user.account_id);
      setPeriodicCheckups(refreshed.periodicCheckups || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create health checkup event.");
    }
  };

  const handleViewClick = async (checkupId) => {
    try {
      const data = await fetchClassStatusByCheckupId(checkupId);
      setSelectedCheckup({ checkupId, data });
      setShowModal(true);
    } catch (err) {
      toast.error("Unable to load class data.");
    }
  };

  return (
    <div className="health-checkup-container">
      <div className="left-panel">
        <form onSubmit={handleSubmit}>
          <h2>Create Health Checkup</h2>

          <div className="form-group">
            <label>Checkup Date:</label>
            <input
              type="date"
              value={checkupDate}
              onChange={(e) => setCheckupDate(e.target.value)}
              min={today}
              required
            />
          </div>

          <div className="form-group">
            <label>Checkup Type:</label>
            <select
              value={selectedCheckupType}
              onChange={(e) => setSelectedCheckupType(e.target.value)}
              required
            >
              <option value="">-- Select checkup type --</option>
              {checkupTypes.map((type) => (
                <option key={type.checkup_type} value={type.checkup_type}>
                  {type.display_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Notes:</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes (if any)"
            />
          </div>

          <button type="submit">Create Event</button>
        </form>
      </div>

      <div className="right-panel">
        <h3>Created Checkups</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Checkup Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="3" style={{ padding: 0, border: "none" }}>
                <div className="tbody-scroll-container">
                  <table className="inner-table" style={{ width: "300px" }}>
                    <tbody>
                      {periodicCheckups.length === 0 ? (
                        <tr>
                          <td colSpan="3">No checkups available</td>
                        </tr>
                      ) : (
                        periodicCheckups.map((item, idx) => (
                          <tr key={idx}>
                            <td>
                              {new Date(item.checkup_date).toLocaleDateString("en-GB")}
                            </td>
                            <td>{item.checkup_type_name}</td>
                            <td>
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => handleViewClick(item.checkup_id)}
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <CheckupViewModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        checkupData={selectedCheckup}
      />
    </div>
  );
};

export default HealthCheckup;
