import { useState } from "react";
import { login, getSession } from "../services/auth";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

async function handleLogin(e: React.FormEvent) {
  e.preventDefault();
  

  try {
    await login(email, password);

    alert("Login Successful!");
    const session = await getSession();

console.log(session);

    navigate("/dashboard");
  } catch (err: unknown) {
    console.error(err);

    if (err instanceof Error) {
      alert(err.message);
    } else {
      alert("Login failed");
    }
  }
}

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="w-96 rounded-xl bg-white p-8 shadow-lg"
      >
        <h1 className="mb-6 text-center text-3xl font-bold">
          Login
        </h1>

        <input
          className="mb-4 w-full rounded border p-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="mb-6 w-full rounded border p-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full rounded bg-blue-600 py-3 text-white"
        >
          Login
        </button>
            <p className="mt-4 text-center">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-600">
                    Create Account
                </Link>
            </p>
      </form>
    </div>
  );
}

export default Login;