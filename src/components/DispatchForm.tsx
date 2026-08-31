"use client";

import { useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { uploadFileToB2, type UploadedMedia } from "@/lib/uploadClient";

interface LatLng {
  lat: number;
  lng: number;
}

interface MediaItem {
  id: string;
  file: File;
  previewUrl: string;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
  uploaded?: UploadedMedia;
}

type DispatchType = "article" | "audio_memo" | "video_short";

export default function DispatchForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [dispatchType, setDispatchType] = useState<DispatchType>("article");
  const [category, setCategory] = useState("General");
  const [location, setLocation] = useState<LatLng | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const wrapSelection = (marker: string) => {
    const textarea = bodyRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = body.slice(start, end);
    const newText = body.slice(0, start) + marker + selected + marker + body.slice(end);
    setBody(newText);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = start + marker.length;
      textarea.selectionEnd = start + marker.length + selected.length;
    });
  };

  const insertLinePrefix = (prefix: string) => {
    const textarea = bodyRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const lineStart = body.lastIndexOf("\n", start - 1) + 1;
    const newText = body.slice(0, lineStart) + prefix + body.slice(lineStart);
    setBody(newText);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = start + prefix.length;
      textarea.selectionEnd = end + prefix.length;
    });
  };

  const getLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      }
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const newItems: MediaItem[] = files.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      status: "pending",
    }));

    setMedia((prev) => [...prev, ...newItems]);
    e.target.value = "";

    newItems.forEach((item) => uploadItem(item));
  };

  const uploadItem = async (item: MediaItem) => {
    setMedia((prev) =>
      prev.map((m) => (m.id === item.id ? { ...m, status: "uploading" } : m))
    );

    try {
      const uploaded = await uploadFileToB2(item.file, (pct) => {
        setMedia((prev) =>
          prev.map((m) => (m.id === item.id ? { ...m, progress: pct } : m))
        );
      });

      setMedia((prev) =>
        prev.map((m) =>
          m.id === item.id
            ? { ...m, status: "done", progress: 100, uploaded }
            : m
        )
      );
    } catch (err) {
      setMedia((prev) =>
        prev.map((m) =>
          m.id === item.id
            ? {
                ...m,
                status: "error",
                error: err instanceof Error ? err.message : "Upload failed",
              }
            : m
        )
      );
    }
  };

  const removeItem = (id: string) => {
    setMedia((prev) => {
      const target = prev.find((m) => m.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((m) => m.id !== id);
    });
  };

  const isUploading = media.some((m) => m.status === "uploading");
  const doneMedia = media.filter((m) => m.status === "done" && m.uploaded);
  const mediaUrls = doneMedia.map((m) => m.uploaded!.url);
  const mediaType = doneMedia[0]?.file.type.startsWith("video/") ? "video" : "image";

  const resetForm = () => {
    media.forEach((m) => URL.revokeObjectURL(m.previewUrl));
    setTitle("");
    setBody("");
    setDispatchType("article");
    setCategory("General");
    setLocation(null);
    setMedia([]);
    setIsSubmitted(false);
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: body,
          dispatchType,
          category,
          imageUrl: mediaUrls[0] ?? null,
          mediaType,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit story");
      }

      setIsSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit story");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-md border border-brand-gold/40 bg-brand-gold/10 p-6 text-center">
        <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-brand-gold" />
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          Your story has been submitted to the Editorial Desk for verification.
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-navy-400">
          An editor will review it before it goes live.
        </p>
        <button
          type="button"
          onClick={resetForm}
          className="mt-4 text-xs font-semibold text-brand-gold hover:underline"
        >
          Submit another story
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-navy-300 mb-1">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-gold dark:border-navy-700 dark:bg-navy-900 dark:text-white dark:placeholder-navy-400"
          placeholder="What's happening?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-navy-300 mb-1">
          Article Story / Body
        </label>
        <div className="mb-1.5 flex items-center gap-1 rounded-md border border-slate-300 bg-slate-50 p-1 dark:border-navy-700 dark:bg-navy-900">
          <button
            type="button"
            onClick={() => wrapSelection("**")}
            className="rounded px-2 py-1 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:text-navy-200 dark:hover:bg-navy-700"
            title="Bold"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => wrapSelection("*")}
            className="rounded px-2 py-1 text-xs italic text-slate-700 hover:bg-slate-200 dark:text-navy-200 dark:hover:bg-navy-700"
            title="Italic"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => insertLinePrefix("# ")}
            className="rounded px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:text-navy-200 dark:hover:bg-navy-700"
            title="Heading"
          >
            H
          </button>
          <button
            type="button"
            onClick={() => insertLinePrefix("- ")}
            className="rounded px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:text-navy-200 dark:hover:bg-navy-700"
            title="Bullet List"
          >
            •
          </button>
        </div>
        <textarea
          ref={bodyRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={8}
          className="w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm leading-relaxed text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-gold dark:border-navy-700 dark:bg-navy-900 dark:text-white dark:placeholder-navy-400"
          placeholder="Write the full story here — background, quotes, and details..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-navy-300 mb-1">
          Dispatch Type
        </label>
        <select
          value={dispatchType}
          onChange={(e) => setDispatchType(e.target.value as DispatchType)}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-navy-700 dark:bg-navy-900 dark:text-white"
        >
          <option value="article">Article</option>
          <option value="audio_memo">Audio Memo</option>
          <option value="video_short">Video Short</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-navy-300 mb-1">
          Category
        </label>
        <select
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-navy-700 dark:bg-navy-900 dark:text-white"
        >
          <option value="General">General</option>
          <option value="Politics">Politics</option>
          <option value="Tech">Tech</option>
          <option value="Sports">Sports</option>
          <option value="Editorial">Editorial</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-navy-300 mb-1">
          Media Files
        </label>
        <input
          type="file"
          accept="image/*,video/mp4,video/webm"
          multiple
          onChange={handleFileSelect}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 file:mr-3 file:rounded file:border-0 file:bg-slate-200 file:px-3 file:py-1 file:text-slate-900 dark:border-navy-700 dark:bg-navy-900 dark:text-white dark:file:bg-navy-700 dark:file:text-white"
        />

        {media.length > 0 && (
          <ul className="mt-3 space-y-2">
            {media.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-2 dark:border-navy-700 dark:bg-navy-900"
              >
                {item.file.type.startsWith("video/") ? (
                  <video
                    src={item.previewUrl}
                    className="h-12 w-12 rounded object-cover"
                    muted
                  />
                ) : (
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-slate-700 dark:text-navy-200">
                    {item.file.name}
                  </p>
                  {item.status === "uploading" && (
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded bg-slate-200 dark:bg-navy-800">
                      <div
                        className="h-full bg-brand-gold transition-all"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                  {item.status === "done" && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">Uploaded</p>
                  )}
                  {item.status === "error" && (
                    <p className="text-xs text-red-600 dark:text-red-400">{item.error}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-xs text-slate-500 hover:text-slate-900 dark:text-navy-400 dark:hover:text-white"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <button
          type="button"
          onClick={getLocation}
          disabled={isLocating}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 disabled:opacity-50 dark:border-navy-700 dark:bg-navy-900 dark:text-white"
        >
          {isLocating ? "Locating..." : "Pin My Location"}
        </button>
        {location && (
          <p className="mt-2 text-xs text-slate-500 dark:text-navy-400">
            Lat: {location.lat.toFixed(5)}, Lng: {location.lng.toFixed(5)}
          </p>
        )}
      </div>

      {submitError && (
        <p className="text-xs text-red-600 dark:text-red-400">{submitError}</p>
      )}

      <button
        type="submit"
        disabled={isUploading || isSubmitting}
        className="w-full rounded-md bg-brand-gold px-3 py-2 text-sm font-semibold text-navy-950 disabled:opacity-50"
      >
        {isUploading
          ? "Uploading media..."
          : isSubmitting
          ? "Submitting..."
          : "Submit Story"}
      </button>
    </form>
  );
}
