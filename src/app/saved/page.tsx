import ArticleCard from "@/components/ArticleCard";

const MOCK_SAVED = [
  { title: "City council approves new metro line extension", category: "City", timeAgo: "2h ago", hasAudio: true },
  { title: "Monsoon repairs begin on flood-prone underpasses", category: "Infrastructure", timeAgo: "5h ago", hasAudio: false },
  { title: "Local markets rally after policy announcement", category: "Markets", timeAgo: "1d ago", hasAudio: true },
];

export default function SavedPage() {
  return (
    <div className="max-w-6xl mx-auto p-4 mt-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Saved Stories</h1>
      <p className="text-slate-600 dark:text-navy-300 mt-1">Your personal reading list.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {MOCK_SAVED.map((article, idx) => (
          <ArticleCard key={idx} {...article} />
        ))}
      </div>

      {/*
      {MOCK_SAVED.length === 0 && (
        <p className="text-slate-600 dark:text-navy-300 mt-8">No stories saved yet.</p>
      )}
      */}
    </div>
  );
}
