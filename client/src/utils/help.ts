export const faqItems = [
  { id: "how-it-works", question: "How does InterviewAce AI work?", answer: "Choose interview details, answer AI-generated questions, and receive a scored evaluation that is saved to your private history." },
  { id: "types", question: "What interview types are supported?", answer: "The current interview form supports technical and general behavioral selections. Coding interviews are not implemented yet." },
  { id: "availability", question: "Why can Gemini occasionally be unavailable?", answer: "The AI provider can experience high demand or transient service errors. InterviewAce AI uses bounded retries and a fallback model, but availability cannot be guaranteed." },
  { id: "privacy", question: "Is interview data private?", answer: "History reads use your verified Cognito identity, and the API queries only your DynamoDB partition. Other users cannot request your records." },
  { id: "microphone", question: "How do I enable microphone access?", answer: "Allow microphone access in your browser's site settings for the exact InterviewAce AI domain, then reload the interview page." },
  { id: "browser-voice", question: "Why does voice recognition behave differently across browsers?", answer: "Voice input uses the browser Web Speech API. Browser support, recognition quality, and permission handling vary; typed answers remain available." },
  { id: "history", question: "How do I view previous interviews?", answer: "Open Interview History from the sidebar or profile menu, then choose View Results on a completed interview." },
  { id: "paid", question: "Are paid plans available?", answer: "No. InterviewAce AI is unlimited during beta, and Pro and Premium are presentation-only Coming Soon plans." },
] as const;

export function toggleFaq(currentId: string | null, selectedId: string) {
  return currentId === selectedId ? null : selectedId;
}
