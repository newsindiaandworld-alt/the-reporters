"use client";

import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

const SCRIPT_ID = "google-translate-script";
const CONTAINER_ID = "google_translate_element";

/**
 * Loads the Google Website Translator engine only. Translation is driven
 * entirely by the `googtrans` cookie (see LanguageSwitcher) — Google's
 * script reads that cookie on page load and translates the DOM
 * automatically, so we never touch `.goog-te-combo` or any widget DOM.
 *
 * The engine still requires a mount container id to initialize without
 * erroring internally, so one is created here in plain JS, appended
 * directly to <body>, and never rendered by React or shown on screen.
 */
export default function GoogleTranslate() {
  useEffect(() => {
    if (!document.getElementById(CONTAINER_ID)) {
      const container = document.createElement("div");
      container.id = CONTAINER_ID;
      container.style.display = "none";
      document.body.appendChild(container);
    }

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      new window.google.translate.TranslateElement(
        { pageLanguage: "en", autoDisplay: false },
        CONTAINER_ID
      );
    };
  }, []);

  return (
    <Script
      id={SCRIPT_ID}
      src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      strategy="lazyOnload"
    />
  );
}
