import { motion } from "framer-motion";
import { Button } from "../ui/button";
const BlogsSection = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl mb-6">
              Discover
              <span className="font-bold"> blogs </span>
              that matter to
              <span className="font-bold"> you. </span>
            </h2>

            <p className="text-xl text-muted-foreground mb-8">
              Browse through curated categories and find your next favorite
              read. From tech insights to lifestyle tips, explore diverse voices
              and perspectives - all organized for effortless discovery.
            </p>

            <Button className="px-8 py-6 rounded-xl w-2/5">
              Explore Feeds
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
                 <video width={800} height={600} autoPlay muted loop>
                <source
                  src="https://res.cloudinary.com/dgquchqc2/video/upload/v1750526669/blogs-section_rfyhvz.mp4"
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
