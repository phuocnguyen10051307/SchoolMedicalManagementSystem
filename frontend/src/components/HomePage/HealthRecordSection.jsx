import React from 'react';
import './HealthRecordSection.css';


const HealthRecordSection = () => {
  return (
    <div className="healthrecord-container">
      <div className="healthrecord-left">
        <h1>Comprehensive school health care</h1>
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

      
    </div>
  );
};

export default HealthRecordSection;
