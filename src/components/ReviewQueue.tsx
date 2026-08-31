"use client";

import { useEffect, useState } from "react";

interface Article {
  id: number;
  title: string;
  content: string;
  dispatchType: string;
  imageUrl: string | null;
  status: string;
  createdAt: string;
}

export default function ReviewQueue() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/articles")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) throw new Error(data.error);
        setArticles(data.articles ?? []);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load dispatches");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const dismiss = (id: number) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  if (isLoading) {
    return <p className="text-slate-500 dark:text-navy-400">Loading dispatches...</p>;
  }

  if (error) {
    return <p className="text-red-600 dark:text-red-400">{error}</p>;
  }

  if (articles.length === 0) {
    return <p className="text-slate-500 dark:text-navy-400">No pending dispatches.</p>;
  }

  return (
    <div className="space-y-3">
      {articles.map((a) => (
        <div
          key={a.id}
          className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-navy-800 dark:bg-navy-900"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-navy-400">
              {a.dispatchType.replace("_", " ")} ·{" "}
              {new Date(a.createdAt).toLocaleString()}
            </p>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
              {a.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-navy-400 mt-0.5">
              Status: {a.status}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => dismiss(a.id)}
              className="rounded-md bg-green-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-600"
            >
              Verify &amp; Publish
            </button>
            <button
              onClick={() => dismiss(a.id)}
              className="rounded-md bg-brand-red px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
