import React, { useEffect, useState, useContext } from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import "./HealthRecord.scss";
import {
  getMedicationPendingParentSent,
  getApprovedMedicationFromParent,
  confirmMedicationReceiptService,
} from "../../service/service";
import { useOutletContext } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

const HealthRecord = () => {
  const { user } = useContext(AuthContext);
  const [medications, setMedications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [loading, setLoading] = useState(false);
  const [confirmingId, setConfirmingId] = useState(null);
  const [viewMode, setViewMode] = useState("PENDING"); // "PENDING" or "APPROVED"

  const { nurseData } = useOutletContext();

  useEffect(() => {
    const fetchMedications = async () => {
      setLoading(true);
      try {
        let data = [];
        if (viewMode === "PENDING") {
          data = await getMedicationPendingParentSent(user.account_id);
        } else {
          data = await getApprovedMedicationFromParent(user.account_id);
        }
        setMedications(data || []);
      } catch (error) {
        console.error("Error fetching medication list:", error?.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (user?.account_id) {
      fetchMedications();
    }
  }, [user, viewMode]);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = medications.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(medications.length / recordsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleConfirm = async (requestId) => {
    setConfirmingId(requestId);
    try {
      const selectedRequest = medications.find((item) => item.request_id === requestId);
      await confirmMedicationReceiptService({
        request_id: requestId,
        nurse_account_id: user.account_id,
        received_quantity: selectedRequest?.dosage || "Unknown",
      });

      setMedications((prev) => prev.filter((item) => item.request_id !== requestId));
      toast.success("Confirmation successful");
    } catch (error) {
      toast.error("Confirmation failed: " + (error.message || "Unknown error"));
    } finally {
      setConfirmingId(null);
    }
  };

  return (
    <div className="record-container">
      <h3 className="mb-3">List of Medications Sent by Parents</h3>

      <div className="mb-3 d-flex">
        <Button
          variant={viewMode === "PENDING" ? "primary" : "outline-primary"}
          className="me-2"
          onClick={() => setViewMode("PENDING")}
        >
          Pending Confirmation
        </Button>
        <Button
          variant={viewMode === "APPROVED" ? "success" : "outline-success"}
          onClick={() => setViewMode("APPROVED")}
        >
          Confirmed
        </Button>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="table-wrapper">
          <Table bordered hover responsive className="record-table mb-0">
            <thead>
              <tr>
                <th>No.</th>
                <th>Student</th>
                <th>Class</th>
                <th>Medication Name</th>
                <th>Dosage</th>
                <th>Instructions</th>
                <th>{viewMode === "PENDING" ? "Sent At" : "Confirmed At"}</th>
                <th>Confirm</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((med, index) => (
                  <tr key={med.request_id}>
                    <td>{indexOfFirstRecord + index + 1}</td>
                    <td>{med.student_name}</td>
                    <td>{med.class_name}</td>
                    <td>{med.medication_name}</td>
                    <td>{med.dosage}</td>
                    <td>{med.instructions}</td>
                    <td>
                      {new Date(
                        viewMode === "PENDING" ? med.created_at : med.received_at
                      ).toLocaleString()}
                    </td>
                    <td>
                      {viewMode === "PENDING" ? (
                        <Button
                          size="sm"
                          variant="success"
                          disabled={confirmingId === med.request_id}
                          onClick={() => handleConfirm(med.request_id)}
                        >
                          {confirmingId === med.request_id ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            "Confirm"
                          )}
                        </Button>
                      ) : (
                        <span className="text-muted">✓ Confirmed</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-data text-center">
                    No medication requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination-numbers">
          <span
            className={`arrow ${currentPage === 1 ? "disabled" : ""}`}
            onClick={() => currentPage > 1 && paginate(currentPage - 1)}
          >
            ←
          </span>

          {Array.from({ length: totalPages }, (_, index) => (
            <span
              key={index}
              className={`page-number ${currentPage === index + 1 ? "active" : ""}`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </span>
          ))}

          <span
            className={`arrow ${currentPage === totalPages ? "disabled" : ""}`}
            onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
          >
            →
          </span>
        </div>
      )}
    </div>
  );
};

export default HealthRecord;
