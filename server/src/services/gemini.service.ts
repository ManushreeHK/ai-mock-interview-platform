import { GoogleGenAI } from "@google/genai";

export async function generateInterviewQuestions(prompt: string) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });

const response = await ai.models.generateContent({
  model: "gemini-3.5-flash",
  contents: prompt,
});

  const text = response.text ?? "";

  return text
    .split("\n")
    .map((line) => line.replace(/^\d+\.\s*/, "").trim())
    .filter((line) => line.length > 0);
}