import React from 'react';
import './Introduction.scss';

const features = [
  {
    icon: '🔍',
    title: '1. Declaration',
    description: 'Declare student health records'
  },
  {
    icon: '👨‍⚕️',
    title: '2. Send Notification',
    description: 'The medical staff sends check-up or vaccination notifications'
  },
  {
    icon: '📅',
    title: '3. Management',
    description: 'Manage student health records and medical events'
  }
];

function Introduction() {
  return (
    <section className="introduction">
      <div className="intro-content">
        <h1 className="intro-title">Welcome to EduHealth</h1>
        <p className="intro-description">
          Support parents in declaring health records and medical staff in managing student health
        </p>
        <div className="feature-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Introduction;
