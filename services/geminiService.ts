
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
      contents: `User reports these symptoms: "${symptoms}". 
      Task:
      1. Perform a clinical assessment based on the provided symptoms.
      2. Respond in a strictly professional, clinical, and formal Bangla tone.
      3. Structure advice using clear bullet points.
      4. Categorize triage urgency: (Critical Emergency / Prompt Medical Consultation / Routine Management).
      5. Include specific first aid or diagnostic steps.
      6. Eliminate all empathetic filler or conversational reassurance.`,
      config: {
        systemInstruction: "আপনি 'ডাক্তার আছে? এআই' (Doctor Ache? AI)। আপনি একজন বিশেষজ্ঞ মেডিকেল কনসালট্যান্ট এআই। আপনার ভাষা হবে অত্যন্ত পেশাদার, সুশৃঙ্খল এবং তথ্যভিত্তিক। আপনি কোনো প্রকার ব্যক্তিগত আবেগ বা সহমর্মিতা প্রকাশ করবেন না। আপনার উত্তরগুলো হবে সংক্ষিপ্ত এবং ক্লিনিক্যাল প্রটোকল অনুযায়ী সঠিক। জরুরি অবস্থায় সরাসরি হাসপাতালের সাহায্য নিতে নির্দেশ দিন।"
      }
    });
    return response.text;
  } catch (error) {
    return "সিস্টেম ত্রুটি। বিস্তারিত পরামর্শ প্রদান করা সম্ভব হচ্ছে না। জরুরি সমস্যায় সরাসরি নিকটস্থ হাসপাতালে যোগাযোগ করুন।";
  }
};

export const getAIMentalSupport = async (input: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User distress input: "${input}". Provide clinical stress management protocol in Bangla.`,
      config: {
        systemInstruction: "আপনি একজন ক্লিনিক্যাল সাইকোলজিস্ট। দুর্যোগের সময় মানুষের মানসিক অবস্থা স্থিতিশীল রাখতে বৈজ্ঞানিক গাইডলাইন প্রদান করুন। ভাষা হবে পেশাদার এবং নির্দেশনামূলক।"
      }
    });
    return response.text;
  } catch (error) {
    return "গভীর শ্বাস নিন। ক্লিনিক্যাল প্রটোকল অনুসরণ করুন।";
  }
};

export const predictMeshReliability = async (connectivityData: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Analyze mesh node density and predict reliability score.",
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
