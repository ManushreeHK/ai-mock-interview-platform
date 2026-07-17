import { Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPages/LandingPages";
import CreateInterviewPage from "../pages/CreateInterview/CreateInterviewPage";
import InterviewPage from "../pages/Interview/InterviewPage";
import ResultsPage from "../pages/Results/ResultsPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/create-interview"
        element={<CreateInterviewPage />}
      />
      <Route
        path="/interview"
        element={<InterviewPage />}
      />
      <Route
        path="/results"
        element={<ResultsPage />}
      />
    </Routes>
  );
}

export default AppRoutes;