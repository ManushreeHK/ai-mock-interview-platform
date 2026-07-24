import { useEffect } from "react";
import { getSession } from "../services/auth";

function Dashboard() {
  useEffect(() => {
    async function loadSession() {
      const session = await getSession();

      console.log("SESSION", session);
    }

    loadSession();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-5xl font-bold">
        🎉 Login Successful
      </h1>
    </div>
  );
}

export default Dashboard;