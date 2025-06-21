import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  DollarSign,
  FileText,
  MessageSquare,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
const LandingPage = () => {
  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const companies = [
  "FreeCodeCamp",
  "MindsDB",
  "RedwoodJS",
  "Pieces for Developers",
  "PeerDB",
  "Pangea",
  "Hypermode",
  "Outerbase",
  "Metoro",
  "Middleware",
  "Requestly",
]

const Badge: React.FC<{
  children: React.ReactNode
  className?: string
  variant?: "default" | "secondary"
}> = ({ children, className = "", variant = "default" }) => {
  const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
  const variantClasses = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
  }
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  )
}

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const Card: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className = "" }) => {
  return (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
      {children}
    </div>
  )
}

const CardContent: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className = "" }) => {
  return (
    <div className={`p-6 pt-0 ${className}`}>
      {children}
    </div>
  )
}
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background to-muted/20 py-20 lg:py-32">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <div className="text-center mb-16">
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            >
              Create, collaborate, and
              <br />
              <span className="text-muted-foreground">
                scale your blogs and docs.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
            >
              Effortlessly build blogs, API docs, and product guides with
              Feednest, with the flexibility of a headless CMS and more.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button size="lg" className="px-8">
                Sign up for free
              </Button>
              <Button size="lg" variant="outline" className="px-8">
                <MessageSquare className="w-4 h-4 mr-2" />
                Talk to founders
              </Button>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className="text-sm text-muted-foreground mt-4"
            >
              No credit card required.
            </motion.p>
          </div>

          <motion.div
            variants={fadeInUp}
            className="relative max-w-5xl mx-auto"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl border">
              <img
                src="/images/blogging-platform.png"
                alt="Feednest Platform Interface"
                width={1200}
                height={800}
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-background">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-center text-muted-foreground mb-12">
            Trusted by top engineering teams worldwide.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
            {companies.map((company, index) => (
              <motion.div
                key={company}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center text-sm font-medium text-muted-foreground"
              >
                {company}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Docs Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4">
                <FileText className="w-4 h-4 mr-1" />
                Docs
              </Badge>

              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                The modern content engine for API docs and product guides.
              </h2>

              <p className="text-xl text-muted-foreground mb-8">
                Create and scale dynamic developer docs and API references.
                Built for teams needing full control and customization — no
                heavy lifting, no upkeep, no reinventing the wheel.
              </p>

              <Button>Explore docs →</Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/images/writing-editor.png"
                  alt="Writing Editor Interface"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Blogs Section */}
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
                <img
                  src="/images/ai-features-dark.png"
                  alt="AI Features Interface"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <Badge className="mb-4">
                <MessageSquare className="w-4 h-4 mr-1" />
                Blogs
              </Badge>

              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                The best blogging platform for developers and teams.
              </h2>

              <p className="text-xl text-muted-foreground mb-8">
                Effortlessly run your blog, solo or with a team. Customize
                everything — map a domain, subdomain, or use a company sub-path.
                Already loved by millions of devs worldwide.
              </p>

              <Button>Learn more →</Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI Section */}
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
            <Badge className="mb-6 bg-purple-100 text-purple-800 hover:bg-purple-100">
              Do more with feednest AI.
            </Badge>

            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              The <Sparkles className="inline w-12 h-12 text-purple-400" />{" "}
              AI-powered content
              <br />
              stack for everyone on your team.
            </h2>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Feednest's AI tools help your team move quickly to deliver docs
              and blogs that your users will love. Built-in features to make
              your team 100x more productive.
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
              <img
                src="/images/ai-workflow.png"
                alt="AI Workflow Features"
                width={1200}
                height={700}
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-bold text-center mb-16"
          >
            3 reasons to choose feednest.
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8 text-blue-400" />,
                title:
                  "No context switching — One platform for blogs, and docs.",
                description:
                  "Set up blogs, API docs, or product guides effortlessly on Feednest, and keep your team on the same page. No more context switching—less to learn, more to get done.",
                features: [
                  "Product guides",
                  "API docs",
                  "Blogs",
                  "Change-logs",
                  "Static pages",
                ],
              },
              {
                icon: <Users className="w-8 h-8 text-purple-400" />,
                title: "Customize and match your design with headless mode.",
                description:
                  "Launch a hosted blog or docs, or go fully custom with headless mode—a treat for developers. No need to reinvent the wheel.",
                features: ["Blog", "Doc"],
              },
              {
                icon: <DollarSign className="w-8 h-8 text-green-400" />,
                title: "Cost-effective with no infrastructure to maintain",
                description:
                  "Focus on building, not hosting. We handle your blog and docs while your team creates great content—saving you time and costs.",
                features: ["$", "⏱️"],
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gray-800 border-gray-700 h-full">
                  <CardContent className="p-8">
                    <div className="mb-6">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 mb-6">{feature.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {feature.features.map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          variant="secondary"
                          className="bg-gray-700 text-gray-300"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mx-auto mb-8 flex items-center justify-center">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <div className="w-5 h-5 bg-blue-500 rounded-lg"></div>
            </div>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Give your team a modern content
            <br />
            engine for blogs and docs.
          </h2>

          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          >
            <Zap className="w-4 h-4 mr-2" />
            Start in 30 seconds
          </Button>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
