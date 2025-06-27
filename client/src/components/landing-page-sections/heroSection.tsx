import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import type { THeroSection } from "../../utils/schema/landingPage";
import { useEffect, useState } from "react";
import { CLOUDINARY_API } from "@/utils/apiClient";

const HeroSection = () => {
  const navigate = useNavigate();
  const [heroContent, setHeroContent] = useState<null | THeroSection>(null);

  useEffect(() => {
    const fetchHeroSection = async () => {
      try {
        const response = await CLOUDINARY_API.get(
          "/v1750584998/hero-section_gzrboi.json",
          {
            headers: {
              cache: "no-cache",
            },
          }
        );
        setHeroContent(response.data.heroSection);
      } catch (error) {
        throw new Error("Something went wrong");
      }
    };
    fetchHeroSection();
  }, []);

  const handleSignup = () => {
    navigate("/auth", { state: { type: "signup" } });
  };
  if (!heroContent) {
    return null;
  }
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background to-muted/20 py-20 lg:py-32 border-b">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-16">
          <motion.h1 className="text-4xl md:text-6xl lg:text-7xl mb-6">
            {heroContent.headline.parts.map((part, index) => (
              <span key={index}>
                {part.isBold ? (
                  <span className="font-bold"> {part.text} </span>
                ) : (
                  part.text
                )}
                {part.isLineBreak && <br />}
              </span>
            ))}
          </motion.h1>

          <motion.p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            {heroContent && heroContent.subtitle}
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              className="px-8 py-6 rounded-xl w-3/4 min-[425px]:w-72 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
              onClick={handleSignup}
            >
              {heroContent && heroContent.ctaButton.text}
            </Button>
          </motion.div>

          <motion.p className="text-sm font-medium text-muted-foreground mt-4">
            {heroContent && heroContent.ctaButton.disclaimer}
          </motion.p>
        </div>

        <motion.div className="relative max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-2xl border">
            <video
              width={heroContent.video.width}
              height={heroContent.video.height}
              autoPlay={heroContent.video.autoplay}
              muted={heroContent.video.muted}
              loop={heroContent.video.loop}
            >
              <source
                src={heroContent.video.source}
                className="w-full h-auto"
                type="video/mp4"
              />
            </video>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
