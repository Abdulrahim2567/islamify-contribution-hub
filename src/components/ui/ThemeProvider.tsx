
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";
type Accent = "emerald" | "blue" | "indigo" | "violet";

interface ThemeContextProps {
  theme: Theme;
  accent: Accent;
  toggleTheme: () => void;
  setAccent: (accent: Accent) => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  accent: "emerald",
  toggleTheme: () => {},
  setAccent: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() =>
    (localStorage.getItem("theme") as Theme) || "light"
  );
  const [accent, setAccentState] = useState<Accent>(() =>
    (localStorage.getItem("accent") as Accent) || "emerald"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    document.body.dataset.accent = accent;
    localStorage.setItem("accent", accent);
  }, [accent]);

  const setAccent = (newAccent: Accent) => {
    setAccentState(newAccent);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, accent, setAccent, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
