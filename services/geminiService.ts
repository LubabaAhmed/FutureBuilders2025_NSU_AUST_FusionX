
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIPrioritization = async (details: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this emergency SOS message and categorize it (low, medium, high, critical) with a brief justification: "${details}"`,
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
    return { priority: 'high', reasoning: 'Standard emergency protocol triggered.' };
  }
};

export const getAIDoctorAdvice = async (symptoms: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a medical triage assistant for remote rural regions with limited access to doctors. User reports: "${symptoms}". Provide immediate first aid steps, safety warnings, and whether it requires urgent hospital transport. Keep it concise and formatted for a mobile screen.`,
      config: {
        systemInstruction: "You are a professional medical assistant focusing on rural emergency care."
      }
    });
    return response.text;
  } catch (error) {
    return "Connection low. Please apply pressure to any wounds and stay hydrated. Try to reach the nearest hospital indicated on the map.";
  }
};

export const predictMeshReliability = async (connectivityData: any) => {
  // Mocking AI prediction for message delivery reliability in mesh network
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Predict mesh network message delivery reliability based on user density and signal strength. Return as a percentage.",
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
    return { reliabilityScore: 75, optimizationTip: "Stay within 10 meters of other HillShield users." };
  }
};
