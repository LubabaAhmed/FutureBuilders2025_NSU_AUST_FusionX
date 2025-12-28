
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIPrioritization = async (details: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this emergency SOS message and categorize it (low, medium, high, critical) with a brief justification in Bangla: "${details}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            priority: { type: Type.STRING, enum: ['low', 'medium', 'high', 'critical'] },
            reasoning: { type: Type.STRING },
          },
          required: ["priority", "reasoning"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Prioritization failed", error);
    return { priority: 'high', reasoning: 'জরুরি প্রটোকল সক্রিয় করা হয়েছে।' };
  }
};

export const getAIDoctorAdvice = async (symptoms: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User reports: "${symptoms}". Provide immediate first aid steps in Bangla.`,
      config: {
        systemInstruction: "আপনি একজন মানবিক এবং পেশাদার মেডিকেল সহকারী। আপনি দুর্যোগপ্রবণ এলাকার মানুষের জন্য সহজ এবং কার্যকর চিকিৎসাসেবা প্রদান করেন। আপনার উত্তরগুলো হবে বাংলায়, সহানুভূতিশীল এবং পয়েন্ট আকারে যাতে বিপদের সময় দ্রুত পড়া যায়।"
      }
    });
    return response.text;
  } catch (error) {
    return "সংযোগ বিচ্ছিন্ন। দয়া করে ক্ষতস্থানে চাপ দিন এবং নিকটস্থ হাসপাতালে পৌঁছানোর চেষ্টা করুন।";
  }
};

export const predictMeshReliability = async (connectivityData: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Predict mesh network reliability score.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reliabilityScore: { type: Type.NUMBER },
            optimizationTip: { type: Type.STRING }
          },
          required: ["reliabilityScore", "optimizationTip"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return { reliabilityScore: 75, optimizationTip: "অন্যান্য ব্যবহারকারীদের কাছাকাছি থাকুন।" };
  }
};
