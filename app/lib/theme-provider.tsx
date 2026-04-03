import { createContext, useContext } from "react";
import type { Theme } from "~/lib/theme.server";

type ThemeContextType = {
  theme: Theme;
};

const ThemeContext = createContext<ThemeContextType>({ theme: "light" });

export function ThemeProvider({
  theme,
  children,
}: {
  theme: Theme;
  children: React.ReactNode;
}) {
  return (
    <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
