import { GoogleGenAI } from "@google/genai";

export async function generateInterviewQuestions(prompt: string) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });

 const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      const text = response.text ?? "";

      return text
        .split("\n")
        .map((line) => line.replace(/^\d+\.\s*/, "").trim())
        .filter(Boolean);
    } catch (error: any) {
      const status = error?.status;

      // Don't retry quota errors
      if (status === 429) {
        throw new Error("Gemini API quota exceeded.");
      }

      // Retry temporary overloads
      if (status === 503 && attempt < MAX_RETRIES) {
        const delay = 1000 * Math.pow(2, attempt - 1); // 1s, 2s, 4s
        console.log(`Gemini busy. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      throw error;
    }
  }
}

export async function evaluateInterviewAnswers(data: {
  role: string;
  experience: string;
  questions: string[];
  answers: string[];
}) {
  const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});
  const prompt = `
You are an expert technical interviewer.

Evaluate the candidate based on the following interview.

Role: ${data.role}
Experience: ${data.experience}

Questions and Answers:

${data.questions
  .map(
    (q, index) => `
Question ${index + 1}: ${q}

Answer:
${data.answers[index] || "No answer provided"}
`
  )
  .join("\n")}

Return ONLY valid JSON in this format:

{
  "overallScore": number,
  "communication": number,
  "technicalKnowledge": number,
  "confidence": number,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "questionEvaluation": [
    {
      "question": "...",
      "score": number,
      "feedback": "..."
    }
  ]
}
`;

 const response = await ai.models.generateContent({
 model: "gemini-3.5-flash",
  contents: prompt,
});

  return response.text;
}