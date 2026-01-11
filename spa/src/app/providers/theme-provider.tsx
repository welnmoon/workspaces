import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSelector((state: RootState) => state.theme.mode);

  useEffect(() => {
    const html = document.documentElement;

    html.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      html.classList.add(systemDark ? 'dark' : 'light');
    } else {
      html.classList.add(theme);
    }
  }, [theme]);

  return <>{children}</>;
}
