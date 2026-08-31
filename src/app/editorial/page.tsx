import ReviewQueue from "@/components/ReviewQueue";

export default function EditorialPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 mt-8">
      <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">Editorial Desk</h1>
      <p className="text-slate-600 dark:text-navy-300 mb-8">
        Review and verify pending field dispatches.
      </p>
      <ReviewQueue />
    </div>
  );
}
