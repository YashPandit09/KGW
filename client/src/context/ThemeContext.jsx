import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        // Check localStorage or system preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        // Default to system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    const [b2bMode, setB2bMode] = useState(() => {
        const savedMode = localStorage.getItem('b2bMode');
        return savedMode === 'true';
    });

    useEffect(() => {
        // Update localStorage and document class
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark-mode', darkMode);
    }, [darkMode]);

    useEffect(() => {
        localStorage.setItem('b2bMode', b2bMode);
    }, [b2bMode]);

    const toggleTheme = () => setDarkMode(prev => !prev);
    const toggleB2BMode = () => setB2bMode(prev => !prev);

    return (
        <ThemeContext.Provider value={{
            darkMode,
            toggleTheme,
            b2bMode,
            toggleB2BMode
        }}>
            {children}
        </ThemeContext.Provider>
    );
};
