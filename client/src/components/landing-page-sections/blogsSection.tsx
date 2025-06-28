import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { CLOUDINARY_API } from "@/utils/apiClient";
import type { THeroSection } from "@/utils/schema/landingPage";

const BlogsSection = () => {
  const [blogContent, setBlogContent] = useState<null | THeroSection>(null);

  useEffect(() => {
    const fetchBlogSection = async () => {
      try {
        const response = await CLOUDINARY_API.get(
          "/v1750590522/blogs-section_dna8hd.json",
          {
            headers: {
              cache: "no-cache",
            },
          }
        );
        setBlogContent(response.data);
      } catch (error) {
        throw new Error("Something went wrong");
      }
    };
    fetchBlogSection();
  }, []);
 
  if (!blogContent) {
    return null;
  }

  return (
    <section className="py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
           className='text-center lg:text-left'
          >
            <h2 className="text-4xl lg:text-5xl mb-6">
              {blogContent.headline.parts.map((part, index) => (
                <span
                  key={index}
                  className={part.isBold ? "font-bold" : ""}
                >
                  {part.text}
                </span>
              ))}
            </h2>

            <p className="text-xl text-muted-foreground mb-8">
              {blogContent.subtitle}
            </p>
           
            <Button className="px-8 py-6 rounded-xl w-3/4 min-[425px]:w-72 cursor-pointer  bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium">
              {blogContent.ctaButton.text}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <video
                width={blogContent.video.width}
                height={blogContent.video.height}
                autoPlay={blogContent.video.autoplay}
                muted={blogContent.video.muted}
                loop={blogContent.video.loop}
              >
                <source
                  src={blogContent.video.source}
                  className="w-full h-auto"
                  type="video/mp4"
                />
              </video>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BlogsSection;