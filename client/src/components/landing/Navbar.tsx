import { Menu, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

const links = [
  ["Features", "#features"],
  ["How It Works", "#how-it-works"],
  ["Pricing", "#pricing"],
  ["FAQ", "#faq"],
  ["About", "#about"],
] as const;

export default function Navbar() {
  const { status } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const startPath =
    status === "authenticated" ? "/create-interview" : "/login";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition ${
        scrolled
          ? "border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/90"
          : "border-transparent bg-white/95 dark:bg-slate-950/95"
      }`}
    >
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <Sparkles size={18} />
          </span>
          <span className="text-lg font-bold tracking-tight">
            InterviewAce <span className="text-blue-600">AI</span>
          </span>
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/login"
            className="px-3 py-2 text-sm font-semibold text-slate-700 transition hover:text-blue-600"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold transition hover:border-blue-200 hover:bg-blue-50"
          >
            Get Started
          </Link>
          <Link
            to={startPath}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            Start Interview
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="rounded-lg p-2 text-slate-700 lg:hidden"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-100 bg-white px-5 py-5 shadow-xl dark:border-slate-700 dark:bg-slate-900 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 font-medium text-slate-700 hover:bg-slate-50"
              >
                {label}
              </a>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
              <Link to="/login" className="rounded-xl border border-slate-200 px-4 py-3 text-center font-semibold">
                Login
              </Link>
              <Link to={startPath} className="rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white">
                Start Interview
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
