import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login/LoginPage";
import Signup from "./pages/Signup/SignupPage";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmailPage";
import LandingPage from "./pages/Landing/LandingPage";
import CreateInterviewPage from "./pages/CreateInterview/CreateInterviewPage";
import InterviewPage from "./pages/Interview/InterviewPage";
import ResultsPage from "./pages/Results/ResultsPage";
import PublicLayout from "./components/layout/PublicLayout"
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard/DashboardPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import SettingsPage from "./pages/Settings/SettingsPage";
import SubscriptionPage from "./pages/Subscription/SubscriptionPage";
import HelpPage from "./pages/Help/HelpPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import ProtectedAppErrorBoundary from "./components/routes/ProtectedAppErrorBoundary";

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
  <Route
    element={
      <ProtectedAppErrorBoundary>
        <AppLayout />
      </ProtectedAppErrorBoundary>
    }
  >
 <Route
    path="/dashboard"
    element={
        <ProtectedRoute>
            <Dashboard />
        </ProtectedRoute>
    }
/>
    <Route
      path="/create-interview"
      element={
        <ProtectedRoute>

      <CreateInterviewPage />
        </ProtectedRoute>
    }
    />
    <Route
      path="/results"
      element={
        <ProtectedRoute>

      <ResultsPage />
        </ProtectedRoute>}
    />
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/settings"
      element={
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/subscription"
      element={
        <ProtectedRoute>
          <SubscriptionPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/help"
      element={
        <ProtectedRoute>
          <HelpPage />
        </ProtectedRoute>
      }
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
