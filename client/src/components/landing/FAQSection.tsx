import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  ["How does InterviewAce AI work?", "Choose your interview preferences, answer AI-generated questions, and receive detailed feedback with scores, strengths, and improvement areas."],
  ["Is it free?", "Yes. The Free plan lets you begin practicing without a payment setup. Additional plans shown on this page are coming soon."],
  ["What interview types are supported?", "InterviewAce AI supports technical and behavioral practice, with role, experience, domain, language, and difficulty options where relevant."],
  ["Does it support voice interviews?", "Yes. You can practice speaking your answers using the voice experience available in the interview flow."],
  ["Is my data secure?", "Authentication is handled through AWS Cognito, and protected application requests use authenticated sessions. Avoid including unnecessary sensitive information in practice answers."],
  ["Will more interview categories be added?", "The platform is designed to expand with more roles, interview types, and specialized practice categories over time."],
] as const;

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-20 bg-slate-50/80 py-24 dark:bg-[#080d1d] sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-6 lg:grid-cols-[.75fr_1.25fr] lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">FAQ</p>
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-slate-950 dark:text-white">Questions, answered.</h2>
          <p className="mt-5 leading-7 text-slate-600 dark:text-slate-300">Everything you need to know before starting your first practice interview.</p>
        </div>
        <div className="space-y-3">
          {faqs.map(([question, answer], index) => {
            const isOpen = openIndex === index;
            return (
              <div key={question} className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/65">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold text-slate-900 transition hover:bg-blue-50/50 dark:text-slate-100 dark:hover:bg-white/5"
                  aria-expanded={isOpen}
                >
                  {question}
                  <ChevronDown size={19} className={`shrink-0 text-slate-400 transition ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && <p className="px-5 pb-5 leading-7 text-slate-600 dark:text-slate-300">{answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
