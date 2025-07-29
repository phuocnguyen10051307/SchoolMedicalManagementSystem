import { Outlet } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import "./AdminLayout.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Admin = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <div className="admin-layout">
      <AdminDashboard />
      <div className="admin-layout__content">
        <Outlet />
      </div>
      
    </div>
  );
};

export default Admin;
