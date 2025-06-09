import React from 'react';
import './ScheduleSection.css';

const ScheduleSection = () => {
  return (
    <div className="schedule-section">
      <div className="schedule-image">
        <img src="https://slchc.edu/wp-content/uploads/2023/10/geriatric-care-SLCHC-scaled-2560x1280.jpeg" alt="Nurse" />
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
        <ul className="check-icon">
          <li><span >✔</span><strong>Quick and convenient online scheduling</strong></li>
          <li><span>✔</span><strong> Ensure students take medication safely and on time</strong></li>
        </ul>
        <button className="schedule-button">Make Schedule Now!</button>
      </div>
    </div>
  );
};

export default ScheduleSection;
