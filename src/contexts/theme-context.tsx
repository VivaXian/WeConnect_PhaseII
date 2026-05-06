import React, { createContext, useContext, useEffect, useRef } from 'react';
import {
  useMediaQuery,
  useTernaryDarkMode,
  type TernaryDarkMode,
} from 'usehooks-ts';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { isDarkMode, ternaryDarkMode, setTernaryDarkMode } =
    useTernaryDarkMode({
      defaultValue: 'system' as TernaryDarkMode,
      localStorageKey: 'filament-theme',
    });

  const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const prevSystemPrefersDark = useRef(systemPrefersDark);

  useEffect(() => {
    if (
      prevSystemPrefersDark.current !== systemPrefersDark &&
      ternaryDarkMode !== 'system'
    ) {
      setTernaryDarkMode('system');
    }
    prevSystemPrefersDark.current = systemPrefersDark;
  }, [systemPrefersDark, ternaryDarkMode, setTernaryDarkMode]);

  const toggleTheme = () => {
    const targetTheme = isDarkMode ? 'light' : 'dark';

    if (
      (targetTheme === 'dark' && systemPrefersDark) ||
      (targetTheme === 'light' && !systemPrefersDark)
    ) {
      setTernaryDarkMode('system');
    } else {
      setTernaryDarkMode(targetTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
