
import React from "react";
import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="rounded-full p-2 transition-colors border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950"
      type="button"
    >
      {theme === "dark" ? <Sun className="text-yellow-400" size={20}/> : <Moon className="text-gray-700" size={20}/>}
    </button>
  );
};
