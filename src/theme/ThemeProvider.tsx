import React, { createContext, useContext, useState, useEffect } from "react";
import { goteraTheme } from "./brand";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof goteraTheme.theme;
  gradients: typeof goteraTheme.gradients;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

function getStoredTheme(fallback: Theme): Theme {
  if (typeof window === "undefined") return fallback;
  const savedTheme = localStorage.getItem("gotera-theme");
  return savedTheme === "light" || savedTheme === "dark"
    ? savedTheme
    : fallback;
}

function applyThemeClass(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = "light",
}) => {
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme(defaultTheme));

  useEffect(() => {
    localStorage.setItem("gotera-theme", theme);
    applyThemeClass(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const colors = theme === "dark" ? goteraTheme.themeDark : goteraTheme.theme;

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    colors,
    gradients: goteraTheme.gradients,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Hook for accessing brand colors directly
export const useBrandColors = () => {
  const { colors, gradients } = useTheme();
  return {
    colors,
    gradients,
    brandColors: goteraTheme.colors,
  };
};
