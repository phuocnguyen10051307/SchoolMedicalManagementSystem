import { useEffect, useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { fetchAllClasses, fetchStudentsByClass } from "../../service/service";
import "./ManagerStudent.scss";
import ModalAddStudent from "./ModalAddStudent";

const ManagerStudent = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetchAllClasses();
        setClasses(res); // Giả sử là mảng string: ["2A3", "2B3"]
      } catch (error) {
        console.error("Lỗi tải lớp học:", error.message);
      }
    };
    fetchClasses();
  }, []);
  const reloadStudents = async () => {
    if (!selectedClass) return;
    setLoading(true);
    try {
      const data = await fetchStudentsByClass(selectedClass.class_id);
      setStudents(data);
    } catch (error) {
      console.error("Lỗi tải học sinh:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = async (cls) => {
    setSelectedClass(cls);
    await reloadStudents();
    setShowModal(true);
  };

  return (
    <div className="manager-student-page">
      <h2>Quản lý Học sinh</h2>
      <p>Chọn một lớp để xem danh sách học sinh.</p>

      <div className="class-grid">
        {classes.map((className) => (
          <div className="class-card" key={className}>
            <div className="class-name">{className}</div>
            <button
              className="view-btn"
              onClick={() =>
                handleOpenModal({ class_id: className, class_name: className })
              }
            >
              View
            </button>
          </div>
        ))}
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Học sinh - {selectedClass?.class_name}
            <Button
              variant="outline-success"
              size="sm"
              className="ms-3"
              onClick={() => setShowAddModal(true)}
            >
              + Thêm
            </Button>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : students.length === 0 ? (
            <p>Không có học sinh trong lớp này.</p>
          ) : (
            <ul>
              {students.map((s) => (
                <li key={s.student_id}>
                  {s.full_name} - {s.student_code}
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
      <ModalAddStudent
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        className={selectedClass?.class_name}
        onSuccess={reloadStudents}
      />
    </div>
  );
};

export default ManagerStudent;
