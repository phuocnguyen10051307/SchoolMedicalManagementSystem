import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../../service/service";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./login.scss";
import { loginAccount, getInforAccount } from "../../service/service";
const Login = () => {
  const [adminData, setAdminData] = useState(null);
  const [parentData, setParentData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [schoolnurseData, setSchoolnurseData] = useState(null);
  const [managerData, setManagerData] = useState(null);
  const { setUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const rows = await loginAccount(username, password);
      const account = rows.account;
      setUser(account);

      switch (account.role_id) {
        case "ADMIN":
        case "MANAGER":
        case "PARENT":
        case "NURSE":
        case "STUDENT":
          navigate("/");
          break;
        default:
          toast.error("Không xác định được vai trò người dùng.");
      }
    } catch (err) {
      const msg = err?.message || "Lỗi không xác định";
      setErrorMsg(msg);
      toast.error(msg);
    }
  };

  return (
    <>
      <div className="login-page">
        <div className="diamond-shape left"></div>
        <div className="login-container">
          <h2 className="title">Login </h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                placeholder="Enter your username or email"
              />
            </div>
            <div>
              <label>Password:</label>
              {/* <br /> */}
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            <button type="submit">Sign In</button>
          </form>
          {toast.error && (
            <p style={{ color: "red", marginTop: 10 }}>{toast.error}</p>
          )}
        </div>{" "}
        <div className="diamond-shape left"></div>
      </div>
    </>
  );
};

export default Login;
