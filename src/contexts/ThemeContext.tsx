// src/contexts/ThemeContext.tsx
// Mode blanc uniquement

import React, { createContext, useContext, ReactNode } from 'react';

interface ThemeContextType {
  theme: 'light';
  isDark: false;
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'light', isDark: false });

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Forcer le mode light
  React.useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'light', isDark: false }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
