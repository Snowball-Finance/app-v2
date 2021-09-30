import { createContext, useState, useContext, useEffect } from 'react';

const DarkModeContext = createContext();

function DarkModeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const darkModeFromStorage =
      JSON.parse(localStorage.getItem('darkMode')) || false;
    setDarkMode(darkModeFromStorage);
  }, []);

  const handleDarkModeChange = () => {
    localStorage.setItem('darkMode', !darkMode);
    setDarkMode(!darkMode);
  };
  const value = { darkMode, handleDarkModeChange };

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
}

function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
}

export { DarkModeProvider, useDarkMode };
