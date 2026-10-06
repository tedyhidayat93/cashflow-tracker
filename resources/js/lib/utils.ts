import { Category } from '@/pages/backpanel/category/create';
import { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isSameUrl(
  url1: NonNullable<InertiaLinkProps['href']>,
  url2: NonNullable<InertiaLinkProps['href']>
) {
  return resolveUrl(url1) === resolveUrl(url2);
}

export function resolveUrl(url: NonNullable<InertiaLinkProps['href']>): string {
  return typeof url === 'string' ? url : url.url;
}

export function formatDate(date: string): string {
  const d = new Date(date);

  // Menggunakan Intl.DateTimeFormat untuk kontrol format yang presisi dan bersih
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Menggunakan format 24 jam
  }).format(d).replace(',', ''); // Menghapus koma bawaan toLocale standar
}

export const flattenCategories = (
  categories: Category[],
  level = 0
): { id: number; name: string; level: number }[] => {
  let result: any[] = [];

  categories.forEach((cat) => {
    result.push({
      id: cat.id,
      name: cat.name,
      level,
    });

    if (cat.children && cat.children.length > 0) {
      result = result.concat(flattenCategories(cat.children, level + 1));
    }
  });

  return result;
};