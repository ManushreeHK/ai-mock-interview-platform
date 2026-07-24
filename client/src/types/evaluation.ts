export interface QuestionEvaluation {
  question: string;
  score: number;
  feedback: string;
}

export interface Evaluation {
  overallScore: number;
  communication: number;
  technicalKnowledge: number;
  confidence: number;
  strengths: string[];
  weaknesses: string[];
  questionEvaluation: QuestionEvaluation[];
}