"use client";

interface TimelineUpdate {
  time: string;
  headline: string;
  body: string;
}

interface LiveTimelineProps {
  updates: TimelineUpdate[];
}

export default function LiveTimeline({ updates }: LiveTimelineProps) {
  return (
    <div className="border border-slate-200 bg-slate-50 rounded-md p-6 my-8 dark:border-navy-800 dark:bg-navy-900/40">
      <div className="flex items-center gap-2 mb-6">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-red opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-red" />
        </span>
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-navy-300">
          Live Updates
        </h2>
      </div>
      <div className="relative border-l border-slate-200 pl-6 space-y-6 dark:border-navy-700">
        {updates.map((update, idx) => (
          <div key={idx} className="relative">
            <span className="absolute -left-[27px] top-1 h-2.5 w-2.5 rounded-full bg-brand-red" />
            <p className="text-xs text-slate-500 dark:text-navy-400">{update.time}</p>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm mt-0.5">
              {update.headline}
            </h3>
            <p className="text-sm text-slate-600 dark:text-navy-200 mt-1">{update.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
