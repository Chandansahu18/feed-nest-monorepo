import BlogsSection from "../../components/landing-page-sections/blogsSection";
import AISection from "../../components/landing-page-sections/aiSection";
import HeroSection from "../../components/landing-page-sections/heroSection";
import FeatureSection from "../../components/landing-page-sections/featuresSection";
import Testimonials from "../../components/landing-page-sections/testimonialsSection";
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <BlogsSection />
      <AISection />
      <Testimonials />
      <FeatureSection />
    </div>
  );
};

export default LandingPage;
