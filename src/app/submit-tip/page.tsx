import { submitTip } from "@/lib/actions";

export default function SubmitTipPage({
  searchParams,
}: {
  searchParams: { submitted?: string; error?: string };
}) {
  if (searchParams.submitted) {
    return (
      <div className="max-w-md mx-auto p-4 mt-8 bg-white border border-slate-200 rounded-xl text-center dark:bg-navy-900 dark:border-navy-800">
        <h1 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
          Thanks for the tip
        </h1>
        <p className="text-sm text-slate-600 dark:text-navy-300">
          Your submission has been sent to the Editorial Desk for review before it goes live.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 mt-8 bg-white border border-slate-200 rounded-xl dark:bg-navy-900 dark:border-navy-800">
      <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Submit a Tip</h1>
      <form action={submitTip} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-navy-300 mb-1">
            News Title
          </label>
          <input
            type="text"
            name="title"
            required
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-gold dark:border-navy-700 dark:bg-navy-900 dark:text-white dark:placeholder-navy-400"
            placeholder="What's happening?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-navy-300 mb-1">
            Story Content
          </label>
          <textarea
            name="content"
            required
            rows={8}
            className="w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm leading-relaxed text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-gold dark:border-navy-700 dark:bg-navy-900 dark:text-white dark:placeholder-navy-400"
            placeholder="Write what you know — background, quotes, and details..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-navy-300 mb-1">
            Reporter Name
          </label>
          <input
            type="text"
            name="reporterName"
            required
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-gold dark:border-navy-700 dark:bg-navy-900 dark:text-white dark:placeholder-navy-400"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-navy-300 mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            required
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-gold dark:border-navy-700 dark:bg-navy-900 dark:text-white dark:placeholder-navy-400"
            placeholder="Zaheerabad or the wider district"
          />
        </div>

        {searchParams.error && (
          <p className="text-xs text-red-600 dark:text-red-400">
            Title, content, reporter name, and location are all required.
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-md bg-brand-gold px-3 py-2 text-sm font-semibold text-navy-950"
        >
          Submit Tip
        </button>
      </form>
    </div>
  );
}
