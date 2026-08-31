"use client";

import { useState } from "react";

export default function SentimentPoll() {
  const [hasVoted, setHasVoted] = useState(false);
  const [votes, setVotes] = useState({ support: 65, oppose: 35 });

  const total = votes.support + votes.oppose;
  const supportPct = Math.round((votes.support / total) * 100);
  const opposePct = 100 - supportPct;

  const handleVote = (side: "support" | "oppose") => {
    setVotes((prev) => ({ ...prev, [side]: prev[side] + 1 }));
    setHasVoted(true);
  };

  return (
    <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg my-8 dark:bg-navy-900 dark:border-navy-800">
      <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
        Do you support the new zoning laws?
      </h2>

      {!hasVoted ? (
        <div className="flex gap-3">
          <button
            onClick={() => handleVote("support")}
            className="flex-1 rounded bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-500"
          >
            Support
          </button>
          <button
            onClick={() => handleVote("oppose")}
            className="flex-1 rounded bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500"
          >
            Oppose
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-slate-600 dark:text-navy-200 mb-1">
              <span>Support</span>
              <span>{supportPct}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 border border-slate-300 dark:bg-navy-800 dark:border-navy-700">
              <div
                className="h-2 rounded-full bg-green-600"
                style={{ width: `${supportPct}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-slate-600 dark:text-navy-200 mb-1">
              <span>Oppose</span>
              <span>{opposePct}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 border border-slate-300 dark:bg-navy-800 dark:border-navy-700">
              <div
                className="h-2 rounded-full bg-red-600"
                style={{ width: `${opposePct}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
