import { useCallback, useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

const setCookie = (name: string, value: string, days = 365) => {
  if (typeof document === 'undefined') {
    return;
  }

  const maxAge = days * 24 * 60 * 60;

  document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const applyTheme = () => {
  // Paksa selalu light
  document.documentElement.classList.remove('dark');

  // Native browser UI (input, scrollbar, dll)
  document.documentElement.style.colorScheme = 'light';
};

export function initializeTheme() {
  applyTheme();
}

export function useAppearance() {
  const [appearance, setAppearance] = useState<Appearance>('light');

  const updateAppearance = useCallback((newAppearance: Appearance) => {
    setAppearance(newAppearance);

    // Simpan appearance yang dipilih
    localStorage.setItem('appearance', newAppearance);

    // Simpan ke cookie untuk SSR
    setCookie('appearance', newAppearance);

    applyTheme();
  }, []);

  useEffect(() => {
    const savedAppearance = localStorage.getItem('appearance');
    if (savedAppearance) {
      setAppearance(savedAppearance as Appearance);
    }
    else {
      setAppearance('light');
    }
  }, []);

  return {
    appearance,
    updateAppearance,
  } as const;
}