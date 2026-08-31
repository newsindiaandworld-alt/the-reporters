'use client';

import { useEffect, useRef } from 'react';
import { Play, Pause, X } from 'lucide-react';
import { useAudioStore } from '@/store/useAudioStore';

const RATES = [1, 1.25, 1.5];

export default function AudioDock() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    isOpen,
    audioUrl,
    title,
    isPlaying,
    playbackRate,
    togglePlay,
    closeDock,
    setPlaybackRate,
  } = useAudioStore();

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !audioUrl) return;
    if (isPlaying) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [isPlaying, audioUrl]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.playbackRate = playbackRate;
  }, [playbackRate]);

  if (!isOpen) return null;

  const cycleRate = () => {
    const idx = RATES.indexOf(playbackRate);
    const next = RATES[(idx + 1) % RATES.length];
    setPlaybackRate(next);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white text-slate-900 p-4 flex items-center justify-between border-t border-slate-200 z-50 dark:bg-navy-900 dark:text-white dark:border-navy-800">
      <audio
        ref={audioRef}
        src={audioUrl ?? undefined}
        onEnded={() => useAudioStore.getState().closeDock()}
      />
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={togglePlay}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-navy-950"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <span className="truncate text-sm font-medium">{title}</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={cycleRate}
          className="rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold dark:border-navy-700"
        >
          {playbackRate}x
        </button>
        <button onClick={closeDock} aria-label="Close">
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
