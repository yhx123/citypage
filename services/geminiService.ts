
import { GoogleGenAI } from "@google/genai";
import { CityInfo } from "../types";

export const searchCity = async (query: string): Promise<CityInfo> => {
  // 始终使用 process.env.API_KEY 初始化
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const response = await ai.models.generateContent({
    // 关键修复：必须使用 gemini-2.5 系列模型以支持 googleMaps 工具
    model: 'gemini-2.5-flash',
    contents: `Find precise geographic information for: "${query}". 
    Return a valid JSON object with the following fields: 
    "name" (city name), 
    "country" (country name), 
    "lat" (latitude as number), 
    "lng" (longitude as number), 
    "description" (poetic description, max 15 words), 
    "accentColor" (representative hex color).`,
    config: {
      tools: [{ googleMaps: {} }],
      // 注意：使用 googleMaps 时不能设置 responseMimeType 或 responseSchema
    }
  });

  const text = response.text || '';
  let cityData: any;
  
  try {
    // 由于不能使用 responseSchema，我们需要从文本中手动提取 JSON 块
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;
    cityData = JSON.parse(jsonStr);
  } catch (e) {
    console.error("JSON Parsing Error:", text);
    throw new Error("模型返回的数据格式不正确，请稍后再试。");
  }

  // 提取地图数据来源链接（强制性要求）
  const sourceUrls: string[] = [];
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (groundingChunks) {
    for (const chunk of groundingChunks) {
      if (chunk.maps?.uri) sourceUrls.push(chunk.maps.uri);
      if (chunk.web?.uri) sourceUrls.push(chunk.web.uri);
    }
  }

  return {
    name: cityData.name || 'Unknown',
    country: cityData.country || '',
    lat: typeof cityData.lat === 'number' ? cityData.lat : 0,
    lng: typeof cityData.lng === 'number' ? cityData.lng : 0,
    description: cityData.description || '',
    accentColor: cityData.accentColor || '#ffffff',
    sourceUrls: sourceUrls.length > 0 ? Array.from(new Set(sourceUrls)) : undefined
  };
};
