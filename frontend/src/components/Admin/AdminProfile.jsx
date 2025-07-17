import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./AdminProfile.scss";

const AdminProfile = () => {
  const { user } = useContext(AuthContext);
  console.log(user)

  return (
    <div className="admin-profile">
      <h2 className="admin-profile__title">Admin Profile</h2>

      <img
        className="admin-profile__avatar"
        src={user.avatar_url || "https://via.placeholder.com/150"}
        alt="Avatar"
      />

      <div className="admin-profile__info">
        <p><strong>Họ tên:</strong> {user.full_name}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Số điện thoại:</strong> {user.phone_number}</p>
        <p><strong>Ngày sinh:</strong> {new Date(user.date_of_birth).toLocaleDateString()}</p>
        <p><strong>Địa chỉ:</strong> {user.address}</p>
        <p><strong>Vai trò:</strong> {user.role_id}</p>
        <p><strong>Trạng thái:</strong> {user.account_status}</p>
        <p><strong>Ngày tạo tài khoản:</strong> {new Date(user.created_at).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default AdminProfile;
