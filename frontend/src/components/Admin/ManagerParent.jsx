import { useEffect, useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { fetchAllClasses, fetchParentsByClass } from "../../service/service";
import "./ManagerParent.scss";

const ManagerParent = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [parents, setParents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetchAllClasses();
        setClasses(res); // Là mảng string như ["2A3", "2B3"]
      } catch (error) {
        console.error("Lỗi tải lớp học:", error.message);
      }
    };
    fetchClasses();
  }, []);

  const handleOpenModal = async (cls) => {
    setSelectedClass(cls);
    setLoading(true);
    try {
      const data = await fetchParentsByClass(cls.class_id);
      setParents(data);
    } catch (error) {
      console.error("Lỗi tải phụ huynh:", error.message);
      setParents([]);
    } finally {
      setShowModal(true);
      setLoading(false);
    }
  };

  return (
    <div className="manager-parent-page">
      <h2>Quản lý Phụ huynh</h2>
      <p>Chọn một lớp để xem danh sách phụ huynh.</p>

      <div className="class-grid">
        {classes.map((className) => (
          <div className="class-card" key={className}>
            <div className="class-name">{className}</div>
            <button
              className="view-btn"
              onClick={() => handleOpenModal({ class_id: className, class_name: className })}
            >
              View
            </button>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Phụ huynh - {selectedClass?.class_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center"><Spinner animation="border" /></div>
          ) : parents.length === 0 ? (
            <p>Không có phụ huynh trong lớp này.</p>
          ) : (
            <ul>
              {parents.map((p) => (
                <li key={p.account_id}>
                  {p.full_name} - {p.email} - {p.phone_number}
                </li>
              ))}
            </ul>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManagerParent;
