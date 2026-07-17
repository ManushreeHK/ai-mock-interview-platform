export async function generateInterviewQuestions(prompt: string) {
  console.log(prompt); // optional

  return [
    "Tell me about yourself.",
    "Explain Virtual DOM.",
    "What are React Hooks?",
    "Difference between useState and useReducer.",
    "Explain closures.",
    "What is hoisting?",
    "Explain event bubbling.",
    "Explain useEffect.",
    "What is memoization?",
    "Explain React Context API."
  ];
}