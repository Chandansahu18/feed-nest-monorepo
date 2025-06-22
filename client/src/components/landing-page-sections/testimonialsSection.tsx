import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { useEffect, useState } from "react";
import { CLOUDINARY_API } from "@/utils/apiClient";
import type {  TTestimonialsSection } from "@/utils/schema/landingPage";

const Testimonials = () => {
  const [testimonialContent, setTestimonialContent] = useState<null | TTestimonialsSection>(null)
  useEffect(() => {
    const fetchTestimonialSection = async () => {
         try {
           const response = await CLOUDINARY_API.get(
             "/v1750586790/testimonialSection_ywjbuw.json",
             {
               headers: {
                 cache: "no-cache",
               },
             }
           );
          
           setTestimonialContent(response.data);
         } catch (error) {
           throw new Error("Something went wrong");
         }
       };
       fetchTestimonialSection();
  }, [])
  
if (!testimonialContent) {
  return null;
}

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
          Trusted by millions of users worldwide.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonialContent.testimonials.map((testimonial, index:number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-60">
                <CardContent className="p-0">
                  <blockquote className="text-gray-700 dark:text-white mb-4">
                    {testimonial.blockquote}{" "}
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium text-sm">
                        {testimonial.author}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {testimonial.designation}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Testimonials;
