import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./AdminProfile.scss";
import im from "../../images/user.png";
import {
  updateProfile,
  getDashboardSummary,
  getAccountProfile,
} from "../../service/service";
import { toast } from "react-toastify";
import ModalUpdateProfile from "./ModalUpdateProfile";
import ModalDashboardChart from "./ModalDashboardChart";

const AdminProfile = () => {
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showDashboardModal, setShowDashboardModal] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    if (user?.account_id) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const result = await getAccountProfile(user.account_id);
      setProfile(result);
    } catch (error) {
      toast.error("Lỗi lấy thông tin hồ sơ");
    }
  };

  const handleUpdateSubmit = async (updatedData) => {
    console.log(updatedData);
    try {
      await updateProfile(user.account_id, updatedData);
      toast.success("update profile success!");
      fetchProfile();
      setShowModal(false);
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handleViewDashboard = async () => {
    try {
      const result = await getDashboardSummary(user.account_id);
      console.log(result)
      setDashboardData(result);
      setShowDashboardModal(true);
    } catch (error) {
      toast.error(error.message || "Lỗi lấy dashboard");
    }
  };

  if (!profile) return <p>Đang tải hồ sơ...</p>;

  return (
    <div className="admin-profile">
      <div className="admin-profile__header">
        <h2 className="admin-profile__title">Admin Profile</h2>
        <div className="admin-profile__buttons">
          <button className="btn-update" onClick={() => setShowModal(true)}>
            Cập nhật hồ sơ
          </button>
          <button className="btn-dashboard" onClick={handleViewDashboard}>
            Xem Dashboard
          </button>
        </div>
      </div>

      <img
        className="admin-profile__avatar"
        src={profile.avatar_url || im}
        alt="Avatar"
      />

      <div className="admin-profile__info">
        <p>
          <strong>Họ tên:</strong> {profile.full_name}
        </p>
        <p>
          <strong>Username:</strong> {profile.username}
        </p>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Số điện thoại:</strong> {profile.phone_number}
        </p>
        <p>
          <strong>Ngày sinh:</strong>{" "}
          {new Date(profile.date_of_birth).toLocaleDateString()}
        </p>
        <p>
          <strong>Địa chỉ:</strong> {profile.address}
        </p>
        <p>
          <strong>Vai trò:</strong> {profile.role_id}
        </p>
        <p>
          <strong>Trạng thái:</strong> {profile.account_status}
        </p>
        <p>
          <strong>Ngày tạo tài khoản:</strong>{" "}
          {new Date(profile.created_at).toLocaleString()}
        </p>
      </div>

      <ModalUpdateProfile
        show={showModal}
        onHide={() => setShowModal(false)}
        user={profile}
        onSubmit={handleUpdateSubmit}
      />
      <ModalDashboardChart
        show={showDashboardModal}
        onHide={() => setShowDashboardModal(false)}
        data={dashboardData}
      />
    </div>
  );
};

export default AdminProfile;
