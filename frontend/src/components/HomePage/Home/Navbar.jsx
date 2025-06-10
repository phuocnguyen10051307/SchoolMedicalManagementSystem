import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar_logo">
        Edu<span>Health</span>
      </div>
      <ul className="navbar_links">
        <Link to= {'/home'}>Home</Link>
        {/* <Link to={`/parent`}>aaa</Link> */}
        <Link to= {'/service'}>Services</Link>
        <Link to= {'blog'}>Blogs</Link>
   

      </ul>
      <div className="navbar_auth">
        <span className="navbar_signin">Sign In</span>
        <button className="navbar_signup">Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;