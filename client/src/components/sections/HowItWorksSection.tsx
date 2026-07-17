import StepCard from "../common/StepCard";

const steps = [
  {
    step: "1",
    title: "Create Interview",
    description:
      "Choose your role, experience, difficulty, technology, and upload your resume.",
  },
  {
    step: "2",
    title: "Practice with AI",
    description:
      "Answer AI-generated interview questions designed specifically for your profile.",
  },
  {
    step: "3",
    title: "Get Feedback",
    description:
      "Review your performance, identify strengths, and improve for your next interview.",
  },
];

function HowItWorksSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <h2 className="text-4xl font-bold text-gray-900">
            How It Works
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Prepare for your next interview in three simple steps.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <StepCard
              key={step.step}
              step={step.step}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;