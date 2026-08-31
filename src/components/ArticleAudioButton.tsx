"use client";

import { Headphones } from "lucide-react";
import { useAudioStore } from "@/store/useAudioStore";

interface ArticleAudioButtonProps {
  audioUrl: string;
  title: string;
}

export default function ArticleAudioButton({
  audioUrl,
  title,
}: ArticleAudioButtonProps) {
  return (
    <button
      onClick={() => useAudioStore.getState().playAudio(audioUrl, title)}
      className="mt-4 flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-navy-950"
    >
      <Headphones size={16} />
      Listen to this article
    </button>
  );
}
