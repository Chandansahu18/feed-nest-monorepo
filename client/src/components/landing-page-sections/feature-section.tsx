import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";

const features = [
            {  
              image:"https://res.cloudinary.com/dgquchqc2/image/upload/v1750569582/markdown-feature_jwps7e.svg",
              imageAlt:"feature-markdown",
              title: "Markdown editor with live preview.",
              description:
                "Write in Markdown with instant content preview. It makes formatting and organizing content intuitive and flexible.",
            },
            {
                 image:"https://res.cloudinary.com/dgquchqc2/image/upload/v1750573273/tag-feature_rwzfhn.svg",
              imageAlt:"feature-tags",
              title: "Organize content with tags.",
              description:
                "Structure your blog with tags. Add relevant tags to your posts for better discoverability and help readers find related content easily.",
              
            },
            {
                 image:"https://res.cloudinary.com/dgquchqc2/image/upload/v1750572702/ai-feature_tstggx.svg",
              imageAlt:"feature-ai",
              title: "AI-assisted writing optimization",
              description:
                "Utilize AI to enhance blog content and blog title, generate well structured content until your staisfaction.",
            
            },
          ]

const FeatureSection = () => {
  return (
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

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-[#1a1a1a] border-gray-700 rounded-xl">
                <CardContent className="px-0">
                  <div className="px-0">
                   <img src={feature.image} alt={feature.imageAlt} className="object-cover h-24 w-full rounded-lg"/>
                  </div>
                   <div className="space-y-4 px-6">
                  <h3 className="text-white text-xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-[#888888] text-base leading-relaxed">{feature.description}</p>
                   </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
 <Card className="">
          <CardContent className="p-8">
            {/* Toolbar Image */}
            <div className="mb-8">
              <img
                src="/toolbar.png"
                alt="Markdown editor toolbar with formatting options"
                className="w-full rounded-lg"
              />
            </div>

            {/* Content */}
            <div className="space-y-4">
              <h3 className="">Block-based WYSIWYG Markdown editor.</h3>
              <p className="text-[#888888] text-base leading-relaxed">
                Write in Markdown with instant content preview or use WYSIWYG mode for non-technical writers.
              </p>
            </div>
          </CardContent>
        </Card>