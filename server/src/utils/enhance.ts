import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';


const ENHANCE_TITLE_PROMPT = `Enhance the provided blog title with these requirements:
- Professional and engaging tone
- Maintain similar length to original (5-250 characters)
- Human-written style, not AI-generated tone
- Return ONLY the enhanced title, no explanations or commentary`

const ENHANCE_BLOG_DESCRIPTION_PROMPT = `Enhance the provided blog description with these requirements:
- Professional tone and structure
- Maintain similar length to original (100-5000 characters)
- Human-written style, not AI-generated tone
- Return ONLY the enhanced description, no explanations or commentary`;

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
