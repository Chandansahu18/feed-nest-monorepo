import { GoogleGenAI } from '@google/genai';

const modelName = process.env.MODEL as string;
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

export const enhanceData = async (userData: string) => {
  const config = {
    responseMimeType: 'text/plain',
    temperature: 0.7,
    maxOutputTokens: 1024,
  };

  const model = modelName;
  let contents = '';
  try {
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents
    });

    for await (const chunk of response) {
      if (chunk.text) {
        console.log(chunk.text);
      }
    }

  } catch (error) {
    throw new Error(`Enhancement failed: ${error}`);
  }
};
