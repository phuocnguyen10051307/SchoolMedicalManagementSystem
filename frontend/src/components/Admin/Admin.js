import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Admin = () => {
  const {user} = useContext(AuthContext)
  return (
    <div style={{ padding: "20px" }}>
      <h2>Chào mừng Admin</h2>
      {user ? (
        <div>
          <p>
            <strong>Username:</strong> {user.Username}
          </p>
          <p>
            <strong>Email:</strong> {user.Email}
          </p>
        </div>
      ) : (
        <p>Không tìm thấy thông tin người dùng.</p>
      )}
    </div>
  );
};
export default Admin;
