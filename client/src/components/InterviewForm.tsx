import { Button, Input } from "./ui";
import FileUpload from "./ui/FileUpload";
import Select from "./ui/Select";


type Props = {
  interviewType: string;
  formData: {
    role: string;
    experience: string;
    difficulty: string;
    domain: string;
    language: string;
    position: string;
    resume: File | null;
  };

  errors: {
    role: string;
    experience: string;
    difficulty: string;
    domain: string;
    language: string;
    position: string;
    resume: string;
  };

  loading: boolean;

  handleSelectChange: (
    field: keyof Props["formData"],
    value: string
  ) => void;

  handleResumeChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;

  handleSubmit: () => void;
};

const roles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "QA Engineer",
  "Data Engineer",
];

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

const experiences = [
  "0-1 Years",
  "1-3 Years",
  "3-5 Years",
  "5-8 Years",
  "8+ Years",
];

const difficulties = [
  "Easy",
  "Medium",
  "Hard",
];

export default function InterviewForm({
  interviewType,
  formData,
  errors,
  loading,
  handleSelectChange,
  handleResumeChange,
  handleSubmit,
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold text-slate-900">
        Interview Details
      </h2>

      <p className="mt-2 text-slate-500">
        Configure your AI interview.
      </p>

      <div className="mt-8 grid gap-6">

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
                className={`rounded-xl border px-5 py-2 transition ${
                  formData.experience === exp
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-300 hover:border-blue-400"
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
                className={`rounded-xl border px-5 py-2 transition ${
                  formData.difficulty === difficulty
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-300 hover:border-blue-400"
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

        {/* Hide these for Behavioral */}

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
          label="Resume (Optional)"
          error={errors.resume}
          onChange={handleResumeChange}
        />

        <Button
          size="lg"
          fullWidth
          isLoading={loading}
          onClick={handleSubmit}
        >
          Start AI Interview
        </Button>

      </div>
    </div>
  );
}