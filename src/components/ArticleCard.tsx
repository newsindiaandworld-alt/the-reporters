'use client';

import Link from 'next/link';
import { Play } from 'lucide-react';
import { useAudioStore } from '@/store/useAudioStore';

interface ArticleCardProps {
  title: string;
  category: string;
  timeAgo: string;
  hasAudio?: boolean;
}

export default function ArticleCard({
  title,
  category,
  timeAgo,
  hasAudio = false,
}: ArticleCardProps) {
  return (
    <div className="border border-slate-200 rounded-md p-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg dark:border-navy-800 dark:hover:border-navy-600 dark:hover:shadow-black/40">
      <div className="flex items-start justify-between gap-3">
        <Link href="/article/example-slug" className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-navy-400">
            {category} · {timeAgo}
          </p>
          <h3 className="mt-1.5 text-sm font-semibold leading-snug text-slate-900 dark:text-white">
            {title}
          </h3>
        </Link>
        {hasAudio && (
          <button
            onClick={() =>
              useAudioStore
                .getState()
                .playAudio(
                  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                  title
                )
            }
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white transition-transform duration-300 ease-out hover:scale-110 dark:bg-white dark:text-navy-950"
            aria-label="Play audio"
          >
            <Play size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
