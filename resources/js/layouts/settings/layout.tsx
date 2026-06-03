import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn, isSameUrl, resolveUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/settings/appearance';
import { edit as editPassword } from '@/routes/settings/password';
import { edit } from '@/routes/settings/profile';
import { show } from '@/routes/settings/two-factor';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
  {
    title: 'Profil',
    href: edit(),
    icon: null,
  },
  {
    title: 'Kata Sandi',
    href: editPassword(),
    icon: null,
  },
  // {
  //   title: 'Autentikasi Dua Faktor',
  //   href: show(),
  //   icon: null,
  // },
  // {
  //   title: 'Tampilan',
  //   href: editAppearance(),
  //   icon: null,
  // },
  {
    title: 'Konfigurasi Situs',
    href: '/cpanel/settings/configuration/site',
    icon: null,
  },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
  // When server-side rendering, we only render the layout on the client...
  if (typeof window === 'undefined') {
    return null;
  }

  const currentPath = window.location.pathname;

  return (
    <div className="px-4 py-6">
      <Heading title="Pengaturan" description="Kelola profil dan pengaturan akun Anda" />

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {sidebarNavItems.map((item, index) => (
            <Link
              key={`${resolveUrl(item.href)}-${index}`}
              href={item.href}
              className={cn(
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                isSameUrl(currentPath, item.href)
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>

      {/* Content Section */}
      <section className="space-y-12 px-4">{children}</section>
    </div>
  );
}
