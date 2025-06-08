import { useContext,useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

const Admin = () => {
  const {user} = useContext(AuthContext)
  // const {notify} = toast.success('chao mừng ${user.Username} đến với trang quản trị');

    useEffect(() => {
    if (user) {
      toast.success(`Chào mừng ${user.Username} đến với trang quản trị`);
    }
  }, [user]);



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
