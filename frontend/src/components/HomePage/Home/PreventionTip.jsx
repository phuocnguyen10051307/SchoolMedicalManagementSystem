import React from 'react';
import './PreventionTip.css';
import nurseImage from '../../../images/nurse1.png';

const PreventionTip = () => {
  return (
    <div className="prevention-container">
      <h2 className="prevention-title">Disease prevention measures for students</h2>
      <p className="prevention-subtitle">Guidance from the school health office</p>

      <div className="prevention-box">
        <div className="prevention-image">
          <img src={nurseImage} alt="Medical Staff" />
        </div>

        <div className="prevention-content">
          <p>
            The school environment is a place where infectious diseases can easily spread. Below are some measures to help parents and students prevent illnesses effectively:
          </p>
          <ul>
            <li>Wash hands regularly with soap, especially before eating and after playing.</li>
            <li>Wear masks when there are signs of an outbreak in the school.</li>
            <li>Maintain personal hygiene and avoid sharing personal items with friends.</li>
            <li>Get vaccinated fully according to the school’s schedule.</li>
            <li>Cooperate with the school health office to ensure the best health for your children!</li>
          </ul>
          
        </div>
        
      </div>
      <div className="prevention-staff">
            <strong>Naufal Hidayat</strong>
            <p>Medical staff</p>
          </div>
    </div>
  );
};

export default PreventionTip;
