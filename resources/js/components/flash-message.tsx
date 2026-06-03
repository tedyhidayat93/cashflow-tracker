import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

// Definisi tipe pesan
interface MessageItem {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  id: string; // ID unik untuk menghapus pesan
}

export default function FlashMessage() {
  const { props } = usePage();
  const flash = props.flash as any;

  // State untuk pesan yang dibuat dari Client-side (JS)
  const [localMessages, setLocalMessages] = useState<MessageItem[]>([]);

  // 1. Listen Flash dari Backend (Laravel)
  useEffect(() => {
    if (flash.success) addLocalMessage('success', flash.success);
    if (flash.error) addLocalMessage('error', flash.error);
    if (flash.warning) addLocalMessage('warning', flash.warning);
    if (flash.info) addLocalMessage('info', flash.info);
  }, [flash]);

  // 2. Listen Event Custom dari Frontend (Wishlist, dll)
  useEffect(() => {
    const handleTrigger = (e: any) => {
      addLocalMessage(e.detail.type, e.detail.message);
    };

    window.addEventListener('trigger-toast', handleTrigger);
    return () => window.removeEventListener('trigger-toast', handleTrigger);
  }, []);

  // Fungsi pembantu untuk menambah pesan
  const addLocalMessage = (type: MessageItem['type'], message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setLocalMessages((prev) => [...prev, { type, message, id }]);

    // Hapus otomatis setelah 5 detik
    setTimeout(() => {
      removeMessage(id);
    }, 5000);
  };

  const removeMessage = (id: string) => {
    setLocalMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  if (localMessages.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-3">
      {localMessages.map((msg) => {
        const config = {
          success: { icon: CheckCircle, bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' },
          error: { icon: XCircle, bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200' },
          warning: { icon: AlertCircle, bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200' },
          info: { icon: Info, bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
        }[msg.type];

        const Icon = config.icon;

        return (
          <div
            key={msg.id}
            className={`flex items-center p-4 rounded-xl border shadow-xl min-w-[320px] max-w-md animate-in slide-in-from-right-5 fade-in duration-300 ${config.bg} ${config.text} ${config.border}`}
          >
            <Icon className="h-5 w-5 flex-shrink-0 mr-3" />
            <div className="flex-1 text-sm font-bold">{msg.message}</div>
            <button onClick={() => removeMessage(msg.id)} className="ml-3 p-1 hover:bg-black/5 rounded-lg">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}