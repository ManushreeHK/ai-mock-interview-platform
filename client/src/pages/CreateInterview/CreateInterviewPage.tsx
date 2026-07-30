import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import FileUpload from "../../components/ui/FileUpload";
import Button from "../../components/ui/Button";
import api from "../../services/api";
import InterviewType from "../../components/InterviewType";
import { Sparkles } from "lucide-react";

function CreateInterviewPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    difficulty: "",
    domain: "",
    language: "",
    position: "",
    resume: null as File | null,
  });

  const [errors, setErrors] = useState({
    role: "",
    experience: "",
    difficulty: "",
    domain: "",
    language: "",
    position: "",
    resume: "",
  });

  const [loading, setLoading] = useState(false);

  const roles = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "DevOps Engineer",
    "QA Engineer",
    "Data Engineer",
  ];

  const experiences = [
    "0-1 Years",
    "1-3 Years",
    "3-5 Years",
    "5-8 Years",
    "8+ Years",
  ];

  const difficulties = ["Easy", "Medium", "Hard"];
  const [interviewType, setInterviewType] = useState("technical");

  const domains = [
    "Web Development",
    "Mobile Development",
    "Cloud Computing",
    "Artificial Intelligence",
    "Data Science",
    "Cyber Security",
  ];

  const languages = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Java",
    "Python",
    "C#",
    "Go",
  ];

  const handleSelectChange = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleResumeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      resume: e.target.files?.[0] || null,
    }));

    setErrors((prev) => ({
      ...prev,
      resume: "",
    }));
  };

  const handleSubmit = async () => {
    const newErrors = {
      role: "",
      experience: "",
      difficulty: "",
      domain: "",
      language: "",
      position: "",
      resume: "",
    };

    if (!formData.role)
      newErrors.role = "Please select a role.";

    if (!formData.experience)
      newErrors.experience = "Please select experience.";

    if (!formData.difficulty)
      newErrors.difficulty = "Please select difficulty.";

    if (interviewType !== "behavioral") {
      if (!formData.domain)
        newErrors.domain = "Please select domain.";

      if (!formData.language)
        newErrors.language = "Please select programming language.";
    }

    if (!formData.position.trim())
      newErrors.position = "Position is required.";

    if (!formData.resume)
      newErrors.resume = "Please upload your resume.";

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(
      (error) => error !== ""
    );

    if (hasErrors) return;

    try {
      setLoading(true);

      const response = await api.post("/interview/generate", {
        role: formData.role,
        experience: formData.experience,
        difficulty: formData.difficulty,
        domain: formData.domain,
        language: formData.language,
        position: formData.position,
      });

      console.log("Response:", response.data);

      navigate("/interview", {
        state: {
          questions: response.data.questions,
          interviewDetails: {
            ...formData,
            interviewType,
          },
        },
      });

    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="space-y-8">

    {/* Page Header */}
<div className="mb-8">
  <div className="flex items-center gap-3">
    <Sparkles className="h-7 w-7 text-blue-600" />

    <h1 className="text-3xl font-bold text-gray-900">
      Create Your AI Interview
    </h1>
  </div>
</div>

    {/* Interview Type */}
    <InterviewType
      value={interviewType}
      onChange={setInterviewType}
    />

    {/* Main Layout */}
    <div className="grid gap-8 xl:grid-cols-3">

      {/* Left Side */}
      <div className="xl:col-span-2 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

        <h2 className="mb-8 text-2xl font-bold text-slate-900">
          Interview Details
        </h2>

        <div className="grid gap-6">

          <Select
            label="Role"
            options={roles}
            value={formData.role}
            error={errors.role}
            onChange={(e) =>
              handleSelectChange("role", e.target.value)
            }
          />

          {/* Experience */}

          <div>
            <label className="mb-3 block font-medium">
              Experience
            </label>

            <div className="flex flex-wrap gap-3">
              {experiences.map((exp) => (
                <button
                  key={exp}
                  type="button"
                  onClick={() =>
                    handleSelectChange("experience", exp)
                  }
                  className={`rounded-xl border px-4 py-2 transition ${
                    formData.experience === exp
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-300 hover:border-blue-300"
                  }`}
                >
                  {exp}
                </button>
              ))}
            </div>

            {errors.experience && (
              <p className="mt-2 text-sm text-red-500">
                {errors.experience}
              </p>
            )}
          </div>

          {/* Difficulty */}

          <div>
            <label className="mb-3 block font-medium">
              Difficulty
            </label>

            <div className="flex gap-3">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty}
                  type="button"
                  onClick={() =>
                    handleSelectChange(
                      "difficulty",
                      difficulty
                    )
                  }
                  className={`rounded-xl border px-4 py-2 transition ${
                    formData.difficulty === difficulty
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-300 hover:border-blue-300"
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>

            {errors.difficulty && (
              <p className="mt-2 text-sm text-red-500">
                {errors.difficulty}
              </p>
            )}
          </div>

          {interviewType !== "behavioral" && (
            <>
              <Select
                label="Domain"
                options={domains}
                value={formData.domain}
                error={errors.domain}
                onChange={(e) =>
                  handleSelectChange(
                    "domain",
                    e.target.value
                  )
                }
              />

              <Select
                label="Programming Language"
                options={languages}
                value={formData.language}
                error={errors.language}
                onChange={(e) =>
                  handleSelectChange(
                    "language",
                    e.target.value
                  )
                }
              />
            </>
          )}

          <Input
            label="Target Position"
            placeholder="Senior Frontend Developer"
            value={formData.position}
            error={errors.position}
            onChange={(e) =>
              handleSelectChange(
                "position",
                e.target.value
              )
            }
          />

          <FileUpload
            label="Resume"
            error={errors.resume}
            onChange={handleResumeChange}
          />

          <Button
            size="lg"
            fullWidth
            isLoading={loading}
            onClick={handleSubmit}
            className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
          >
            ✨ Start AI Interview →
          </Button>

        </div>
      </div>

      {/* Right Side */}

      <div className="sticky top-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="text-xl font-bold">
          Interview Summary
        </h2>

        <div className="mt-6 space-y-4">

          <SummaryRow
            label="Interview"
            value={interviewType}
          />

          <SummaryRow
            label="Role"
            value={formData.role || "-"}
          />

          <SummaryRow
            label="Experience"
            value={formData.experience || "-"}
          />

          <SummaryRow
            label="Difficulty"
            value={formData.difficulty || "-"}
          />

          <SummaryRow
            label="Language"
            value={formData.language || "-"}
          />

        </div>

        <div className="mt-8 rounded-2xl bg-blue-50 p-5">

          <p className="text-sm text-slate-500">
            Estimated Duration
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            20 mins
          </p>

        </div>

      </div>

    </div>

  </div>
);
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between border-b border-slate-100 pb-3">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold capitalize">
        {value}
      </span>
    </div>
  );
}

export default CreateInterviewPage;
