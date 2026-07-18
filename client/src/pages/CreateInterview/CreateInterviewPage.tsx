import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import FileUpload from "../../components/common/FileUpload";
import Button from "../../components/common/Button";
import api from "../../services/api";

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

    if (!formData.domain)
      newErrors.domain = "Please select domain.";

    if (!formData.language)
      newErrors.language = "Please select programming language.";

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
          interviewDetails: formData,
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
    <div className="min-h-screen bg-gray-100 px-6 py-12">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-10 shadow-xl">

        <h1 className="text-4xl font-bold text-gray-900">
          Create Your AI Interview
        </h1>

        <p className="mb-10 mt-3 text-lg text-gray-600">
          Fill in the details below and let AI generate a personalized mock interview.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          <Select
            label="Role *"
            options={roles}
            value={formData.role}
            error={errors.role}
            onChange={(e) =>
              handleSelectChange("role", e.target.value)
            }
          />

          <Select
            label="Experience *"
            options={experiences}
            value={formData.experience}
            error={errors.experience}
            onChange={(e) =>
              handleSelectChange("experience", e.target.value)
            }
          />

          <Select
            label="Difficulty *"
            options={difficulties}
            value={formData.difficulty}
            error={errors.difficulty}
            onChange={(e) =>
              handleSelectChange("difficulty", e.target.value)
            }
          />

          <Select
            label="Domain *"
            options={domains}
            value={formData.domain}
            error={errors.domain}
            onChange={(e) =>
              handleSelectChange("domain", e.target.value)
            }
          />

          <Select
            label="Programming Language *"
            options={languages}
            value={formData.language}
            error={errors.language}
            onChange={(e) =>
              handleSelectChange("language", e.target.value)
            }
          />

          <Input
            label="Position *"
            placeholder="e.g. Senior Frontend Developer"
            value={formData.position}
            error={errors.position}
            onChange={(e) =>
              handleSelectChange("position", e.target.value)
            }
          />

          <div className="md:col-span-2">
            <FileUpload
              label="Resume *"
              error={errors.resume}
              onChange={handleResumeChange}
            />
          </div>

          <div className="md:col-span-2 mt-4">
            <Button
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? "Generating Interview..."
                : "🚀 Generate AI Interview"}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CreateInterviewPage;