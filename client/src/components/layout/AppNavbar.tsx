import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../services/auth";

function AppNavbar() {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Failed to logout.");
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          to="/dashboard"
          className="text-2xl font-bold text-blue-600"
        >
          InterviewAce AI
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="font-medium text-gray-600 transition hover:text-blue-600"
          >
            Dashboard
          </Link>

          <Link
            to="/create-interview"
            className="font-medium text-gray-600 transition hover:text-blue-600"
          >
            New Interview
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-red-500 px-4 py-2 text-red-500 transition hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default AppNavbar;