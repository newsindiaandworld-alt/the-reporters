import { BadgeCheck } from "lucide-react";
import ArticleCard from "@/components/ArticleCard";

interface AuthorPageProps {
  params: { slug: string };
}

const MOCK_ARTICLES = [
  { title: "Council approves new metro line extension", category: "City", timeAgo: "2h ago", hasAudio: true },
  { title: "Monsoon repairs begin on flood-prone underpasses", category: "Infrastructure", timeAgo: "5h ago", hasAudio: false },
  { title: "Local markets rally after policy announcement", category: "Markets", timeAgo: "1d ago", hasAudio: true },
  { title: "Ward 4 residents demand faster response times", category: "City", timeAgo: "2d ago", hasAudio: false },
];

export default function AuthorPage({ params }: AuthorPageProps) {
  const authorName = params.slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div className="max-w-5xl mx-auto p-4 mt-8">
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-full bg-slate-100 border border-slate-200 dark:bg-navy-900 dark:border-navy-800" />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-semibold text-slate-900 dark:text-white">
              {authorName}
            </h1>
            <BadgeCheck size={19} className="text-brand-gold" />
          </div>
          <p className="text-sm text-slate-500 dark:text-navy-400 mt-1">Beat: Local Governance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {MOCK_ARTICLES.map((article, idx) => (
          <ArticleCard key={idx} {...article} />
        ))}
      </div>
    </div>
  );
}
