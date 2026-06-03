// resources/js/layouts/frontend-layout.tsx

import { Head } from '@inertiajs/react';
import React, { ReactNode, useEffect } from 'react';
import Header from '@/layouts/frontend/header';
import Footer from '@/layouts/frontend/footer';
import { Toaster } from "@/components/ui/sonner";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

interface FrontendLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function FrontendLayout({
  children,
  title,
}: FrontendLayoutProps) {

  useEffect(() => {
    // Hindari inject script berulang
    if (document.getElementById('google-translate-script')) {
      return;
    }

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate) {
        return;
      }

      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'id',
          includedLanguages: 'id,en,zh-CN,ja,ko,ar',
          autoDisplay: false,
          layout:
            window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        'google_translate_element'
      );
    };

    const script = document.createElement('script');

    script.id = 'google-translate-script';
    script.src =
      'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';

    script.async = true;

    document.body.appendChild(script);

  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Head title={title} />

      <Header />

      <Toaster />

      <main className="grow bg-white">
        {children}
      </main>

      <Footer />
    </div>
  );
}