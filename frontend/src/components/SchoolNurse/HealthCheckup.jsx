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
  console.log(periodicCheckups)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!checkupDate || !selectedCheckupType) {
      toast.warning("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (new Date(checkupDate) < new Date(today)) {
      toast.error("Ngày kiểm tra không được là ngày trong quá khứ");
      return;
    }

    try {
      await createClassHealthCheckupService({
        nurse_account_id: user.account_id,
        checkup_date: checkupDate,
        checkup_type: selectedCheckupType,
        notes,
      });

      toast.success("Tạo sự kiện kiểm tra sức khỏe thành công!");

      setCheckupDate("");
      setSelectedCheckupType("");
      setNotes("");

      const refreshed = await fetchNurseCheckupsWithNotifications(
        user.account_id
      );
      setPeriodicCheckups(refreshed.periodicCheckups || []);
    } catch (err) {
      console.error(err);
      toast.error("Tạo sự kiện thất bại");
    }
  };

  const handleViewClick = async (checkupId) => {
    try {
      const data = await fetchClassStatusByCheckupId(checkupId);
      setSelectedCheckup({ checkupId, data });
      setShowModal(true);
    } catch (err) {
      toast.error("Không thể tải dữ liệu lớp.");
    }
  };

  return (
    <div className="health-checkup-container">
      <div className="left-panel">
        <form onSubmit={handleSubmit}>
          <h2>Tạo kiểm tra sức khỏe</h2>

          <div className="form-group">
            <label>Ngày kiểm tra:</label>
            <input
              type="date"
              value={checkupDate}
              onChange={(e) => setCheckupDate(e.target.value)}
              min={today}
              required
            />
          </div>

          <div className="form-group">
            <label>Loại kiểm tra:</label>
            <select
              value={selectedCheckupType}
              onChange={(e) => setSelectedCheckupType(e.target.value)}
              required
            >
              <option value="">-- Chọn loại kiểm tra --</option>
              {checkupTypes.map((type) => (
                <option key={type.checkup_type} value={type.checkup_type}>
                  {type.display_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Ghi chú:</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ghi chú thêm (nếu có)"
            />
          </div>

          <button type="submit">Tạo sự kiện</button>
        </form>
      </div>

      <div className="right-panel">
        <h3>Kiểm tra đã tạo</h3>
        <table>
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Loại kiểm tra</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="3" style={{ padding: 0, border: "none" }}>
                <div className="tbody-scroll-container">
                  <table className="inner-table" style={{width:"300px"}}>
                    <tbody>
                      {periodicCheckups.length === 0 ? (
                        <tr>
                          <td colSpan="3">Chưa có kiểm tra nào</td>
                        </tr>
                      ) : (
                        periodicCheckups.map((item, idx) => (
                          <tr key={idx}>
                            <td>
                              {new Date(item.checkup_date).toLocaleDateString(
                                "vi-VN"
                              )}
                            </td>
                            <td>{item.checkup_type_name}</td>
                            <td>
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => handleViewClick(item.checkup_id)}
                              >
                                Xem
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
