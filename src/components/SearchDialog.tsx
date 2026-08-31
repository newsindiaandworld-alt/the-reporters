"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

const MOCK_RESULTS = [
  { title: "Local Elections See Record Turnout", type: "Article" },
  { title: "Alex S. — Local Governance Reporter", type: "Author" },
];

export default function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const close = () => {
    setIsOpen(false);
    setQuery("");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Search"
        className="text-slate-600 transition-colors duration-300 ease-out hover:text-slate-900 dark:text-navy-300 dark:hover:text-white"
      >
        <Search size={17} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex animate-fade-in-up items-center justify-center bg-white/95 px-4 dark:bg-navy-950/95">
          <div className="w-full max-w-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-navy-300">
                Search
              </span>
              <button
                onClick={close}
                aria-label="Close search"
                className="text-slate-900 transition-transform duration-300 ease-out hover:rotate-90 dark:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search news, topics, or reporters..."
              className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-lg text-slate-900 placeholder-slate-400 transition-colors duration-300 ease-out focus:outline-none focus:ring-1 focus:ring-brand-gold dark:border-navy-700 dark:bg-navy-900 dark:text-white dark:placeholder-navy-400"
            />

            {query.length > 2 && (
              <div className="mt-4 space-y-2">
                {MOCK_RESULTS.map((result) => (
                  <div
                    key={result.title}
                    className="rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-navy-800 dark:bg-navy-900"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-navy-400">
                      {result.type}
                    </p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {result.title}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
