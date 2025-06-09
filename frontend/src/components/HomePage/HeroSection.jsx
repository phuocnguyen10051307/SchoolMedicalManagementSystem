import React from 'react';
import './HeroSection.css'; 
import nurse2 from '../../images/nurse2.png';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-left">
        <h1 className="hero-title">
          Medical care support for parents to easily see the student’s condition
        </h1>
        <p className="hero-description">
          <li>EduHealth is a new approach to managing student health at school.</li>
          
          We provide free tools that help parents keep track of their children's health and support school nurses in managing medical records, vaccinations, medication distribution, and health-related events. Everything is designed to be simple, user-friendly, and safe for the school community.
        </p>
        <button className="hero-button">Contact Us</button>
      </div>
       <div className="hero-right">
        <div className="nurse-section">

          <div className="nurse-card">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Nurse" className="nurse-avatar" />
            <h3 className="nurse-name">Nurse Shimanta</h3>
            <p className="nurse-title">Head of School Health Department</p>
            <button className="schedule-button">Make Schedule</button>
          </div>
          <img src={nurse2} alt="Nurse" className="nurse-image" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
