// src/components/theme-provider.jsx
import React, { createContext, useContext, useLayoutEffect, useState, useEffect } from "react";

const ThemeContext = createContext({
  theme: "system",
  setTheme: () => {},
});

const STORAGE_KEY_DEFAULT = "vite-ui-theme";

export function ThemeProvider({ children, defaultTheme = "system", storageKey = STORAGE_KEY_DEFAULT }) {
  const [theme, setThemeState] = useState(() => {
    try {
      if (typeof window === "undefined") return defaultTheme;
      return window.localStorage.getItem(storageKey) || defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  // Apply theme synchronously to minimize flash
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    const apply = (t) => {
      if (t === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.add(prefersDark ? "dark" : "light");
      } else {
        root.classList.add(t);
      }
    };

    apply(theme);
  }, [theme]);

  // Listen to OS changes when in system mode
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(mq.matches ? "dark" : "light");
      }
    };
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, [theme]);

  const setTheme = (value) => {
    try { window.localStorage.setItem(storageKey, value); } catch {}
    setThemeState(value);
  };

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
