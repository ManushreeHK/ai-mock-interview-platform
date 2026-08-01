import {
  Globe2,
  Mail,
  MessageCircle,
  Share2,
  Sparkles,
} from "lucide-react";

const quickLinks = [
  ["Features", "#features"],
  ["Pricing", "#pricing"],
  ["FAQ", "#faq"],
  ["About", "#about"],
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <a href="#" className="inline-flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white">
              <Sparkles size={18} />
            </span>
            <span className="text-lg font-bold">InterviewAce <span className="text-blue-600">AI</span></span>
          </a>
          <p className="mt-4 max-w-sm leading-7 text-slate-600">
            Practice smarter, communicate clearly, and walk into your next interview with confidence.
          </p>
          <div className="mt-5 flex gap-2 text-slate-500">
            {[Globe2, MessageCircle, Share2].map((Icon, index) => (
              <span key={index} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200" aria-hidden="true">
                <Icon size={17} />
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-slate-900">Quick Links</h3>
          <ul className="mt-4 space-y-3">
            {quickLinks.map(([label, href]) => (
              <li key={href}><a href={href} className="text-sm text-slate-600 transition hover:text-blue-600">{label}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-slate-900">Company</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li><a href="#privacy" className="transition hover:text-blue-600">Privacy</a></li>
            <li><a href="#terms" className="transition hover:text-blue-600">Terms</a></li>
            <li><a href="mailto:hello@interviewace.ai" className="inline-flex items-center gap-2 transition hover:text-blue-600"><Mail size={14} /> Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100 px-5 py-6 text-center text-sm text-slate-500">
        © 2026 InterviewAce AI. All rights reserved.
      </div>
    </footer>
  );
}
