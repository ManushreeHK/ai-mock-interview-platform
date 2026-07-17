import dotenv from "dotenv";
dotenv.config();
console.log("Gemini Key:", process.env.GEMINI_API_KEY);

import app from "./app.js";

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});