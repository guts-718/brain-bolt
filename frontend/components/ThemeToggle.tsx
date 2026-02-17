"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() =>
        setTheme(theme === "dark" ? "light" : "dark")
      }
      className="fixed top-5 right-5 border px-4 py-1 rounded-lg text-sm
      dark:bg-white dark:text-black
      bg-black text-white"
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
