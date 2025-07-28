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
        console.error("Lỗi khi lấy danh sách thuốc:", error?.message || "Không xác định");
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
        received_quantity: selectedRequest?.dosage || "Không rõ",
      });


      setMedications((prev) => prev.filter((item) => item.request_id !== requestId));
      toast.success("confirm success")
    } catch (error) {
      toast.error("Xác nhận thất bại: " + (error.message || "Lỗi không xác định"));
    } finally {
      setConfirmingId(null);
    }
  };

  return (
    <div className="record-container">
      <h3 className="mb-3">Danh sách thuốc phụ huynh gửi</h3>

      <div className="mb-3 d-flex">
        <Button
          variant={viewMode === "PENDING" ? "primary" : "outline-primary"}
          className="me-2"
          onClick={() => setViewMode("PENDING")}
        >
          Đang chờ xác nhận
        </Button>
        <Button
          variant={viewMode === "APPROVED" ? "success" : "outline-success"}
          onClick={() => setViewMode("APPROVED")}
        >
          Đã xác nhận
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
                <th>Học sinh</th>
                <th>Lớp</th>
                <th>Tên thuốc</th>
                <th>Liều lượng</th>
                <th>Hướng dẫn</th>
                <th>{viewMode === "PENDING" ? "Gửi lúc" : "Xác nhận lúc"}</th>
                <th>Xác nhận</th>
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
                            "Xác nhận"
                          )}
                        </Button>
                      ) : (
                        <span className="text-muted">✓ Đã xác nhận</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-data text-center">
                    Không có yêu cầu gửi thuốc nào.
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
              className={`page-number ${
                currentPage === index + 1 ? "active" : ""
              }`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </span>
          ))}

          <span
            className={`arrow ${currentPage === totalPages ? "disabled" : ""}`}
            onClick={() =>
              currentPage < totalPages && paginate(currentPage + 1)
            }
          >
            →
          </span>
        </div>
      )}
    </div>
  );
};

export default HealthRecord;
