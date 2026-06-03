import { Category } from '@/pages/backpanel/category/create';
import { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper function to get container specifications
export interface ContainerSpec {
  label: string;
  value: string;
  note: string;
}

export const getContainerSpecs = (templateType: string): ContainerSpec[] => {
  const baseSpecs: ContainerSpec[] = [
    { label: 'height', value: '', note: 'Height (cm)' },
    { label: 'width', value: '', note: 'Width (cm)' },
    { label: 'length', value: '', note: 'Length (cm)' },
    { label: 'color', value: '', note: 'Color' }
  ];
  
  const standardSpecs: ContainerSpec[] = [
    ...baseSpecs,
    { label: 'cube', value: '', note: 'Cube Capacity' },
    { label: 'max_gross_weight', value: '', note: 'Max Gross Weight (kg)' },
    { label: 'tare_weight', value: '', note: 'Tare Weight (kg)' },
    { label: 'maximum_payload', value: '', note: 'Maximum Payload (kg)' },
    { label: 'inside_cubic_capacity', value: '', note: 'Inside Cubic Capacity' },
    { label: 'racking_test_load', value: '', note: 'Racking Test Load' }
  ];
  
  const reeferSpecs: ContainerSpec[] = [
    ...baseSpecs,
    { label: 'capacity', value: '', note: 'Capacity' },
    { label: 'max_gross_weight', value: '', note: 'Max Gross Weight (kg)' },
    { label: 'tare_weight', value: '', note: 'Tare Weight (kg)' }
  ];
  
  const tankSpecs: ContainerSpec[] = [
    ...baseSpecs,
    { label: 'capacity', value: '', note: 'Capacity' },
    { label: 'max_gross_weight', value: '', note: 'Max Gross Weight (kg)' },
    { label: 'tare_weight', value: '', note: 'Tare Weight (kg)' }
  ];
  
  switch (templateType) {
    case 'standar-container':
    case 'open-top':
    case 'flat-rack':
      return standardSpecs;
    case 'reefer':
      return reeferSpecs;
    case 'tank-container':
      return tankSpecs;
    case 'custom-container':
      return baseSpecs;
    default:
      return standardSpecs;
  }
};

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