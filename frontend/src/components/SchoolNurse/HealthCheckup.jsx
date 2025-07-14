import React, { useEffect, useState, useContext } from "react";
import {
  getCheckupTypes,
  getNurseClassListService,
  createClassHealthCheckupService,
} from "../../service/service";
import { useOutletContext } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./HealthCheckup.scss";

const HealthCheckup = () => {
  const { user } = useContext(AuthContext);
  const { nurseData } = useOutletContext();
  const [checkupTypes, setCheckupTypes] = useState([]);
  const [classList, setClassList] = useState([]);
  const [selectedCheckupType, setSelectedCheckupType] = useState("");
  const [checkupDate, setCheckupDate] = useState("");
  const [notes, setNotes] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Lấy ngày hiện tại theo định dạng yyyy-mm-dd
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchTypesAndClasses = async () => {
      try {
        const [types, classes] = await Promise.all([
          getCheckupTypes(),
          getNurseClassListService(user.account_id),
        ]);
        setCheckupTypes(types);
        setClassList(classes);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchTypesAndClasses();
  }, [user.account_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!checkupDate || !selectedCheckupType) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    // Không cho chọn ngày quá khứ (phòng khi bypass HTML)
    if (new Date(checkupDate) < new Date(today)) {
      alert("Ngày kiểm tra không được là ngày trong quá khứ");
      return;
    }

    try {
      await createClassHealthCheckupService({
        nurse_account_id: user.account_id,
        checkup_date: checkupDate,
        checkup_type: selectedCheckupType,
        notes,
      });
      setSuccessMessage("Tạo sự kiện kiểm tra sức khỏe thành công!");
    } catch (err) {
      console.error(err);
      alert("Tạo sự kiện thất bại");
    }
  };

  const selectedType = checkupTypes.find(
    (type) => type.checkup_type === selectedCheckupType
  );

  return (
    <div className="health-checkup-container">
      <div className="form-wrapper">
        <h2>Health Checkup Form</h2>
        <form onSubmit={handleSubmit}>
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

          {selectedType?.description && (
            <div className="checkup-description">
              {selectedType.description}
            </div>
          )}

          <div className="form-group">
            <label>Ghi chú:</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ghi chú thêm (nếu có)"
            />
          </div>

          <div className="form-actions">
            <button type="submit">Tạo sự kiện kiểm tra</button>
          </div>

          {successMessage && (
            <p style={{ color: "green", marginTop: "1rem" }}>
              {successMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default HealthCheckup;
