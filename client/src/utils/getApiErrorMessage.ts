import axios from "axios";

type ApiErrorResponse = {
  error?: {
    code?: string;
    message?: string;
  };
};

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage: string
) {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const message = error.response?.data?.error?.message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return fallbackMessage;
}
