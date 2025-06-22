import TechStack from "../../components/landing-page-sections/tech-stack-section";
import CTASection from "../../components/landing-page-sections/cta-section";
import BlogsSection from "../../components/landing-page-sections/blogs-section";
import BookmarkSection from "../../components/landing-page-sections/bookmark-section";
import AISection from "../../components/landing-page-sections/ai-section";
import HeroSection from "../../components/landing-page-sections/hero-section";
import FeatureSection from "../../components/landing-page-sections/feature-section";
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Tech Stack */}
      <TechStack />

      {/* Blogs Section */}
      <BlogsSection />

      {/* Bookmarks Section */}
      <BookmarkSection />

      {/* AI Section */}
      <AISection />

      {/* Features Section */}
      <FeatureSection />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
};

export default LandingPage;
