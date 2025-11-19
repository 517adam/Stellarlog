import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini Client
// Note: In a real production app, we would handle the missing API key more robustly.
// For this demo, we assume the environment variable is set.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getDailyQuote = async (): Promise<{ text: string; author: string }> => {
  if (!apiKey) {
    console.warn("No API Key provided for Gemini.");
    return {
      text: "The cosmos is within us. We are made of star-stuff.",
      author: "Carl Sagan"
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Generate a short, profound, and poetic quote about the universe, stars, coding, or exploration. Return a JSON object with "text" and "author" (you can invent a persona or attribute to "Gemini AI" if it is original).',
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            author: { type: Type.STRING }
          },
          required: ["text", "author"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response");
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Failed to fetch quote from Gemini:", error);
    return {
      text: "Look up at the stars and not down at your feet.",
      author: "Stephen Hawking"
    };
  }
};

export const generateBlogSummary = async (title: string): Promise<string> => {
  if (!apiKey) return "A fascinating journey into the depths of this topic...";

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Write a 2-sentence alluring teaser summary for a blog post titled "${title}".`,
    });
    return response.text || "Click to read more...";
  } catch (e) {
    return "Click to read more...";
  }
}
