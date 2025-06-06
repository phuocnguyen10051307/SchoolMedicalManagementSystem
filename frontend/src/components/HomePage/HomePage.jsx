import React from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import Introduction from './Introduction';
import HealthRecordSection from './HealthRecordSection';
// import ScheduleSection from './ScheduleSection';
import StatsSection from './StatsSection';
import Footer from './Footer';

const HomePage = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <Introduction />
      <HealthRecordSection />
      {/* <ScheduleSection /> */}
      <StatsSection />
      <Footer />

    </>
  )
}
export default HomePage;