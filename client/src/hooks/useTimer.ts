import { useEffect, useReducer, useRef } from "react";

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
        timeLeft: Math.max(state.timeLeft - 1, 0),
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

  const callbackRef = useRef(onTimeUp);

  useEffect(() => {
    callbackRef.current = onTimeUp;
  }, [onTimeUp]);

  // Reset timer whenever question changes
  useEffect(() => {
    dispatch({
      type: "RESET",
      payload: duration,
    });
  }, [duration, resetKey]);

  // Countdown
  useEffect(() => {
    if (state.timeLeft === 0) {
      callbackRef.current?.();
      return;
    }

    const timer = window.setTimeout(() => {
      dispatch({
        type: "TICK",
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [state.timeLeft]);

  return {
    minutes: String(Math.floor(state.timeLeft / 60)).padStart(2, "0"),
    seconds: String(state.timeLeft % 60).padStart(2, "0"),
    timeLeft: state.timeLeft,
  };
}