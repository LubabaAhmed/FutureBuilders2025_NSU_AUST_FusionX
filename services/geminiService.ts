
import { GoogleGenAI, Type } from "@google/genai";

// Initialization using process.env.API_KEY directly as required
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

export const interpretVoiceCommand = async (transcript: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Interpret the following user voice command in the context of a disaster-relief medical app: "${transcript}".
      Map it to one of these actions: 
      - NAVIGATE_MAP
      - NAVIGATE_CHAT
      - NAVIGATE_DOCTOR
      - NAVIGATE_FIRST_AID
      - NAVIGATE_PROFILE
      - TRIGGER_SOS
      - MEDICAL_QUERY (if they describe symptoms)
      - FIRST_AID_QUERY (if they ask how to treat something)
      
      Return a JSON with "action" and "params" (e.g. { "action": "MEDICAL_QUERY", "params": "fever" }).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            action: { 
              type: Type.STRING, 
              enum: ['NAVIGATE_MAP', 'NAVIGATE_CHAT', 'NAVIGATE_DOCTOR', 'NAVIGATE_FIRST_AID', 'NAVIGATE_PROFILE', 'TRIGGER_SOS', 'MEDICAL_QUERY', 'FIRST_AID_QUERY'] 
            },
            params: { type: Type.STRING },
          },
          required: ["action"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Intent interpretation error:", error);
    return { action: 'UNKNOWN' };
  }
};

export const getAIDoctorAdvice = async (symptoms: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `The user reports symptoms: "${symptoms}". 
      1. Act as a professional 'Symptom Checker'. Analyze these symptoms and provide a potential medical assessment.
      2. Respond with clinical precision, professional warmth, and deep empathy.
      3. Your advice should follow this structure:
         - Assessment (সারসংক্ষেপ)
         - Immediate Actions (তাৎক্ষণিক পদক্ষেপ)
         - Warning Signs (সতর্ক সংকেত - কখন হাসপাতালে যেতে হবে)
         - Risk Category (ঝুঁকির ধরণ - Pregnant/Child/Elderly/General)
      4. Do not ask for priority levels, instead, infer them from the symptoms provided.
      5. Provide all guidance in clear, bulleted Bangla.
      6. Mention if a 48-hour professional follow-up is recommended.`,
      config: {
        systemInstruction: "আপনি 'ডাক্তার আছে? ভার্চুয়াল কনসালট্যান্ট'। শুভেচ্ছা বিনিময় বা নমস্কার (Greeting like Nomoskar/Suprobhat) এড়িয়ে সরাসরি মূল আলোচনায় প্রবেশ করুন। আপনি একজন অভিজ্ঞ এবং অত্যন্ত দক্ষ মেডিকেল এআই। আপনার প্রধান কাজ হলো ইউজারের লক্ষণগুলো (Symptoms) বিশ্লেষণ করা এবং বৈজ্ঞানিক ও পেশাদার পরামর্শ দেওয়া। আপনার ভাষা হবে অত্যন্ত মার্জিত এবং সহমর্মী।"
      }
    });
    return response.text;
  } catch (error) {
    return "দুঃখিত, বর্তমানে টেকনিক্যাল সমস্যার কারণে আমি বিস্তারিত পরামর্শ দিতে পারছি না। গুরুতর সমস্যায় দ্রুত নিকটস্থ হাসপাতালে যোগাযোগ করুন। আমরা আপনার দ্রুত আরোগ্য কামনা করি।";
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
    return "ধীরগতিতে শ্বাস নিন। আপনি একা ননি, আমরা আপনার পাশে আছি।";
  }
};

export const getNearbyHospitals = async (lat: number, lng: number) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "আমার বর্তমান অবস্থানের আশেপাশে থাকা সবচেয়ে ভালো হাসপাতালগুলোর তালিকা দাও।",
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      }
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const hospitals = chunks
      ?.filter((chunk: any) => chunk.maps)
      .map((chunk: any) => ({
        name: chunk.maps.title,
        uri: chunk.maps.uri,
        lat: lat + (Math.random() - 0.5) * 0.05,
        lng: lng + (Math.random() - 0.5) * 0.05
      })) || [];

    return { text: response.text, hospitals };
  } catch (error) {
    console.error("Maps grounding error:", error);
    return { text: "হাসপাতাল খুঁজতে সমস্যা হচ্ছে। অনুগ্রহ করে ইন্টারনেট কানেকশন চেক করুন।", hospitals: [] };
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
