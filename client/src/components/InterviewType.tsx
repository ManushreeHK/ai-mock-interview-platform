import { useEffect, useId, useRef, useState } from "react";
import { Briefcase, Code2, MessageSquare, X } from "lucide-react";
import clsx from "clsx";
import {
  isInterviewTypeAvailable,
  type InterviewTypeId,
} from "../utils/interviewTypeAvailability";

type InterviewTypeProps = {
  value: string;
  onChange: (value: string) => void;
};

const interviewTypes = [
  {
    id: "technical",
    title: "Technical",
    description: "DSA, System Design, Frontend, Backend",
    icon: Briefcase,
  },
  {
    id: "behavioral",
    title: "Behavioral",
    description: "HR, Leadership, Communication",
    icon: MessageSquare,
  },
  {
    id: "coding",
    title: "Coding",
    description: "Live coding with compiler",
    icon: Code2,
  },
] as const;

const unavailableMessages = {
  behavioral: {
    title: "Behavioral Interviews are coming soon",
    body: "We’re building realistic HR, leadership, and communication interview practice.",
  },
  coding: {
    title: "Coding Interviews are coming soon",
    body: "We’re building live coding practice with an editor, test cases, and AI feedback.",
  },
} as const;

export default function InterviewType({ value, onChange }: InterviewTypeProps) {
  const [noticeType, setNoticeType] = useState<keyof typeof unavailableMessages | null>(null);
  const dialogTitleId = useId();
  const dialogDescriptionId = useId();
  const continueButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!noticeType) return;
    continueButtonRef.current?.focus();

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setNoticeType(null);
      triggerRef.current?.focus();
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [noticeType]);

  function selectType(type: InterviewTypeId, trigger: HTMLButtonElement) {
    if (isInterviewTypeAvailable(type)) {
      onChange("technical");
      return;
    }

    triggerRef.current = trigger;
    setNoticeType(type);
  }

  function continueWithTechnical() {
    onChange("technical");
    setNoticeType(null);
    triggerRef.current?.focus();
  }

  const notice = noticeType ? unavailableMessages[noticeType] : null;

  return (
    <section aria-label="Interview type">
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {interviewTypes.map((type) => {
          const Icon = type.icon;
          const available = isInterviewTypeAvailable(type.id);
          const selected = available && value === type.id;

          return (
            <button
              key={type.id}
              type="button"
              onClick={(event) => selectType(type.id, event.currentTarget)}
              aria-pressed={selected}
              aria-disabled={!available}
              aria-label={`${type.title} interview — ${available ? "Available" : "Coming Soon"}`}
              className={clsx(
                "relative min-h-11 rounded-2xl border p-5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 sm:p-6",
                selected
                  ? "border-blue-600 bg-blue-50 shadow-lg shadow-blue-600/10 dark:border-blue-500 dark:bg-blue-950/50"
                  : "cursor-not-allowed border-slate-200 bg-slate-50/80 opacity-75 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-slate-600"
              )}
            >
              <span className={clsx(
                "absolute right-4 top-4 rounded-full px-2.5 py-1 text-[11px] font-bold",
                available
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
              )}>
                {available ? "Available" : "Coming Soon"}
              </span>
              <span className={clsx(
                "mb-4 flex h-12 w-12 items-center justify-center rounded-xl",
                available
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900/70 dark:text-blue-300"
                  : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
              )}>
                <Icon size={24} aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {type.title}
              </h3>
              <p className="mt-2 pr-2 text-sm text-slate-500 dark:text-slate-400">
                {type.description}
              </p>
            </button>
          );
        })}
      </div>

      {notice && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" onMouseDown={(event) => {
          if (event.target === event.currentTarget) continueWithTechnical();
        }}>
          <div role="dialog" aria-modal="true" aria-labelledby={dialogTitleId} aria-describedby={dialogDescriptionId} className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:p-8">
            <button type="button" onClick={continueWithTechnical} aria-label="Close message" className="absolute right-4 top-4 grid min-h-11 min-w-11 place-items-center rounded-xl text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-slate-800">
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">Coming Soon</span>
            <h2 id={dialogTitleId} className="mt-4 pr-10 text-xl font-bold text-slate-900 dark:text-slate-100">{notice.title}</h2>
            <p id={dialogDescriptionId} className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{notice.body}</p>
            <button ref={continueButtonRef} type="button" onClick={continueWithTechnical} className="mt-6 min-h-11 w-full rounded-xl bg-blue-600 px-5 font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900">
              Continue with Technical Interview
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
