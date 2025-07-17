import { Outlet } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import "./AdminLayout.scss";

const Admin = () => {
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
