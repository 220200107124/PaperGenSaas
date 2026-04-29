import HeroSection from "../components/sections/HeroSection";
import Navbar from "../components/sections/Navbar";
import StatsSection from "../components/sections/StatsSection";
import FeaturesSection from "../components/sections/FeaturesSection";
import HowItWorks from "../components/sections/HowItWorks";
import Testimonials from "../components/sections/TestimonialSection";
import CTASection from "../components/sections/CTASection";
import FAQs from "../components/sections/FaqsSection";
import Footer from "../components/sections/Footer";

const Home = () => {
  return (
    <div>
      <Navbar></Navbar>
      <HeroSection></HeroSection>
      <FeaturesSection></FeaturesSection>
      <HowItWorks></HowItWorks>
      <StatsSection></StatsSection>
      <Testimonials></Testimonials>
      <FAQs></FAQs>
      <CTASection
        title={
          <>
            Ready to Switch to <span className="italic">Digital</span> Paper
            Generation?
          </>
        }
        subtitle="Start your 14-day free trial today. No credit card required. Register your school now."
        buttonText="Get Started Instantly"
        redirectPath="/school-register"
      />
      <Footer></Footer>
    </div>
  );
};

export default Home;
