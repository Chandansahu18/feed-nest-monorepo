import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const AISection = () => {
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
            <span className="font-bold">
              <Sparkles className="inline w-12 h-12 text-purple-400" />{" "}
              AI-Powered enhancement
            </span>
            <br />
            to optimize & improve blog post structure.
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
         Great content starts with great structure. Feednest's AI analyzes and enhances every element of your blog posts from attention-grabbing titles to perfectly organized paragraphs that keep readers engaged.
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
            <video width={1200} height={700} autoPlay muted loop>
              <source
                src="https://res.cloudinary.com/dgquchqc2/video/upload/v1750536345/ai-section_vxesan.mp4"
                className="w-full h-auto"
                type="video/mp4"
              />
            </video>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AISection;
