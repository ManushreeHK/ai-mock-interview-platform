import { generateWithFallback } from "./gemini-reliability.js";

export async function generateInterviewQuestions(prompt: string) {
  const { text } = await generateWithFallback(prompt);

  return text
    .split("\n")
    .map((line) => line.replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean);
}

export async function evaluateInterviewAnswers(data: {
  role: string;
  experience: string;
  questions: string[];
  answers: string[];
}) {
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

Every score must be a number between 0 and 10 inclusive.
Never return percentages or scores out of 20 or 100.
Decimals are allowed. The overall score must also be between 0 and 10.

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

  return generateWithFallback(prompt);
}
