"use client";

import { useEffect, useRef, useState } from "react";
import { Globe, Check } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "mr", label: "Marathi", native: "मराठी" },
];

/** Reads the current target language out of the googtrans cookie, if set. */
function readLangFromCookie(): string {
  const match = document.cookie.match(/googtrans=\/en\/([a-zA-Z-]+)/);
  return match ? match[1] : "en";
}

/**
 * Sets (or clears) the googtrans cookie Google's script reads on load, then
 * reloads the page so it can act on the new value immediately. This is the
 * classic cookie-driven trigger — no DOM/widget manipulation involved.
 */
function setLanguageCookie(code: string) {
  const hostname = window.location.hostname;

  if (code === "en") {
    // Expire the cookie on both scopes we ever set it on, to fully restore
    // the native, untranslated DOM.
    document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = `googtrans=; domain=${hostname}; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
  } else {
    document.cookie = `googtrans=/en/${code}; path=/`;
    document.cookie = `googtrans=/en/${code}; domain=${hostname}; path=/`;
  }

  window.location.reload();
}

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState("en");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrent(readLangFromCookie());
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const selectLanguage = (code: string) => {
    setIsOpen(false);
    if (code === current) return;
    setLanguageCookie(code);
  };

  return (
    <div ref={containerRef} className="relative notranslate">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Change language"
        aria-expanded={isOpen}
        className="flex items-center text-slate-600 transition-colors duration-300 ease-out hover:text-slate-900 dark:text-navy-300 dark:hover:text-white"
      >
        <Globe size={17} />
      </button>

      {isOpen && (
        <div className="animate-fade-in-up absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-md border border-slate-200 bg-white py-1 shadow-lg dark:border-navy-800 dark:bg-navy-900">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => selectLanguage(lang.code)}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-slate-700 transition-colors duration-200 ease-out hover:bg-slate-50 dark:text-navy-200 dark:hover:bg-navy-800"
            >
              <span className="flex items-baseline gap-1.5">
                <span>{lang.native}</span>
                {lang.code !== "en" && (
                  <span className="text-xs text-slate-400 dark:text-navy-500">
                    {lang.label}
                  </span>
                )}
              </span>
              {current === lang.code && (
                <Check size={14} className="text-brand-gold" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
