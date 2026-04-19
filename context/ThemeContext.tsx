import { darkTheme, lightTheme } from "@/components/theme_colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

export type AppTheme = typeof lightTheme;

const ThemeContext = createContext<{
  theme: AppTheme;
  isDark: boolean;
  setTheme: (mode: "light" | "dark") => void;
}>({ theme: lightTheme, isDark: false, setTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("theme").then((saved) => {
      if (saved === "dark") setIsDark(true);
    });
  }, []);

  const setTheme = async (mode: "light" | "dark") => {
    setIsDark(mode === "dark");
    await AsyncStorage.setItem("theme", mode);
  };

  return (
    <ThemeContext.Provider
      value={{ theme: isDark ? darkTheme : lightTheme, isDark, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
