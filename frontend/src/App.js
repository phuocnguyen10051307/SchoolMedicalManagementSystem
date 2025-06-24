import "./App.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData, loginAccount } from "./service/service";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import HomePage from "./components/HomePage/Home/HomePage";
import SchoolNurse from "./components/SchoolNurse/SchoolNurse";

function App() {
  const [username, setUsername]   = useState("");
  const [password, setPassword]   = useState("");
  const [errorMess, setErrorMess] = useState("");
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMess("");
    try {
      const results = await loginAccount(username, password);
      const account = results.account;
      setUser(account);
      switch (account.role) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "MANAGER":
          navigate("/manager");
          break;
        default:
          setErrorMess("Không xác định vai trò người dùng.");
      }
    } catch (error) {
      setErrorMess(error.message || "Đăng nhập thất bại.");
    }
  };
  return (
    <>
    <HomePage></HomePage>
    {/* <SchoolNurse></SchoolNurse> */}
    </>
  );
}

export default App;
