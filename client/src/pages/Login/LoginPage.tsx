import { useState,useEffect } from "react";
import { login } from "../../services/auth";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import GoogleSignInButton from "../../components/auth/GoogleSignInButton";
import { useAuth } from "../../auth/useAuth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { status, refreshAuth } = useAuth();

  useEffect(() => {
    if (status === "authenticated") {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, status]);
async function handleLogin(e: React.FormEvent) {
  e.preventDefault();
  

  try {
    await login(email, password);

    alert("Login Successful!");
    const authenticated = await refreshAuth();

    if (authenticated) {
      navigate("/dashboard", { replace: true });
    }
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8 dark:bg-slate-950">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-96 rounded-xl bg-white p-5 shadow-lg dark:bg-slate-900 sm:p-8"
      >
        <h1 className="mb-6 text-center text-3xl font-bold">
          Login
        </h1>

        <GoogleSignInButton />

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs font-medium text-gray-500">
            Or continue with email
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

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
