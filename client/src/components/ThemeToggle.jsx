import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = ({ className = "" }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative p-2.5 rounded-full transition-all duration-300 bg-slate-200/70 hover:bg-slate-300/80 dark:bg-slate-800/70 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm hover:scale-105 active:scale-95 ${className}`}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle Theme Mode"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <Sun className={`w-5 h-5 absolute transition-all duration-500 transform ${isDark ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100 text-amber-500'}`} />
        <Moon className={`w-5 h-5 absolute transition-all duration-500 transform ${isDark ? 'rotate-0 opacity-100 scale-100 text-brand-400' : '-rotate-90 opacity-0 scale-50'}`} />
      </div>
    </button>
  );
};
