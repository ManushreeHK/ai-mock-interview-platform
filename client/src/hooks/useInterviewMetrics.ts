import { useEffect, useState } from "react";
import { fetchInterviewHistory } from "../services/interviewHistory";
import {
  calculateDashboardMetrics,
  type DashboardMetrics,
} from "../utils/dashboardMetrics";

type InterviewMetricsState = {
  metrics: DashboardMetrics | null;
  isLoading: boolean;
  error: string;
};

export function useInterviewMetrics(): InterviewMetricsState {
  const [state, setState] = useState<InterviewMetricsState>({
    metrics: null,
    isLoading: true,
    error: "",
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
          });
        }
      })
      .catch(() => {
        if (active) {
          setState({
            metrics: null,
            isLoading: false,
            error: "Metrics are temporarily unavailable.",
          });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
