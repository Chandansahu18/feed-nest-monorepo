import { z } from "zod";

// Hero Section Schemas
const partSchema = z.object({
  text: z.string(),
  isBold: z.boolean().default(false),
  isLineBreak: z.boolean().default(false),
});

const headlineSchema = z.object({
  parts: z.array(partSchema),
});

const ctaButtonSchema = z.object({
  text: z.string(),
  disclaimer: z.string().optional(),
});

const videoSchema = z.object({
  source: z.string().url(),
  width: z.number(),
  height: z.number(),
  autoplay: z.boolean(),
  muted: z.boolean(),
  loop: z.boolean(),
});

const heroSectionSchema = z.object({
  headline: headlineSchema,
  subtitle: z.string(),
  ctaButton: ctaButtonSchema,
  video: videoSchema,
});

// Testimonial Section Schema
const testimonialSchema = z.object({
  blockquote: z.string(),
  author: z.string(),
  designation: z.string(),
});

const testimonialsSectionSchema = z.object({
  testimonials: z.array(testimonialSchema),
  headerText: z.string(),
});

const aiSectionSchema = z.object({
  heading: z.array(partSchema),
  description: z.string(),
  video: videoSchema,
});

const featuresSchema = z.object({
  features: z.array(
    z.object({
      image: z.string(),
      imageAlt: z.string(),
      title: z.string(),
      description: z.string(),
    })
  ),
  heading: z.object({ main: z.string(), boldPart: z.string() }),
  cardContent: z.object({ title: z.string(), description: z.string() }),
});

export type TFeaturesSection = z.infer<typeof featuresSchema>
export type TTestimonialsSection = z.infer<typeof testimonialsSectionSchema>;
export type THeroSection = z.infer<typeof heroSectionSchema>;
export type TAISection = z.infer<typeof aiSectionSchema>;
