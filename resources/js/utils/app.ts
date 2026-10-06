import { usePage } from '@inertiajs/react';

/**
 * Hook to get the application URL from environment variables
 */
export function useAppUrl() {
  const { props } = usePage() as any;
  return props.appUrl || '';
}

/**
 * Helper function to generate full URLs
 */
export function generateUrl(path: string, baseUrl?: string): string {
  const base = baseUrl || (usePage().props as any).appUrl || '';
  return `${base}${path}`;
}

/**
 * Helper function to generate blog URLs
 */
export function generateBlogUrl(slug: string, baseUrl?: string): string {
  const base = baseUrl || (usePage().props as any).appUrl || '';
  return `${base}/articles/${slug}`;
}

/**
 * Helper function to generate catalog URLs
 */
export function generateCatalogUrl(slug: string, baseUrl?: string): string {
  const base = baseUrl || (usePage().props as any).appUrl || '';
  return `${base}/catalog/${slug}`;
}

