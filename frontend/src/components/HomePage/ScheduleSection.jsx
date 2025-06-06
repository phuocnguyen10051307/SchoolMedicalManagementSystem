import React from 'react';
import './ScheduleSection.css';

const ScheduleSection = () => {
  return (
    <div className="schedule-section">
      <div className="schedule-image">
        
      </div>
      <div className="schedule-content">
        <h2>
          Schedule appointments with the nurse <br /> in advance and send medication to students
        </h2>
        <p>
          Parents can easily schedule appointments with the school nurse to send
          medication for their children. The system ensures safe and timely medication
          management, giving you peace of mind while your child is at school.
        </p>
        <ul>
          <li>
            <span className="check-icon">✔</span>
            Quick and convenient online scheduling
          </li>
          <li>
            <span className="check-icon">✔</span>
            Ensure students take medication safely and on time
          </li>
        </ul>
        <button className="schedule-button">Make Schedule Now!</button>
      </div>
    </div>
  );
};

export default ScheduleSection;
