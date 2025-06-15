import React from 'react';
import './Navbar.scss';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar_logo">
        Edu<span>Health</span>
      </div>
      <ul className="navbar_links">
        <li><Link to= {'/home'}>Home</Link></li>
        {/* <Link to={`/parent`}>aaa</Link> */}
        <li><Link to="/service">Services</Link></li>
        <li><Link to="/blog">Blogs</Link></li>
   

      </ul>
      <div className="navbar_auth">
        <span className="navbar_signin">Sign In</span>
        <button className="navbar_signup">Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;