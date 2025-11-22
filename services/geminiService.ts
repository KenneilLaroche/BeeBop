import { GoogleGenAI } from "@google/genai";
import { CollegeYear } from "../types";

// Initialize the client
// Note: In a real production app, you'd likely proxy this through a backend
// to keep the key secret, but for this frontend demo, we use the env var directly.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const generateVibeCheck = async (name: string, school: string, year: CollegeYear): Promise<string> => {
  if (!apiKey) {
    console.warn("No API Key found. Returning mock description.");
    return `A mysterious ${year} from ${school} who radiates chaotic good energy.`;
  }

  try {
    const prompt = `
      Write a short, witty, Gen-Z style social media description (under 30 words) for a college student profile.
      
      Details:
      Name: ${name}
      School: ${school}
      Year: ${year}
      
      Tone: Playful, observant, slight "roast" but friendly. Use slang appropriately.
      Output text only.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "Vibes loading...";
  } catch (error) {
    console.error("Error generating vibe check:", error);
    return "Vibe check failed. You'll have to write this one yourself.";
  }
};

export const analyzeImageVibe = async (base64Image: string): Promise<number> => {
   if (!apiKey) return 5.0;

   try {
     const prompt = `
       Rate this person's "vibe" or "bopness" on a scale of 1 to 10.
       
       Scale Definition:
       1.0 = "Saint" (Innocent, Sweet, Angelic, Safe)
       5.0 = "Meh" (Average, Regular)
       10.0 = "BOP!" (Ultimate cool, attractive, fun, party vibe, icon)
       
       Return ONLY a number (float).
     `;
     
     // Removing the header if present to get raw base64
     const base64Data = base64Image.split(',')[1] || base64Image;

     const response = await ai.models.generateContent({
       model: 'gemini-2.5-flash-image',
       contents: {
         parts: [
            { text: prompt },
            { 
              inlineData: {
                mimeType: 'image/jpeg', // Assuming jpeg for simplicity in this demo context
                data: base64Data
              }
            }
         ]
       }
     });
     
     const text = response.text?.trim();
     const rating = parseFloat(text || '5');
     return isNaN(rating) ? 5 : Math.min(Math.max(rating, 1), 10);
   } catch (e) {
     console.error("Image analysis failed", e);
     return 5.0;
   }
}