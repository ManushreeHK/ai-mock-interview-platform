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

export type ApiErrorShape = {
  error: {
    code: string;
    message: string;
  };
};
