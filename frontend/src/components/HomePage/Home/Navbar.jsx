import React, { useContext } from "react";
import "./Navbar.scss";
import { AuthContext } from "../../../context/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  return (
    <nav className="navbar">
      <div className="navbar_logo">
        Edu<span>Health</span>
      </div>
      <ul className="navbar_links">
        <li>
          <Link to={""}>Home</Link>
        </li>
        <li>
          <Link to="/service">Services</Link>
        </li>
        <li>
          <Link to="/blog">Blogs</Link>
        </li>
        {!!user && user.role_id === "ADMIN" && (
          <li>
            <Link to="/admin">Admin</Link>
          </li>
        )}
        {!!user && user.role_id === "PARENT" && (
          <li>
            <Link to="/parent/profile">Parent</Link>
          </li>
        )}
        {!!user && user.role_id === "MANAGER" && (
          <li>
            <Link to="/manager">Manager</Link>
          </li>
        )}
        {!!user && user.role_id === "NURSE" && (
          <li>
            <Link to="/nurse/dashboard">Nurse</Link>
          </li>
        )}
      </ul>
      <div className="navbar_auth">
        {!!!user && (
          <div>
            <Link to="login">Sign in </Link>
            <Link to="register">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
