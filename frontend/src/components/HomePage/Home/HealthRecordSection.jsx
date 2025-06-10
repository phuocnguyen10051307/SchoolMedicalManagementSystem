import React from 'react';
import './HealthRecordSection.css';
import nurse2 from '../../../images/nurse2.png';

const HealthRecordSection = () => {
  return (
    <div className="healthrecord-container">
      <div className="healthrecord-left">
        <h2>Comprehensive school health care</h2>
        <p>
          The school health management software helps parents declare health records, send medication, and receive
          medical check-up notifications. Medical staff can easily manage medical events, vaccinations, and periodic
          check-ups.
        </p>
        <ul className="healthrecord-benefits">
          <li><span>✔</span> <strong>Support quick declaration of health records</strong></li>
          <li><span>✔</span> <strong>Efficient management of vaccinations and medical check-ups</strong></li>
          <li><span>✔</span> <strong>Connect parents and schools anytime, anywhere</strong></li>
        </ul>
        <button className="healthrecord-button">Health record declaration</button>
      </div>

      <div className="healthrecord-right">
        <div className="nurse-card">
          <h4>Available Nurse</h4>
          <p>Select Nurse</p>
          <div className="nurse-profile">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Nurse Adinda" />
            <span>Nurse Adinda</span>
          </div>
          <div className="nurse-profile">
            <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="Nurse Jackson" />
            <span>Nurse Jackson</span>
          </div>
          <button className="find-nurse-btn">Find Nurse</button>
        </div>
        <div className="nurse2-image">
        <img src={nurse2} alt="Nurse" />
        </div>
      </div>
    </div>
  );
};

export default HealthRecordSection;
