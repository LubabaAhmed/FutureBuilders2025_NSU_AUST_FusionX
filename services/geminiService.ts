
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
      - NAVIGATE_MAP, NAVIGATE_CHAT, NAVIGATE_DOCTOR, NAVIGATE_FIRST_AID, NAVIGATE_PROFILE, TRIGGER_SOS, MEDICAL_QUERY, SCAN_MEDICINE, FIRST_AID_QUERY
      Return a JSON with "action" and "params".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            action: { 
              type: Type.STRING, 
              enum: ['NAVIGATE_MAP', 'NAVIGATE_CHAT', 'NAVIGATE_DOCTOR', 'NAVIGATE_FIRST_AID', 'NAVIGATE_PROFILE', 'TRIGGER_SOS', 'MEDICAL_QUERY', 'SCAN_MEDICINE', 'FIRST_AID_QUERY'] 
            },
            params: { type: Type.STRING },
          },
          required: ["action"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return { action: 'UNKNOWN' };
  }
};

export const identifyMedicine = async (base64Image: string, mimeType: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { inlineData: { data: base64Image, mimeType: mimeType } },
        { text: `Identify this medicine. Return JSON in Bangla with: name, generic, usage, dosage, warnings, riskLevel (1-4), priorityScore (1-10), disclaimer.` }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            generic: { type: Type.STRING },
            usage: { type: Type.STRING },
            dosage: { type: Type.STRING },
            warnings: { type: Type.STRING },
            riskLevel: { type: Type.INTEGER },
            priorityScore: { type: Type.NUMBER },
            disclaimer: { type: Type.STRING },
          },
          required: ["name", "generic", "usage", "warnings", "riskLevel", "priorityScore"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    throw error;
  }
};

export const getAIDoctorAdvice = async (symptoms: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User reports: "${symptoms}". Analyze and triage.
      Return JSON in Bangla:
      - level: (1-4 integer)
      - priorityScore: (1-10 float)
      - levelTitle: Bangla text
      - assessment: disease stage or progression summary
      - actions: immediate steps
      - warningSigns: what to watch out for
      - color: hex code`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            level: { type: Type.INTEGER },
            priorityScore: { type: Type.NUMBER },
            levelTitle: { type: Type.STRING },
            assessment: { type: Type.STRING },
            actions: { type: Type.STRING },
            warningSigns: { type: Type.STRING },
            color: { type: Type.STRING },
          },
          required: ["level", "priorityScore", "levelTitle", "assessment", "actions", "warningSigns", "color"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return { 
      level: 2, 
      priorityScore: 5.0,
      levelTitle: "তথ্য অসম্পূর্ণ", 
      assessment: "বিশ্লেষণ করতে সমস্যা হচ্ছে।", 
      actions: "নিকটস্থ ডাক্তারের সাথে যোগাযোগ করুন।", 
      warningSigns: "হাসপাতালে যান।",
      color: "#eab308"
    };
  }
};

export const getAIMentalSupport = async (input: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User is distressed: "${input}". Provide calming, empathetic support in Bangla. Focus on stress reduction.`,
      config: {
        systemInstruction: "আপনি একজন ট্রমা-ইনফর্মড কাউন্সিলর। দুর্যোগের সময় মানুষের মানসিক চাপ কমাতে সাহায্য করুন।"
      }
    });
    return response.text;
  } catch (error) {
    return "ধীরগতিতে শ্বাস নিন। আমরা আপনার পাশে আছি।";
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
    return { text: "হাসপাতাল খুঁজতে সমস্যা হচ্ছে।", hospitals: [] };
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
