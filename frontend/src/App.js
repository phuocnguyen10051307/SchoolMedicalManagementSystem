import "./App.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData, loginAccount } from "./service/service";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

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
      {/* <div
        className="login-container"
        style={{ maxWidth: 400, margin: "auto", padding: 20 }}
      >
        <h2>Login Admin</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>User Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            ></input>
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            ></input>
          </div>
          {errorMess && <p style={{ color: "red" }}>{errorMess}</p>}
          <button type="submit"> Sign in</button>
        </form>
        {errorMsg && <p style={{ color: "red", marginTop: 10 }}>{errorMsg}</p>}
      </div> */}
    </>
  );
}

export default App;
