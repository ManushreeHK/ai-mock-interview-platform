import dotenv from "dotenv";
dotenv.config();
const key = process.env.GEMINI_API_KEY;

console.log(
  "Gemini Key Loaded:",
  key ? `${key.substring(0, 4)}...` : "Not Found"
);

import app from "./app.js";

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});