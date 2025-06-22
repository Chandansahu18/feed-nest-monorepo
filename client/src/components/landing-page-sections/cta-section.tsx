import { motion } from "framer-motion";
import { useTheme } from "../theme-provider";

const CTASection = () => {
  const { theme } = useTheme();
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8"
      >
        <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center">
          {theme === "dark" ? (
            <img
              src="https://res.cloudinary.com/dgquchqc2/image/upload/v1750357672/favicon_migqwq.svg"
              alt="icon"
              className="size-full object-contain"
            />
          ) : (
            <img
              src="https://res.cloudinary.com/dgquchqc2/image/upload/v1750522650/favicon_nbl5mf.svg"
              alt="icon"
              className="size-full object-contain"
            />
          )}
        </div>

        <h2 className="text-4xl lg:text-5xl">
          Bringing <span className="font-bold"> writers </span>
          and
          <span className="font-bold"> readers </span>
          together for
          <br />
          effortless
          <span className="font-bold"> blogging </span>
          and
          <span className="font-bold"> discovery. </span>
        </h2>
      </motion.div>
    </section>
  );
};

export default CTASection;
