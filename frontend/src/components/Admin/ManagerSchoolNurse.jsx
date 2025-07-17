import { useEffect, useState, useContext } from "react";
import { getAllNurses } from "../../service/service";
import ModalAddNurse from "./ModalAddNurse";
import ModalVaccinationSchedule from "./ModalVaccinationSchedule";
import "./ManagerSchoolNurse.scss";
import { AuthContext } from "../../context/AuthContext";

const ManagerSchoolNurse = () => {
  const { user } = useContext(AuthContext);
  console.log(user)
  const [nurses, setNurses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalSchedule, setShowModalSchedule] = useState(false);

  const fetchNurses = async () => {
    try {
      const data = await getAllNurses();
      setNurses(data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách y tá:", err.message);
    }
  };

  useEffect(() => {
    fetchNurses();
  }, []);

  return (
    <div className="manager-nurse-page">
      <div className="header">
        <h2>Danh sách Y tá</h2>
        <button className="add-button" onClick={() => setShowModal(true)}>
          +
        </button>
        <button
          className="add-button"
          onClick={() => setShowModalSchedule(true)}
        >
          + Lịch tiêm
        </button>
      </div>

      <div className="nurse-card-list">
        {nurses.map((nurse) => (
          <div className="nurse-card" key={nurse.account_id}>
            <img
              src={nurse.avatar_url || "https://i.imgur.com/8Km9tLL.png"}
              alt="Avatar"
              className="nurse-card__avatar"
            />

            <h3 className="nurse-card__name">{nurse.full_name}</h3>
            <p>
              <strong>Email:</strong> {nurse.email}
            </p>
            <p>
              <strong>Điện thoại:</strong> {nurse.phone_number}
            </p>
          </div>
        ))}
      </div>

      <ModalAddNurse
        show={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchNurses}
      />
      <ModalVaccinationSchedule
        show={showModalSchedule}
        onClose={() => setShowModalSchedule(false)}
        accountId={user?.account_id}
        onSuccess={() => {}}
      />
    </div>
  );
};

export default ManagerSchoolNurse;
