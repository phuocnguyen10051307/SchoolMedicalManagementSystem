import React, { useState, useContext, useEffect } from "react";
import {
  Card,
  ListGroup,
  Container,
  Badge,
  Button,
  Spinner,
} from "react-bootstrap";
import { toast } from "react-toastify";
import StudentHealthRecordUpdateModal from "./StudentHealthRecordUpdateModal";
import { AuthContext } from "../../context/AuthContext";
import { getHealthProfile } from "../../service/service";
import "./StudentHealthRecordDeclaration.scss"

const StudentHealthRecordDeclaration = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const res = await getHealthProfile(user.account_id);
        setData(res);
      } catch (err) {
        toast.error(err.message || "Lỗi khi tải hồ sơ sức khỏe");
      }
    };

    if (user?.account_id) {
      fetchHealthData();
    }
  }, [user?.account_id]);

  const handleUpdate = (updatedForm) => {
    setData({ ...updatedForm });
    toast.success("Cập nhật hồ sơ sức khỏe thành công!");
  };

  const getStatusBadge = (status) => {
    const baseStyle = {
      fontSize: "0.875rem",
      padding: "0.375rem 0.75rem",
      minWidth: "90px",
      textAlign: "center",
    };

    switch (status) {
      case "approved":
        return <Badge bg="success" style={baseStyle}>Approved</Badge>;
      case "rejected":
        return <Badge bg="danger" style={baseStyle}>Rejected</Badge>;
      default:
        return <Badge bg="warning" text="dark" style={baseStyle}>Pending</Badge>;
    }
  };

  if (!data) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Đang tải hồ sơ sức khỏe...</p>
      </Container>
    );
  }

  return (
    <Container className="d-flex justify-content-center ">
      <div style={{ width: "100%", maxWidth: "800px" }}>
        <h2 className="mb-4 text-center">Student Health Record</h2>
        <Card className="shadow-sm rounded-4" style={{ padding: "24px", fontSize: "1.25rem" }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <div style={{ fontWeight: "600", fontSize: "1.5rem" }}>{data.student_name}</div>
              <div className="text-muted" style={{ fontSize: "1.2rem" }}>Class: {data.class_name}</div>
            </div>
            <div className="d-flex align-items-center gap-3">
              {getStatusBadge(data.review_status)}
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setShowModal(true)}
              >
                Update
              </Button>
            </div>
          </div>

          <ListGroup variant="flush">
            <ListGroup.Item style={{ padding: "16px" }}>
              <strong>Height:</strong> {data?.height_cm?data.height_cm:"chưa nhập"} cm
            </ListGroup.Item>
            <ListGroup.Item style={{ padding: "16px" }}>
              <strong>Weight:</strong> {data?.weight_kg?data.weight_kg:" chưa nhập"} kg
            </ListGroup.Item>
            <ListGroup.Item style={{ padding: "16px" }}>
              <strong>Blood Type:</strong> {data?.blood_type?data.blood_type:"chưa nhập"}
            </ListGroup.Item>
            <ListGroup.Item style={{ padding: "16px" }}>
              <strong>Chronic Conditions:</strong> {data?.chronic_conditions?data.chronic_conditions:"Không"}
            </ListGroup.Item>
            <ListGroup.Item style={{ padding: "16px" }}>
              <strong>Allergies:</strong> {data?.allergies?data.allergies:"Không"}
            </ListGroup.Item>
            <ListGroup.Item style={{ padding: "16px" }}>
              <strong>Regular Medications:</strong> {data?.regular_medications?data.regular_medications:"Không"}
            </ListGroup.Item>
            <ListGroup.Item style={{ padding: "16px" }}>
              <strong>Additional Notes:</strong> {data.additional_notes}
            </ListGroup.Item>
          </ListGroup>
        </Card>

        <StudentHealthRecordUpdateModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          currentForm={data}
          onSave={handleUpdate}
        />
      </div>
    </Container>
  );
};

export default StudentHealthRecordDeclaration;
