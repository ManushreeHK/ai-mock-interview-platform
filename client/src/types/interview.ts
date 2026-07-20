export interface InterviewAnswer {
  question: string;
  answer: string;
}

export interface InterviewResult {
  interviewDetails: {
    role: string;
    experience: string;
    difficulty: string;
    domain: string;
    language: string;
  };

  answers: InterviewAnswer[];
}