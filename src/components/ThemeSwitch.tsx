"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/app/shared/lib/cn";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ThemeSwitchProps {
  className?: string;
}

export const ThemeSwitch = ({ className }: ThemeSwitchProps) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const { resolvedTheme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "bg-gray-100 dark:bg-gray-800 relative flex size-10 items-center justify-center rounded-full",
          className
        )}
      >
        <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  const handleThemeToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={handleThemeToggle}
      className={cn(
        "relative flex size-10 cursor-pointer items-center justify-center rounded-full transition-all duration-300",
        "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700",
        "border border-gray-200 dark:border-gray-600",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
        className
      )}
    >
      {/* Sun icon */}
      <Sun
        className={cn(
          "absolute size-5 transition-all duration-300",
          "text-yellow-500 dark:text-yellow-400",
          isDark
            ? "scale-0 rotate-90 opacity-0"
            : "scale-100 rotate-0 opacity-100"
        )}
        aria-hidden="true"
      />

      {/* Moon icon */}
      <Moon
        className={cn(
          "absolute size-5 transition-all duration-300",
          "text-blue-500 dark:text-blue-400",
          isDark
            ? "scale-100 rotate-0 opacity-100"
            : "scale-0 -rotate-90 opacity-0"
        )}
        aria-hidden="true"
      />
    </button>
  );
};
