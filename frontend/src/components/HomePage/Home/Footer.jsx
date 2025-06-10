import React from "react";
import "./Footer.scss";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-section about">
        <h3>EduHealth</h3>
        <p>
          This school health website provides a comprehensive solution for managing student health needs, featuring functions such as health record declaration, medication scheduling, and vaccination tracking.
          Additionally, the website shares useful materials and articles about school health, helping parents and students maintain a healthy lifestyle.
        </p>
      </div>

      <div className="footer-section">
        <h4>Overview</h4>
        <ul>
          <li>Checking Health</li>
          <li>Message With Nurse</li>
          <li>Make a Schedule</li>
        </ul>
      </div>

      <div className="footer-section">
        <h4>Company</h4>
        <ul>
          <li>Home</li>
          <li>About</li>
          <li>Services</li>
        </ul>
      </div>

      <div className="footer-section">
        <h4>Explore</h4>
        <ul>
          <li>Terms & Conds</li>
          <li>Privacy Police</li>
          <li>Cookies</li>
        </ul>
      </div>

      <div className="footer-section social-media">
        <h4>Social Media</h4>
        <div className="icons">
          <FaFacebookF />
          <FaInstagram />
          <FaTwitter />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
