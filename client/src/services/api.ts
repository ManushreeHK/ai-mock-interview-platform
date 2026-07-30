import axios from "axios";
import { env } from "../config/env";
import { getSession } from "./auth";

const api = axios.create({
  baseURL: env.apiBaseUrl,
});

api.interceptors.request.use(async (config) => {
  try {
    const session = await getSession();
    const accessToken = session.tokens?.accessToken;

    if (accessToken) {
      config.headers.set(
        "Authorization",
        `Bearer ${accessToken.toString()}`
      );
    } else {
      config.headers.delete("Authorization");
    }
  } catch {
    config.headers.delete("Authorization");
  }

  return config;
});

export default api;
