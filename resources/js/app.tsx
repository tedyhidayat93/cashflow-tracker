import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { WishlistProvider } from './contexts/WishlistContext';

const appName = import.meta.env.VITE_APP_NAME || 'Alumoda Sinergi Kontainer Indonesia';

createInertiaApp({
  title: (title) => (title ? `${title}` : appName),
  resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
  setup({ el, App, props }: { el: Element; App: any; props: any & { csrfToken?: string } }) {
    const root = createRoot(el);

    // Make CSRF token available globally
    if (props.csrfToken) {
        (window as any).csrfToken = props.csrfToken;
    }

    root.render(
      <StrictMode>
        <WishlistProvider>
          <App {...props} />
        </WishlistProvider>
      </StrictMode>
    );
  },
  progress: {
    color: '#ed8f2a',
  },
});

// This will set light / dark mode on load...
initializeTheme();
