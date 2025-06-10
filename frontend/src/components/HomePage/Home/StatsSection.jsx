import React from 'react';
import './StatsSection.css';

const stats = [
  {
    value: '200+',
    label: 'Medication Appointment Schedule'
  },
  {
    value: '150+',
    label: 'Student Medication Management'
  },
  {
    value: '98%',
    label: 'Parent Satisfaction'
  }
];

const StatsSection = () => {
  return (
    <div className="stats-section">
      {stats.map((stat, index) => (
        <div className="stat-card" key={index}>
          {/* <div className="stat-top-border" /> */}
          <div className="stat-value">{stat.value}</div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsSection;
