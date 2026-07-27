import { useState,useEffect } from "react";
import { login, getSession,currentUser } from "../../services/auth";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
  async function checkUser() {
    try {
      const user = await currentUser();
      console.log("Already signed in:", user);

      navigate("/dashboard");
    } catch {
      console.log("No authenticated user");
    }
  }

  checkUser();
}, [navigate]);
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

          <Button fullWidth>
            Login
          </Button>
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