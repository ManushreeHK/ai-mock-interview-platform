export type QuestionEvaluation = {
  question: string;
  score: number;
  feedback: string;
};

export type InterviewEvaluation = {
  overallScore: number;
  communication: number;
  technicalKnowledge: number;
  confidence: number;
  strengths: string[];
  weaknesses: string[];
  questionEvaluation: QuestionEvaluation[];
};

export type InterviewResult = {
  userId: string;
  interviewId: string;
  type: string;
  role: string;
  experience: string;
  difficulty: string;
  language: string;
  questions: string[];
  answers: string[];
  evaluation: InterviewEvaluation;
  status: "completed";
  createdAt: string;
};

export type CreateInterviewResult = Omit<
  InterviewResult,
  "interviewId" | "status" | "createdAt"
>;

export type InterviewHistoryItem = {
  interviewId: string;
  createdAt: string;
  role: string;
  interviewType: string;
  difficulty: string;
  overallScore: number;
  communication: number;
  technicalKnowledge: number;
  confidence: number;
  status: "completed";
};

export type InterviewHistoryPage = {
  items: InterviewHistoryItem[];
  nextToken: string | null;
};
