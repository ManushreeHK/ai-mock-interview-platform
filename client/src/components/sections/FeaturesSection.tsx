import FeatureCard from "../common/FeatureCard";
import {
  Brain,
  FileText,
 Code2,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Questions",
    description:
      "Generate realistic interview questions tailored to your profile.",
  },
  {
    icon: FileText,
    title: "Resume Based",
    description:
      "Upload your resume and receive personalized interview questions.",
  },
  {
    icon: Code2,
    title: "Multiple Technologies",
    description:
      "Practice React, Java, Node.js, Python, AWS and more.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description:
      "Track your interview history and improve over time.",
  },
];

function FeaturesSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <h2 className="text-4xl font-bold text-gray-900">
            Why Choose InterviewAce AI?
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Everything you need to prepare for your next technical interview.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
            <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            />
        ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;