
import { GoogleGenAI, Type } from "@google/genai";
import { StockItem, Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const askKitchenAssistant = async (
  query: string,
  currentStock: StockItem[],
  recentTransactions: Transaction[]
) => {
  try {
    // Optimization for 9000+ rows: Only send items that match the user query loosely or are critical
    const filteredContext = currentStock.filter(item => 
      query.toLowerCase().split(' ').some(word => item.name.toLowerCase().includes(word)) || 
      item.quantity <= item.minThreshold
    ).slice(0, 50);

    const context = `
      You are the "Administrative Assistant" for the Rajbhavan Kitchen.
      
      LANGUAGE RULE: Respond ONLY in Hindi (हिंदी).
      
      Inventory Data (Subset of relevant items): ${JSON.stringify(filteredContext)}
      Recent Activity: ${JSON.stringify(recentTransactions.slice(0, 10))}
      
      Instructions:
      1. Use a formal, bureaucratic Hindi tone.
      2. Refer to current quantities and units.
      3. Items below "minThreshold" are urgent priorities.
      4. If user asks for an item not in this context, politely explain you only have visibility over current records.
      
      User Query: "${query}"
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: context,
    });

    return response.text || "क्षमा करें, इस प्रश्न के लिए कोई डेटा नहीं मिला।";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "सिस्टम वर्तमान में AI प्रश्नों को प्रोसेस करने में असमर्थ है।";
  }
};

export const getIntelligenceTips = async (relevantItems: StockItem[]) => {
  try {
    // Only send a concise version of critical items to Gemini
    const conciseStock = relevantItems.map(i => ({ n: i.name, q: i.quantity, t: i.minThreshold, u: i.unit }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Examine this subset of critical Rajbhavan items: ${JSON.stringify(conciseStock)}. 
      Provide 3 formal bureaucratic tips in Hindi.
      1. Alert for low stock.
      2. Procure timing advice.
      3. Seasonal kitchen efficiency.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['WARNING', 'INFO', 'SUCCESS'] }
            },
            required: ['title', 'description', 'type']
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    return [
      { title: "नियमित ऑडिट आवश्यक", description: "स्टॉक स्तरों की मैन्युअल जांच सुनिश्चित करें।", type: "INFO" },
      { title: "आपूर्ति की निगरानी", description: "मुख्य वस्तुओं की आगामी मांग पर ध्यान दें।", type: "INFO" }
    ];
  }
};
