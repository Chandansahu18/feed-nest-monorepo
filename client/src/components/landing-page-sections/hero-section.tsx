import { motion } from "framer-motion";
import { Button } from "../ui/button";

const HeroSection = () => {
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
            <span className="font-bold"> Write, style </span>
            and
            <br />
            <span className="font-bold">publish </span>
            your
            <span className="font-bold"> blogs.</span>
          </motion.h1>

          <motion.p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Create stunning blogs with AI assistance, rich formatting, and
            intuitive commands - all in one powerful editor.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="px-8 py-6 rounded-xl w-3/4 min-[425px]:w-72">
              Sign up for free
            </Button>
          </motion.div>

          <motion.p className="text-sm font-medium text-muted-foreground mt-4">
            No credit card required.
          </motion.p>
        </div>

        <motion.div className="relative max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-2xl border">
            <video width={1200} height={800} autoPlay muted loop>
              <source
                src="https://res.cloudinary.com/dgquchqc2/video/upload/v1750518487/hero-section-gif_gg40gj.mp4"
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
