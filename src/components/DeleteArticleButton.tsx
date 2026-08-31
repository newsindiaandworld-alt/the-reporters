'use client';

import { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteArticle } from '@/lib/actions';

interface DeleteArticleButtonProps {
  id: number;
}

export default function DeleteArticleButton({ id }: DeleteArticleButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!window.confirm('Delete this dispatch? This cannot be undone.')) return;
    startTransition(async () => {
      try {
        await deleteArticle(id);
      } catch {
        window.alert('You must be logged in to the Studio to delete dispatches.');
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      aria-label="Delete dispatch"
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors duration-200 hover:bg-red-50 hover:text-brand-red disabled:opacity-50 dark:text-navy-500 dark:hover:bg-red-950/40 dark:hover:text-red-400"
    >
      <Trash2 size={13} />
    </button>
  );
}
