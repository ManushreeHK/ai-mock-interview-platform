import { useEffect, useState } from "react";
import { fetchInterviewHistory } from "../services/interviewHistory";
import type { InterviewHistoryItem } from "../types/interview-history";
import {
  calculateDashboardMetrics,
  type DashboardMetrics,
} from "../utils/dashboardMetrics";

type InterviewMetricsState = {
  metrics: DashboardMetrics | null;
  isLoading: boolean;
  error: string;
  history: InterviewHistoryItem[];
};

export function useInterviewMetrics(): InterviewMetricsState {
  const [state, setState] = useState<InterviewMetricsState>({
    metrics: null,
    isLoading: true,
    error: "",
    history: [],
  });

  useEffect(() => {
    let active = true;

    fetchInterviewHistory()
      .then((history) => {
        if (active) {
          setState({
            metrics: calculateDashboardMetrics(history),
            isLoading: false,
            error: "",
            history,
          });
        }
      })
      .catch(() => {
        if (active) {
          setState({
            metrics: null,
            isLoading: false,
            error: "Metrics are temporarily unavailable.",
            history: [],
          });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
