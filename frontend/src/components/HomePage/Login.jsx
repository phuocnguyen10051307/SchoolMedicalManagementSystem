import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../../service/service";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./login.css";
import { loginAccount } from "../../service/service";

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

  const handleSubmit = async(e) => {
    e.preventDefault();
    setErrorMsg("");
    const rows = await loginAccount(username,password)
    const account = rows.account;
    setUser(account)
    switch(account.role){
      case "ADMIN":
        navigate("/admin")
        break;
      case "MANAGER":
        navigate("/manager")
        break;
      case "PARENT":
        navigate("/parent")
        break;
      default:
        setErrorMsg("Failed username or password")
    }
  };


  return (

      <div className="login-page">

        <div className="login-container">

          <h2 className="title">Login Admin</h2>
          <form onSubmit={handleSubmit}>
            <div 
            
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
          {toast.error && <p style={{ color: "red", marginTop: 10 }}>{toast.error}</p>}
        </div>

      </div>


  );
}

export default Login;