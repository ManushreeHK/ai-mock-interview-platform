import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, X } from "lucide-react";
import HistoryCard from "../../components/history/HistoryCard";
import { fetchInterviewHistoryPage } from "../../services/interviewHistory";
import type { InterviewHistoryItem } from "../../types/interview-history";
import {
  appendUniqueHistoryItems,
  applyHistoryView,
  formatHistoryDate,
  getLoadedHistorySummary,
  initialHistoryFilters,
  uniqueHistoryValues,
  type HistoryFilters,
  type HistorySort,
} from "../../utils/interviewHistoryView";

const PAGE_SIZE = 20;

function SelectControl({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="min-w-0">
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      >
        {children}
      </select>
    </label>
  );
}

export default function HistoryPage() {
  const [items, setItems] = useState<InterviewHistoryItem[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [loadMoreError, setLoadMoreError] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<HistoryFilters>(
    initialHistoryFilters
  );
  const [sort, setSort] = useState<HistorySort>("newest");

  useEffect(() => {
    let active = true;

    fetchInterviewHistoryPage(PAGE_SIZE)
      .then((page) => {
        if (!active) return;
        setItems(page.items);
        setNextToken(page.nextToken);
      })
      .catch(() => {
        if (active) {
          setError("Interview history is temporarily unavailable.");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [retryKey]);

  const options = useMemo(
    () => ({
      roles: uniqueHistoryValues(items, "role"),
      interviewTypes: uniqueHistoryValues(items, "interviewType"),
      difficulties: uniqueHistoryValues(items, "difficulty"),
    }),
    [items]
  );
  const visibleItems = useMemo(
    () => applyHistoryView(items, search, filters, sort),
    [filters, items, search, sort]
  );
  const summary = useMemo(() => getLoadedHistorySummary(items), [items]);
  const hasActiveFilters =
    search.trim() !== "" ||
    Object.entries(filters).some(
      ([key, value]) =>
        value !== initialHistoryFilters[key as keyof HistoryFilters]
    );

  function updateFilter<K extends keyof HistoryFilters>(
    key: K,
    value: HistoryFilters[K]
  ) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function clearFilters() {
    setSearch("");
    setFilters(initialHistoryFilters);
  }

  function retryInitialLoad() {
    setIsLoading(true);
    setError("");
    setRetryKey((value) => value + 1);
  }

  async function loadMore() {
    if (!nextToken || isLoadingMore) return;
    setIsLoadingMore(true);
    setLoadMoreError("");

    try {
      const page = await fetchInterviewHistoryPage(PAGE_SIZE, nextToken);
      setItems((current) => appendUniqueHistoryItems(current, page.items));
      setNextToken(page.nextToken);
    } catch {
      setLoadMoreError(
        "More interviews could not be loaded. Your current results are unchanged."
      );
    } finally {
      setIsLoadingMore(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Interview History
          </h1>
          <p className="mt-2 text-slate-600">
            Review your completed interviews and track performance over time.
          </p>
        </div>
        <Link
          to="/create-interview"
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:w-fit"
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
          New Interview
        </Link>
      </header>

      {!isLoading && !error && items.length > 0 && (
        <section
          aria-label="Loaded interview summary"
          className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4"
        >
          {[
            ["Interviews loaded", summary.total],
            ["Average score", `${summary.averageScore}/10`],
            ["Best score", `${summary.bestScore}/10`],
            [
              "Latest interview",
              summary.latestDate ? formatHistoryDate(summary.latestDate) : "—",
            ],
          ].map(([label, value]) => (
            <div
              key={label}
              className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-5"
            >
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-2 break-words text-xl font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">{value}</p>
            </div>
          ))}
        </section>
      )}

      {!isLoading && !error && items.length > 0 && (
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[minmax(14rem,2fr)_repeat(3,minmax(8rem,1fr))]">
            <label className="relative min-w-0">
              <span className="sr-only">Search interview history</span>
              <Search
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search role, type, difficulty, date…"
                className="min-h-11 w-full rounded-xl border border-slate-200 pl-10 pr-10 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 min-h-9 min-w-9 -translate-y-1/2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="mx-auto h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </label>

            <SelectControl
              label="Filter by role"
              value={filters.role}
              onChange={(value) => updateFilter("role", value)}
            >
              <option value="all">All roles</option>
              {options.roles.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </SelectControl>
            <SelectControl
              label="Filter by interview type"
              value={filters.interviewType}
              onChange={(value) => updateFilter("interviewType", value)}
            >
              <option value="all">All interview types</option>
              {options.interviewTypes.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </SelectControl>
            <SelectControl
              label="Sort interviews"
              value={sort}
              onChange={(value) => setSort(value as HistorySort)}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="highest">Highest score</option>
              <option value="lowest">Lowest score</option>
            </SelectControl>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <SelectControl
              label="Filter by difficulty"
              value={filters.difficulty}
              onChange={(value) => updateFilter("difficulty", value)}
            >
              <option value="all">All difficulties</option>
              {options.difficulties.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </SelectControl>
            <SelectControl
              label="Filter by score range"
              value={filters.scoreRange}
              onChange={(value) =>
                updateFilter("scoreRange", value as HistoryFilters["scoreRange"])
              }
            >
              <option value="all">All scores</option>
              <option value="0-5">Below 5</option>
              <option value="5-7">5 to below 7</option>
              <option value="7-9">7 to below 9</option>
              <option value="9-10">9 to 10</option>
            </SelectControl>
            <SelectControl
              label="Filter by recent period"
              value={filters.recentPeriod}
              onChange={(value) =>
                updateFilter("recentPeriod", value as HistoryFilters["recentPeriod"])
              }
            >
              <option value="all">Any date</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </SelectControl>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
            <p>
              Showing {visibleItems.length} of {items.length} loaded interviews.
              Search, filters, and sorting apply to loaded records.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="min-h-10 rounded-lg px-3 font-semibold text-blue-600 hover:bg-blue-50"
              >
                Clear filters
              </button>
            )}
          </div>
        </section>
      )}

      {isLoading ? (
        <div aria-label="Loading interview history" className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-44 animate-pulse rounded-3xl bg-slate-200"
            />
          ))}
        </div>
      ) : error ? (
        <section className="rounded-3xl border border-rose-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            History unavailable
          </h2>
          <p className="mt-2 text-slate-600">{error}</p>
          <button
            type="button"
            onClick={retryInitialLoad}
            className="mt-5 min-h-11 rounded-xl bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </section>
      ) : items.length === 0 ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Complete your first interview to see your history here.
          </h2>
          <Link
            to="/create-interview"
            className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700"
          >
            Start Interview
          </Link>
        </section>
      ) : visibleItems.length === 0 ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            No interviews match your search or filters.
          </h2>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 min-h-11 rounded-xl bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700"
          >
            Clear filters
          </button>
        </section>
      ) : (
        <div className="space-y-4">
          {visibleItems.map((interview) => (
            <HistoryCard key={interview.interviewId} interview={interview} />
          ))}
        </div>
      )}

      {!isLoading && !error && nextToken && (
        <div className="text-center">
          {loadMoreError && (
            <p role="alert" className="mb-3 text-sm text-rose-600">
              {loadMoreError}
            </p>
          )}
          <button
            type="button"
            onClick={() => void loadMore()}
            disabled={isLoadingMore}
            className="min-h-11 rounded-xl border border-blue-200 bg-white px-6 font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-wait disabled:opacity-60"
          >
            {isLoadingMore ? "Loading…" : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
