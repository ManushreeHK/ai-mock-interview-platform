import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { currentUser, logout } from "../../services/auth";
function PublicNavbar(){
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

useEffect(() => {
  async function checkUser() {
    try {
      await currentUser();
      setLoggedIn(true);
    } catch {
      setLoggedIn(false);
    }
  }

  checkUser();
}, []);

async function handleLogout() {
  await logout();
  setLoggedIn(false);
  navigate("/");
}

function handleStartInterview() {
  if (loggedIn) {
    navigate("/create-interview");
  } else {
    navigate("/login");
  }
}
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-blue-600">
          InterviewAce AI
        </h1>

<div className="flex items-center gap-6">

  <a href="#features" className="font-medium text-gray-600 hover:text-blue-600">
    Features
  </a>

  <a href="#how-it-works" className="font-medium text-gray-600 hover:text-blue-600">
    How it Works
  </a>

  <a href="#about" className="font-medium text-gray-600 hover:text-blue-600">
    About
  </a>

  {!loggedIn ? (
    <>
      <Link
        to="/login"
        className="font-medium text-gray-600 hover:text-blue-600"
      >
        Login
      </Link>

      <Link
        to="/signup"
        className="rounded-lg border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50"
      >
        Get Started
      </Link>
    </>
  ) : (
    <>
      <Link
        to="/dashboard"
        className="font-medium text-gray-600 hover:text-blue-600"
      >
        Dashboard
      </Link>

      <button
        onClick={handleLogout}
        className="rounded-lg border border-red-500 px-4 py-2 text-red-500 hover:bg-red-50"
      >
        Logout
      </button>
    </>
  )}

  <button
    onClick={handleStartInterview}
    className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
  >
    Start Interview
  </button>

</div>
      </div>
    </nav>
  );
}

export default PublicNavbar;
