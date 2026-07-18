import { useEffect, useReducer } from "react";

type UseTimerProps = {
  duration: number;
  resetKey: number;
  onTimeUp?: () => void;
};

type State = {
  timeLeft: number;
};

type Action =
  | { type: "TICK" }
  | { type: "RESET"; payload: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "TICK":
      return {
        timeLeft: state.timeLeft - 1,
      };

    case "RESET":
      return {
        timeLeft: action.payload,
      };

    default:
      return state;
  }
}

export function useTimer({
  duration,
  resetKey,
  onTimeUp,
}: UseTimerProps) {
  const [state, dispatch] = useReducer(reducer, {
    timeLeft: duration,
  });

  // Reset automatically whenever question changes
  useEffect(() => {
    dispatch({
      type: "RESET",
      payload: duration,
    });
  }, [resetKey, duration]);

  // Countdown
  useEffect(() => {
    if (state.timeLeft <= 0) {
      onTimeUp?.();
      return;
    }

    const timer = setTimeout(() => {
      dispatch({
        type: "TICK",
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [state.timeLeft, onTimeUp]);

  return {
    minutes: String(Math.floor(state.timeLeft / 60)).padStart(2, "0"),
    seconds: String(state.timeLeft % 60).padStart(2, "0"),
  };
}