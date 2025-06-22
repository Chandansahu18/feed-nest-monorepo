import { motion } from "framer-motion";
import { useTheme } from "../theme-provider";

const TechStack = () => {
    const { theme } = useTheme();
  const techStack = theme === 'dark' ? (
    [
    "https://res.cloudinary.com/dgquchqc2/image/upload/v1750519949/typescript-logo_dahwrv.svg",
    "https://res.cloudinary.com/dgquchqc2/image/upload/v1750519968/react-logo_nxk0zl.svg",
    "https://res.cloudinary.com/dgquchqc2/image/upload/v1750568174/postgreSQL-logo_lgrl8w.svg",
    "https://res.cloudinary.com/dgquchqc2/image/upload/v1750568626/express-logo_kokyf4.svg",
    "https://res.cloudinary.com/dgquchqc2/image/upload/v1750568790/prisma-logo_h4n8dj.svg",
    "https://res.cloudinary.com/dgquchqc2/image/upload/v1750520936/zod-logo_ch5vki.svg"
  ]
  ):(
    [
    "https://res.cloudinary.com/dgquchqc2/image/upload/v1750519949/typescript-logo_dahwrv.svg",
    "https://res.cloudinary.com/dgquchqc2/image/upload/v1750519968/react-logo_nxk0zl.svg",
    "https://res.cloudinary.com/dgquchqc2/image/upload/v1750568174/postgreSQL-logo_lgrl8w.svg",
    "https://res.cloudinary.com/dgquchqc2/image/upload/v1750521462/express-logo_mqd4pk.svg",
    "https://res.cloudinary.com/dgquchqc2/image/upload/v1750520935/prisma-logo_kbkoqn.svg",
    "https://res.cloudinary.com/dgquchqc2/image/upload/v1750520936/zod-logo_ch5vki.svg"
  ]
  )

  return (
    <section className="py-16 bg-background">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <p className="text-center text-muted-foreground mb-12 font-semibold text-xl">
          Built using these tech stack.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {techStack.map((tech, index) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="size-10"
            >
           <img src={tech} alt="tech" className="rounded-md" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default TechStack;
