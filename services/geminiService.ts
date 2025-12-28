
import { GoogleGenAI, Type } from "@google/genai";

// Corrected initialization using process.env.API_KEY directly as required
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
    return { priority: 'high', reasoning: 'জরুরি প্রটোকল সক্রিয় করা হয়েছে।' };
  }
};

export const getAIDoctorAdvice = async (symptoms: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User reports: "${symptoms}". Provide immediate first aid steps in Bangla.`,
      config: {
        systemInstruction: "আপনি একজন পেশাদার মেডিকেল সহকারী। আপনার উত্তর হবে সহানুভূতিশীল এবং পয়েন্ট আকারে।"
      }
    });
    return response.text;
  } catch (error) {
    return "সংযোগ বিচ্ছিন্ন। ক্ষতস্থানে চাপ দিন এবং নিকটস্থ হাসপাতালে যান।";
  }
};

export const getAIMentalSupport = async (input: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User is distressed: "${input}". Provide calming, empathetic support in Bangla. Focus on stress reduction.`,
      config: {
        systemInstruction: "আপনি একজন ট্রমা-ইনফর্মড কাউন্সিলর। দুর্যোগের সময় মানুষের মানসিক চাপ কমাতে সাহায্য করুন। আপনার ভাষা হবে অত্যন্ত শান্ত এবং আশ্বাসদায়ক।"
      }
    });
    return response.text;
  } catch (error) {
    return "ধীরগতিতে শ্বাস নিন। আপনি একা নন, আমরা আপনার পাশে আছি।";
  }
};

export const predictMeshReliability = async (connectivityData: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Predict mesh reliability score.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: { reliabilityScore: { type: Type.NUMBER }, optimizationTip: { type: Type.STRING } },
          required: ["reliabilityScore", "optimizationTip"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return { reliabilityScore: 75, optimizationTip: "অন্যদের কাছাকাছি থাকুন।" };
  }
};
