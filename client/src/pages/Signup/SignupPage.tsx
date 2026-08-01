import { useState } from "react";
import { register } from "../../services/auth";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import GoogleSignInButton from "../../components/auth/GoogleSignInButton";


function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    try {
      await register(name,email, password);
      navigate("/verify", {
  state: {
    email,
  },
});
    } catch (err) {
      console.error(err);
      alert("Signup failed");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-slate-950">
      <form
        onSubmit={handleSignup}
        className="w-96 rounded-xl bg-white p-8 shadow-lg"
      >
        <h1 className="mb-6 text-center text-3xl font-bold">
          Create Account
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
  placeholder="Full Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

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
          Create Account
        </Button>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
