import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/hello"
        );

        setMessage(response.data.message);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMessage();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>InterviewAce AI</h1>
      <h2>Backend Response</h2>
      <p>{message}</p>
    </div>
  );
}

export default App;