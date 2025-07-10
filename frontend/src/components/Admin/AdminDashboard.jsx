import { useContext, useEffect, useState } from "react";
import './Admin.css';
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { ProSidebar, Menu, MenuItem, SidebarHeader, SidebarContent } from 'react-pro-sidebar';
import avatarImg from './avatar.jpg';
import Modal from 'react-modal';
import AdminProfileModal from './AdminProfile';
import { Link, Outlet } from "react-router-dom";
import { AiOutlineUser } from "react-icons/ai";



const AdminDashBoard = () => {

  const [showContent, setShowContent] = useState(false);

  const toggleManagerContent = () => {
    setShowContent(!showContent);
  };


  return (
    <div>
      <ProSidebar>
        <SidebarHeader>
          <div>
            <img className="avatar"
              src={avatarImg}
              alt="Avatar"
            />
            <h3 className="name"> JackBoCon</h3>
          </div>
          <button>
            <Link to="/admin/profile">Admin Profile</Link>
          </button>
        </SidebarHeader>

        <SidebarContent>

<Menu iconShape="square">
  <MenuItem className="menu-main" onClick={toggleManagerContent}>
    <AiOutlineUser />
    <span style={{ marginLeft: "10px" }}>Manager</span>
  </MenuItem>

  {showContent && (
    <>
      <MenuItem className="menu-sub">
        <Link to="/admin/nurse">Manager School Nurse</Link>
      </MenuItem>
      <MenuItem className="menu-sub">
        <Link to="/admin/parent">Manager Parent</Link>
      </MenuItem>
      <MenuItem className="menu-sub">
        <Link to="/admin/student">Manager Student</Link>
      </MenuItem>
    </>
  )}
</Menu>

        </SidebarContent>
      </ProSidebar>
    </div>

  );
}
export default AdminDashBoard;