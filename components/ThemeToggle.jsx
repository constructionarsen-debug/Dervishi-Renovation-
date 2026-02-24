'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const current = theme === 'system' ? systemTheme : theme;
  const isDark = current === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-2 text-sm font-medium text-gray-900 shadow-sm backdrop-blur transition hover:bg-white dark:border-white/10 dark:bg-gray-900/60 dark:text-gray-50 dark:hover:bg-gray-900"
      aria-label="Toggle theme"
    >
      <span className="text-base">{isDark ? '🌙' : '☀️'}</span>
      {/* <span className="hidden sm:inline">{isDark ? 'Dark' : 'Light'}</span> */}
    </button>
  );
}
