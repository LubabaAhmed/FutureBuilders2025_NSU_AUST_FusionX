
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
      contents: `The user reports: "${symptoms}". 
      1. Provide a professional clinical assessment based on these symptoms.
      2. Respond with deep empathy and professional respect.
      3. Use precise medical terminology in Bangla where appropriate, but keep instructions simple.
      4. Use structured, point-wise professional advice.
      5. Explicitly state the level of urgency (Emergency vs. Home Care).`,
      config: {
        systemInstruction: "আপনি 'ডাক্তার আছে? এআই' (Doctor Ache? AI)। আপনি একজন অত্যন্ত দক্ষ এবং পেশাদার মেডিকেল কনসালট্যান্ট। আপনার কথা বলার ধরণ হবে মার্জিত, পেশাদার এবং গভীর সহমর্মিতাপূর্ণ। আপনি সর্বদা ইউজারের অসুস্থতাকে গুরুত্ব দেবেন এবং বৈজ্ঞানিক দৃষ্টিভঙ্গি থেকে সঠিক ও সুশৃঙ্খল পরামর্শ দেবেন। অপ্রয়োজনীয় আবেগ পরিহার করে বাস্তবসম্মত এবং কার্যকর সমাধান দিন।"
      }
    });
    return response.text;
  } catch (error) {
    return "দুঃখিত, বর্তমানে টেকনিক্যাল সমস্যার কারণে আমি বিস্তারিত পরামর্শ দিতে পারছি না। অনুগ্রহ করে শান্ত থাকুন এবং গুরুতর সমস্যায় নিকটস্থ জরুরি বিভাগে যোগাযোগ করুন। আপনার সুস্বাস্থ্য আমাদের কাম্য।";
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
