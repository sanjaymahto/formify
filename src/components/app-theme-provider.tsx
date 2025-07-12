'use client';

import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/lib/settings-store';

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const settings = useSettingsStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    // Apply theme
    root.classList.remove('light', 'dark');
    if (settings.theme === 'auto') {
      // Check system preference
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      root.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      root.classList.add(settings.theme);
    }

    // Apply color palette
    root.classList.remove(
      'palette-default',
      'palette-blue',
      'palette-green',
      'palette-purple',
      'palette-orange',
      'palette-pink',
      'palette-red',
      'palette-teal',
      'palette-indigo',
      'palette-yellow'
    );
    root.classList.add(`palette-${settings.colorPalette}`);

    // Apply font size
    root.classList.remove('text-small', 'text-medium', 'text-large');
    root.classList.add(`text-${settings.fontSize}`);

    // Apply border radius
    root.classList.remove(
      'radius-none',
      'radius-small',
      'radius-medium',
      'radius-large'
    );
    root.classList.add(`radius-${settings.borderRadius}`);

    // Apply animation speed
    root.classList.remove(
      'animation-slow',
      'animation-normal',
      'animation-fast'
    );
    root.classList.add(`animation-${settings.animationSpeed}`);

    // Apply accessibility settings
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const isDark = root.classList.contains('dark');
      metaThemeColor.setAttribute('content', isDark ? '#0f172a' : '#ffffff');
    }
  }, [settings, mounted]);

  return <>{children}</>;
}
