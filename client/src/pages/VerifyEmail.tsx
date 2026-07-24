import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyEmail } from "../services/auth";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  console.log("Email:", email);
console.log("Location state:", location.state);

  const [code, setCode] = useState("");

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();

    try {
      await verifyEmail(email, code);

      alert("Email verified successfully!");

      navigate("/");
    } catch (err: unknown) {
  console.error(err);

  if (err instanceof Error) {
    alert(err.message);
  } else {
    alert("Verification failed");
  }
}
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleVerify}
        className="w-96 rounded-xl bg-white p-8 shadow-lg"
      >
        <h1 className="mb-6 text-center text-3xl font-bold">
          Verify Email
        </h1>

        <p className="mb-4 text-center text-gray-500">
          Enter the verification code sent to:
        </p>

        <p className="mb-6 text-center font-semibold">
          {email}
        </p>

        <input
          className="mb-6 w-full rounded border p-3"
          placeholder="Verification Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button className="w-full rounded bg-blue-600 py-3 text-white">
          Verify
        </button>
      </form>
    </div>
  );
}

export default VerifyEmail;