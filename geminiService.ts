import { GoogleGenAI, Type } from "@google/genai";
// FIX: Import WeatherData type
import type { WeatherData } from '../types';

// Safely access the API key to prevent crashes in environments where `process` is not defined.
const API_KEY = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;

// Conditionally initialize the AI client.
let ai: GoogleGenAI | null = null;
if (API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
    // ai remains null, and the app will fall back to mock data.
  }
} else {
  // This is not an error, just a development state without an API key.
  console.warn("API_KEY environment variable not set. Using mock data for weather service.");
}

// FIX: Implement fetchWeather function to get weather data from the Gemini API.
const MOCK_WEATHER_DATA: WeatherData = {
  city: "Indisponível",
  temperature: 20,
  condition: 'Serviço indisponível',
  conditionIcon: '🤷',
};

export const fetchWeather = async (city: string): Promise<WeatherData> => {
  if (!ai) {
    console.warn("GoogleGenAI not initialized. Returning mock weather data.");
    return MOCK_WEATHER_DATA;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Forneça o clima atual para a cidade: ${city}. Responda apenas com o JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            city: { type: Type.STRING },
            temperature: { type: Type.NUMBER, description: "Temperatura em graus Celsius." },
            condition: { type: Type.STRING, description: "Descrição da condição climática em português (ex: Ensolarado, Nublado, Chuvoso)." },
            conditionIcon: { type: Type.STRING, description: "Um único emoji que representa a condição (ex: ☀️, ☁️, 🌧️)." },
          },
          required: ["city", "temperature", "condition", "conditionIcon"],
        },
      },
    });
    
    const jsonString = response.text.trim();
     if (!jsonString) {
        console.error("Gemini API returned an empty response for weather.");
        return MOCK_WEATHER_DATA;
    }
    const weatherData = JSON.parse(jsonString) as WeatherData;
    return weatherData;

  } catch (error) {
    console.error("Failed to fetch weather from Gemini API:", error);
    return MOCK_WEATHER_DATA;
  }
};
