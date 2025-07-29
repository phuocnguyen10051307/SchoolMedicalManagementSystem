import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { NavLink } from "react-router-dom";
import avatarImg from "../../images/user.png";
import "./AdminDashBoard.scss";

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar__header">
        <img className="admin-sidebar__avatar" src={avatarImg} alt="Avatar" />
        <h3 className="admin-sidebar__name">{user.full_name}</h3>
      </div>

      <ul className="admin-sidebar__menu">
        <li>
          <NavLink
            to="/admin/profile"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Admin Profile
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/nurse"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Manager School Nurse
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/parent"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Manager Parent
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/student"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Manager Student
          </NavLink>
        </li>
      </ul>
      <div className="btn-logout">
        <button className="logout-tab" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
