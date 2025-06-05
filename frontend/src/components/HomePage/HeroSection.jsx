import React from 'react';
import './HeroSection.css'; 

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
        
      </div>
    </section>
  );
};

export default HeroSection;
