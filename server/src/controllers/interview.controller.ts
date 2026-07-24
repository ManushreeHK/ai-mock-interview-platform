import { Request, Response } from "express";
import {
  generateInterviewQuestions,
  evaluateInterviewAnswers,
} from "../services/gemini.service.js";

export const generateInterview = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      role,
      experience,
      difficulty,
      domain,
      language,
      position,
    } = req.body;

    const prompt = `
Generate 10 interview questions.

Role: ${role}
Experience: ${experience}
Difficulty: ${difficulty}
Domain: ${domain}
Programming Language: ${language}
Position: ${position}

Return only the questions as a numbered list.
`;

    const result = await generateInterviewQuestions(prompt);

    res.status(200).json({
      success: true,
      questions: result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to generate interview.",
    });
  }
};

export const evaluateInterview = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      role,
      experience,
      questions,
      answers,
    } = req.body;

    const result = await evaluateInterviewAnswers({
      role,
      experience,
      questions,
      answers,
    });

    res.status(200).json({
      success: true,
      evaluation: result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to evaluate interview.",
    });
  }
};