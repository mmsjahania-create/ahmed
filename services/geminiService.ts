
import { GoogleGenAI } from "@google/genai";

// Initialize the Google GenAI SDK with the API key from environment variables as a named parameter.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getImageInsights = async (base64Image: string, fileName: string): Promise<string> => {
  try {
    // Generate content using gemini-3-flash-preview for image analysis with text and image parts.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { text: "Analyze this image and provide a brief, professional insight (2 sentences) on why converting it to PNG might be beneficial (e.g., transparency support, lossless quality for graphics, etc.)." },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image.split(',')[1] || base64Image
            }
          }
        ]
      },
      config: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      }
    });

    // Access the generated text content directly from the response.text property (not a method).
    return response.text || "PNG offers lossless compression, making it ideal for maintaining high image quality.";
  } catch (error) {
    console.error("Gemini Insights Error:", error);
    return "Converting to PNG ensures lossless compression and compatibility for web graphics.";
  }
};
