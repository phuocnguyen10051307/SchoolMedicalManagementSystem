import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import Introduction from "./Introduction";
import HealthRecordSection from "./HealthRecordSection";
import ScheduleSection from "./ScheduleSection";
import StatsSection from "./StatsSection";
import Footer from "./Footer";
import PreventionTip from "./PreventionTip";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <div style={{ marginTop: "100px" }}>
        <HeroSection />
        <Introduction />
        <HealthRecordSection />
        <ScheduleSection />
        <StatsSection />
        <PreventionTip />
        <Footer />
      </div>
    </>
  );
};
export default HomePage;
