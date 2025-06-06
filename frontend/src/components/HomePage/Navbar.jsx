import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar_logo">
        Edu<span>Health</span>
      </div>
      <ul className="navbar_links">
        <li>Home</li>
        <li>Services</li>
        <li>Blogs</li>
        
      </ul>
      <div className="navbar_auth">
        <span className="navbar_signin">Sign In</span>
        <button className="navbar_signup">Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;