import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../../service/service";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./login.css";


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
  const [schoolnurseData, setSchoolnurseData] = useState(null);
  const [managerData, setManagerData] = useState(null);
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
        setSchoolnurseData(data.SchoolNurses);
        setManagerData(data.Managers);
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

    if (!parentData) {
      setErrorMsg("Dữ liệu parents chưa load xong, vui lòng đợi.");
      return;
    }
    const checkParent = parentData.find((parent) => {
      return parent.Username === username && parent.PasswordHash === password;
    });

    if (!studentData) {
      setErrorMsg("Dữ liệu students chưa load xong, vui lòng đợi.");
      return;
    }
    const checkStudent = studentData.find((stu) => {
      return stu.Username === username && stu.PasswordHash === password;
    }); 

    if (!schoolnurseData) {
      setErrorMsg("Dữ liệu schoolnurse chưa load xong, vui lòng đợi.");
      return;
    }
    const checkSchoolnurse = schoolnurseData.find((schoolnurse) => {
      return schoolnurse.Username === username && schoolnurse.PasswordHash === password;
    });

    if (!managerData) {
      setErrorMsg("Dữ liệu manager chưa load xong, vui lòng đợi.");
      return;
    }
    const checkManager = managerData.find((manager) => {
      return manager.Username === username && manager.PasswordHash === password;
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
    }
    if (checkSchoolnurse) {
      setUser(checkSchoolnurse);
      navigate("/schoolnurse");
      return;
    }
    if (checkManager) {
      setUser(checkManager);
      navigate("/manager");
      return;
    } else {
      console.log(checkAdmin);
      toast.error("Tên đăng nhập hoặc mật khẩu không đúng");
    }
  };


  return (

      <div className="login-page">


        <div
          className="login-container"
        // style={{ maxWidth: 400, margin: "auto", padding: 20 }}
        >
          <h2 className="title">Login Admin</h2>
          <form onSubmit={handleSubmit}>
            <div 
            // style={{ marginBottom: 12 }}
            >
              <label>Username:</label>
              {/* <br /> */}
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                placeholder="Enter your username or email"
              />
            </div>
            <div 
            // style={{ marginBottom: 12 }}
            >
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
          {toast.error && <p style={{ color: "red", marginTop: 10 }}>{toast.error}</p>}
        </div>

      </div>


  );
}

export default Login;