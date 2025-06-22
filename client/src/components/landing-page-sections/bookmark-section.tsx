import { Button } from "../ui/button";
import { motion } from "framer-motion";

const BookmarkSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1 relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-xl">
              
              <video width={800} height={600} autoPlay muted loop>
                <source
                  src="https://res.cloudinary.com/dgquchqc2/video/upload/v1750528869/bookmarks-section_fupu0e.mp4"
                  className="w-full h-auto"
                  type="video/mp4"
                />
              </video>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-4xl lg:text-5xl mb-6">
              Never Lose
              <span className="font-bold"> Track </span>
              of Great
              <span className="font-bold"> Content. </span>
            </h2>

            <p className="text-xl text-muted-foreground mb-8">
              Bookmark your favorite blog posts and build your personal
              knowledge library. Whether you're researching for your next
              project, or simply want to revisit that brilliant tutorial later,
              save posts with one click.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BookmarkSection;
