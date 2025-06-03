import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../../service/service";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./login.scss";


// function App() {
//   const [adminData, setAdminData] = useState(null);
//   const [parentData, setParentData] = useState(null);
//   const [studentData, setStudentData] = useState(null);
//   const { setUser } = useContext(AuthContext);
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");
//   const navigate = useNavigate();

const Login = () => {
  const [adminData, setAdminData] = useState(null);
  const [parentData, setParentData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const { setUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    fetchData()
      .then((data) => {
        setAdminData(data.Admins);
        setParentData(data.Parents);
        setStudentData(data.Students);
      })
      .catch((error) => {
        console.log(error);
        setErrorMsg("Lỗi khi tải dữ liệu.");
      });
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!adminData) {
      setErrorMsg("Dữ liệu admin chưa load xong, vui lòng đợi.");
      return;
    }
    const checkAdmin = adminData.find((admin) => {
      return admin.Username === username && admin.PasswordHash === password;
    });
    const checkParent = parentData.find((parent) => {
      return parent.Username === username && parent.PasswordHash === password;
    });
    const checkStudent = studentData.find((stu) => {
      return stu.Username === username && stu.PasswordHash === password;
    });

    if (checkAdmin) {
      setUser(checkAdmin);
      navigate("/admin");
      return;
    }
    if (checkParent) {
      setUser(checkParent);
      navigate("/parent");
      return;
    }
    if (checkStudent) {
      setUser(checkStudent);
      navigate("/student");
      return;
    } else {
      console.log(checkAdmin);
      setErrorMsg("Tên đăng nhập hoặc mật khẩu không đúng");
    }
  };

  return (
    <>
    <div className="background">
      <div className="card">
        <div
          className="login-container"
        // style={{ maxWidth: 400, margin: "auto", padding: 20 }}
        >
          <h2 className="title">Login Admin</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 12 }}>
              <label>Username:</label>
              <br />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Password:</label>
              <br />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Login</button>
          </form>
          {errorMsg && <p style={{ color: "red", marginTop: 10 }}>{errorMsg}</p>}
        </div>
      </div>
      </div>
    </>

  );
}

export default Login;