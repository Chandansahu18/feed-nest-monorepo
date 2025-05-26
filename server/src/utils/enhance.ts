import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

export const enhanceData = async (userData: any) => {
  const config = {
    responseMimeType: 'text/plain',
    temperature: 0.7,
    maxOutputTokens: 1024,
  };

  const model = 'gemini-2.5-flash-preview-05-20';

  let inputType = '';
  let userInput = '';

  if (userData.postTitle) {
    inputType = 'title';
    userInput = userData.postTitle;
  } else if (userData.postDescription) {
    inputType = 'description';
    userInput = userData.postDescription;
  } else {
    throw new Error(
      'Please provide either post title or post description in userData',
    );
  }

  // Check if user input contains intentional markdown formatting
  const hasMarkdown = /(\*\*.*?\*\*|\*.*?\*|#{1,6}\s)/g.test(userInput);
  let markdownInstructions;
  let contents = '';

  if (inputType === 'title') {
    markdownInstructions = hasMarkdown
      ? '- Preserve any bold (**text**) or other markdown formatting the user included'
      : '- No special characters, asterisks, or formatting';

    contents = `You are a professional content writer. I need you to create an enhanced sentence that expands upon this post title with additional relevant context and information.

Original title: "${userInput}"

Instructions:
- Create a comprehensive sentence that includes the original concept AND adds related valuable information
- Provide context, background, or complementary details that enhance understanding
- Make it informative and engaging, not just a rephrased version
- Keep it under 80 characters for title format
- Use clear, simple language
${markdownInstructions}
- Return only the enhanced sentence, nothing else

Enhanced sentence with additional context:`;
  } else if (inputType === 'description') {
    markdownInstructions = hasMarkdown
      ? '- Preserve any bold (**text**) or other markdown formatting the user included'
      : '- No special characters, asterisks, or formatting';

    contents = `You are a professional content writer. I need you to create an enhanced description that expands upon the original with additional relevant information and context.

Original description: "${userInput}"

Instructions:
- Build upon the original concept by adding related facts, context, or valuable insights
- Include complementary information that enriches the original message
- Write 2-3 comprehensive sentences that provide more depth than the original
- Don't just rephrase - add genuine additional value and related information
- Make it informative and engaging with supporting details
- Use simple, direct language
${markdownInstructions}
- Return only the enhanced description with added context, nothing else

Enhanced description with additional information:`;
  }

  try {
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let fullResponse = '';

    for await (const chunk of response) {
      if (chunk.text) {
        fullResponse += chunk.text;
        console.log(chunk.text);
      }
    }

    // Extract only the enhanced content
    let enhancedContent = fullResponse.trim();

    // Clean up unwanted content but preserve intentional markdown if present
    let extractedResult = enhancedContent;

    // Remove prefixes/labels
    extractedResult = extractedResult
      .replace(
        /^(Enhanced sentence with additional context:|Enhanced description with additional information:|Improved title:|Enhanced title:|Title:|Improved description:|Enhanced description:|Description:)/i,
        '',
      )
      .trim();

    // Only strip markdown if it wasn't in the original input
    if (!hasMarkdown) {
      extractedResult = extractedResult
        .replace(/\*\*/g, '') // Remove bold markdown
        .replace(/\*/g, '') // Remove italic markdown
        .replace(/#{1,6}\s?/g, ''); // Remove heading markdown
    }

    // Clean up other formatting issues
    extractedResult = extractedResult
      .replace(/^["']|["']$/g, '') // Remove quotes at start/end
      .replace(/\\"/g, '"') // Fix escaped quotes
      .replace(/\\\\/g, '\\') // Fix escaped backslashes
      .replace(/[\r\n]+/g, ' ') // Replace line breaks with spaces
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();

    return {
      enhanced: extractedResult,
      inputType: inputType,
      preservedMarkdown: hasMarkdown,
    };
  } catch (error) {
    throw new Error(`Enhancement failed: ${error}`);
  }
};
