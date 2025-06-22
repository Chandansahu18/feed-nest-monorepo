import { CLOUDINARY_API } from "@/utils/apiClient";
import type { TAISection } from "@/utils/schema/landingPage";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const AISection = () => {
  const [aiContent, setAiContent] = useState<null | TAISection>(null);

  useEffect(() => {
    const fetchAiSection = async () => {
      try {
        const response = await CLOUDINARY_API.get(
          "/v1750592425/ai-section_wf3i1w.json",
          {
            headers: {
              cache: "no-cache",
            },
          }
        );
        setAiContent(response.data.AiFeature);
      } catch (error) {
        throw new Error("Something went wrong");
      }
    };
    fetchAiSection();
  }, []);

  if (!aiContent) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-6xl mb-6">
            {aiContent.heading.map((part, index) => (
              <span key={index}>
                {part.isBold && (
                  <span className="font-bold">
                    <Sparkles className="inline w-12 h-12 text-purple-400" />{" "}
                    {part.text}{" "}
                  </span>
                )}
                {!part.isBold && part.text}
                {part.isLineBreak && <br />}
              </span>
            ))}
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {aiContent.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="rounded-2xl overflow-hidden">
            <video
              width={aiContent.video.width}
              height={aiContent.video.height}
              autoPlay={aiContent.video.autoplay}
              muted={aiContent.video.muted}
              loop={aiContent.video.loop}
            >
              <source
                src={aiContent.video.source}
                className="w-full h-auto"
                type={"video/mp4"}
              />
            </video>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AISection;
