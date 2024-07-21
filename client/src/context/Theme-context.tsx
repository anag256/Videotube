import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface themeContext{
    theme:'dark' | 'light',
    toggleTheme:() => void
}
const ThemeContext = createContext<themeContext>({} as themeContext);
export const useThemeContext = () => {
  return useContext<themeContext>(ThemeContext);
};

export const ThemeProvider = ({ children }:PropsWithChildren<{}>) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };
  const theme:themeContext['theme'] = isDarkMode ? "dark" : "light";
  useEffect(() => {
    window.document.documentElement.setAttribute("data-theme", theme);
  }, [isDarkMode]);
  return (
    <ThemeContext.Provider value={{theme,toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};
