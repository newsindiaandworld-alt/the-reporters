import { create } from 'zustand';

interface AudioState {
  isOpen: boolean;
  audioUrl: string | null;
  title: string;
  isPlaying: boolean;
  playbackRate: number;
  playAudio: (url: string, title: string) => void;
  togglePlay: () => void;
  closeDock: () => void;
  setPlaybackRate: (rate: number) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  isOpen: false,
  audioUrl: null,
  title: '',
  isPlaying: false,
  playbackRate: 1,
  playAudio: (url, title) => set({ isOpen: true, audioUrl: url, title, isPlaying: true }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  closeDock: () => set({ isOpen: false, isPlaying: false, audioUrl: null }),
  setPlaybackRate: (rate) => set({ playbackRate: rate }),
}));
