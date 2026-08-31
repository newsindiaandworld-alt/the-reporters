"use client";

import { useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  const toggle = () => {
    setIsDark((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative h-[18px] w-[18px] text-slate-600 transition-colors duration-300 ease-out hover:text-slate-900 dark:text-navy-200 dark:hover:text-white"
    >
      <Sun
        size={18}
        className={`absolute inset-0 transition-all duration-300 ease-out ${
          isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
        }`}
      />
      <Moon
        size={18}
        className={`absolute inset-0 transition-all duration-300 ease-out ${
          isDark ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
      />
    </button>
  );
}
