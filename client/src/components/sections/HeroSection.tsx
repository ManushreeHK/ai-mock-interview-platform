import { useNavigate } from "react-router-dom"; 
function HeroSection() {
const navigate = useNavigate();
  return (
    <section className="bg-gray-50">
      <div className="mx-auto flex min-h-[80vh] max-w-7xl items-center justify-between px-6 py-16">
        
        {/* Left Content */}
        <div className="max-w-2xl">
          <p className="mb-4 text-lg font-semibold text-blue-600">
            🚀 AI-Powered Mock Interview Platform
          </p>

          <h1 className="mb-6 text-5xl font-bold leading-tight text-gray-900">
            Master Your Next
            <span className="text-blue-600"> Technical Interview with AI</span>
          </h1>

          <p className="mb-8 text-lg leading-8 text-gray-600">
            Practice personalized AI-powered mock interviews based on your
            role, experience, programming language, domain, and resume.
            Improve your confidence before your real interview.
          </p>

          <div className="flex gap-4">
            <button className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700" onClick={() => navigate("/create-interview")}>
              Start Interview
            </button>

            <button className="rounded-lg border border-gray-300 px-6 py-3 font-semibold transition hover:bg-gray-100">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="hidden lg:flex h-96 w-96 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-200 shadow-xl">
          <div className="text-center">
            <div className="mb-4 text-6xl">🤖</div>
            <h2 className="text-2xl font-bold text-gray-800">
              AI Interview
            </h2>
            <p className="mt-2 text-gray-600">
              Illustration Placeholder
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default HeroSection;