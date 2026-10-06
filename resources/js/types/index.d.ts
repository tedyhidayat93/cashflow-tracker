import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';
import { route as routeFn } from 'ziggy-js';

declare global {
    // Menjadikan route() tersedia secara global di lingkungan TypeScript
    var route: typeof routeFn;
}

export interface Auth {
  user: User;
  permissions: string[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  two_factor_enabled?: boolean;
  created_at: string;
  updated_at: string;
  [key: string]: unknown; // This allows for additional properties...
}

export interface BreadcrumbItem {
  title: string;
  href: string;
}

export interface MenuItem {
  title: string;
  url: string;
  icon?: string; // Nama icon dari Lucide
  isActive?: boolean;
  permission?: string;
  items?: MenuItem[];
}

export interface MenuGroup {
  title?: string;
  items: MenuItem[];
  [key: string]: unknown; 
}

export interface SharedData {
  [key: string]: unknown; 
  auth: {
    user: any;
    permissions?: string[];
  };
  // Props sidebar dinamis dari Config PHP / Inertia
  sidebarMenu?: {
    appName?: string;
    appSublabel?: string;
    navMain?: MenuItem[];
    projects?: {
      name: string;
      url: string;
      icon?: string;
    }[];
  };
}
