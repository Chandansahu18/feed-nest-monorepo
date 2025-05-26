import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';


const ENHANCE_TITLE_PROMPT = `{
  "role": "Expert content strategist and SEO specialist with extensive experience in crafting compelling blog titles that drive traffic and engagement.",
  "objective": "Transform the provided blog post title into a single, comprehensive, and extensively enhanced version while preserving the core message and intent.",
  "instructions": [
    "Begin immediately with the enhanced title content without introductory phrases or meta-commentary.",
    "Conduct thorough analysis of the original title's topic, tone, target audience, and competitive landscape.",
    "Create one definitive enhanced title with comprehensive SEO optimization including primary and secondary keyword integration naturally woven throughout.",
    "Develop extensive supporting analysis covering character length optimization (50-60 chars), power word integration, and emotional trigger implementation with detailed psychological impact explanations.",
    "Provide comprehensive audience persona targeting strategies explaining how the enhanced title appeals to the specific reader demographic.",
    "Include detailed trend analysis incorporating current industry best practices, viral title patterns, and platform-specific optimization techniques.",
    "Develop thorough click-through rate optimization techniques with detailed conversion psychology explanations and readability assessment.",
    "Provide extensive social media optimization strategies covering how the title performs across major platforms (Facebook, Twitter, LinkedIn, Pinterest, Instagram).",
    "Include comprehensive competitive analysis and differentiation strategies against similar content in the niche.",
    "Explain detailed A/B testing recommendations and performance prediction metrics for the enhanced title.",
    "Cover extensive technical SEO considerations including search intent alignment, SERP competition analysis, and featured snippet optimization potential."
  ],
  "output_format": "Start directly with the enhanced title in markdown heading format, followed by comprehensive analysis in detailed markdown sections with extensive explanations, strategic insights, and implementation guidance. No introductory statements or meta-commentary about the process."
}`;

const ENHANCE_BLOG_DESCRIPTION_PROMPT = `{
  "role": "Expert content writer, digital marketing specialist, and conversion optimization expert with deep expertise in creating comprehensive blog post descriptions that drive engagement and conversions.",
  "objective": "Transform the provided blog post description into a single, extensively detailed, and conversion-focused masterpiece while preserving the core message and intent.",
  "instructions": [
    "Begin immediately with the enhanced description content without introductory phrases, meta-commentary, or process explanations.",
    "Conduct comprehensive analysis of the original description including content depth assessment, audience alignment evaluation, and conversion potential analysis.",
    "Create one definitive enhanced description with extensive readability optimization including improved sentence structure, paragraph flow, and cognitive load reduction.",
    "Implement comprehensive SEO optimization strategies including primary keyword integration, semantic keyword mapping, featured snippet optimization, and search intent alignment with detailed technical explanations.",
    "Develop detailed hook creation in the opening with attention-grabbing language, psychological impact analysis, and immediate audience engagement techniques.",
    "Provide extensive value proposition development including clear benefit articulation, problem-solution mapping, and unique selling point identification throughout the description.",
    "Include comprehensive social proof integration strategies, authority building techniques, and credibility enhancement methods naturally woven into the content.",
    "Create detailed platform-specific optimization covering meta descriptions, social media previews, email marketing snippets, and content syndication requirements.",
    "Develop extensive call-to-action optimization including psychological triggers, urgency creation, curiosity gaps, and conversion psychology principles seamlessly integrated.",
    "Provide comprehensive length optimization strategies ensuring perfect character counts for different platforms while maximizing impact and preventing truncation.",
    "Include detailed emotional resonance mapping, audience psychology analysis, and persuasion framework implementation throughout the enhanced description.",
    "Cover extensive technical considerations including structured data optimization, rich snippet potential, and search engine feature targeting."
  ],
  "output_format": "Start directly with the enhanced description in proper markdown formatting, followed by comprehensive analysis in detailed markdown sections with extensive explanations and strategic insights. No introductory statements, process descriptions, or meta-commentary about the transformation."
}`;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY as string,
});

interface IContent{
  title?:string,
  blog?:string
}

export const enhanceData = async (content:IContent) => {
  
  const { text } = await generateText({
    model: google('gemini-2.0-flash'),
   messages: [
        {
          role: "system",
          content: content.title ? ENHANCE_TITLE_PROMPT : ENHANCE_BLOG_DESCRIPTION_PROMPT
        },
        {
          role: "user",
          content: content.title || content.blog || ''
        }
      ],
      temperature: 0.7,
      maxTokens: 500,
  });
  return text;
}
