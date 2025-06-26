import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import type { TFeaturesSection } from "@/utils/schema/landingPage";
import { useEffect, useState } from "react";
import { CLOUDINARY_API } from "@/utils/apiClient";
import MissionSection from "./missionSection";

const FeatureSection = () => {
  const [featureContent, setFeatureContent] = useState<null | TFeaturesSection>(
    null
  );

  useEffect(() => {
    const fetchFeatureSection = async () => {
      try {
        const response = await CLOUDINARY_API.get(
          "/v1750789971/feature-section_d5gwes.json",
          {
            headers: {
              cache: "no-cache",
            },
          }
        );
        setFeatureContent(response.data.featuresSection);
      } catch (error) {
        throw new Error("Something went wrong");
      }
    };
    fetchFeatureSection();
  }, []);

  if (!featureContent) {
    return null;
  }

  return (
    <>
      <section className="py-20 h-auto bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl text-center mb-16"
          >
            Why<span className="font-bold"> choose </span>feednest?
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureContent.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="bg-[#1a1a1a] border-gray-700 h-72 rounded-xl py-0">
                  <CardContent className="p-0">
                    <div className="p-0">
                      <img
                        src={feature.image}
                        alt={feature.imageAlt}
                        className="object-cover h-24 w-full rounded-lg"
                      />
                    </div>
                    <div className="space-y-4 px-6">
                      <h3 className="text-white text-xl font-semibold">
                        {feature.title}
                      </h3>
                      <p className="text-[#888888] text-base leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <MissionSection />
    </>
  );
};

export default FeatureSection;
