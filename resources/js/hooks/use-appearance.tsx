import { useCallback, useEffect, useState } from 'react';

export type Appearance = 'light';

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

  const updateAppearance = useCallback(() => {
    setAppearance('light');

    // Simpan light saja
    localStorage.setItem('appearance', 'light');

    // Simpan ke cookie untuk SSR
    setCookie('appearance', 'light');

    applyTheme();
  }, []);

  useEffect(() => {
    updateAppearance();
  }, [updateAppearance]);

  return {
    appearance,
    updateAppearance,
  } as const;
}