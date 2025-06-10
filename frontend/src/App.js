import "./App.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "./service/service";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import HomePage from "./components/HomePage/Home/HomePage";

function App() {
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
    <HomePage></HomePage>
    </>
  );
}

export default App;
