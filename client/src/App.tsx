import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import LandingPage from "./pages/LandingPages/LandingPages";
import CreateInterviewPage from "./pages/CreateInterview/CreateInterviewPage";
import InterviewPage from "./pages/Interview/InterviewPage";
import ResultsPage from "./pages/Results/ResultsPage";
import PublicLayout from "./components/layout/PublicLayout"
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
<Routes>
  {/* Public Pages */}
  <Route element={<PublicLayout />}>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/verify" element={<VerifyEmail />} />
  </Route>

  {/* Authenticated Pages */}
  <Route element={<AppLayout />}>
  <Route
    path="/dashboard"
    element={<Dashboard />}
  />
    <Route
      path="/create-interview"
      element={<CreateInterviewPage />}
    />
    <Route
      path="/results"
      element={<ResultsPage />}
    />
  </Route>

  {/* Interview Page - No Navbar */}
  <Route
    path="/interview"
    element={<InterviewPage />}
  />
</Routes>
  );
}

export default App;