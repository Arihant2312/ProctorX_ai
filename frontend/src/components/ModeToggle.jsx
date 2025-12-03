// src/components/ModeToggle.jsx
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "./theme_provider";

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const htmlHasDark =
    typeof window !== "undefined" && document.documentElement.classList.contains("dark");
  const effective = theme === "system" ? (htmlHasDark ? "dark" : "light") : theme;

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const handleSelect = (value) => { setTheme(value); setOpen(false); };

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        aria-haspopup="true"
        aria-expanded={open}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-md border focus:outline-none"
      >
        <span aria-hidden>{effective === "dark" ? "🌙" : "☀️"}</span>
        <span className="sr-only">Toggle theme menu</span>
      </button>

      {open && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black/5 z-50"
        >
          <div className="py-1">
            <button
              role="menuitem"
              onClick={() => handleSelect("light")}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${theme === "light" ? "font-semibold" : ""}`}
            >
              ☀️ Light
            </button>

            <button
              role="menuitem"
              onClick={() => handleSelect("dark")}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${theme === "dark" ? "font-semibold" : ""}`}
            >
              🌙 Dark
            </button>

            <button
              role="menuitem"
              onClick={() => handleSelect("system")}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${theme === "system" ? "font-semibold" : ""}`}
            >
              🖥️ System
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
