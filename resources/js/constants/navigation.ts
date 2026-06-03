// resources/js/constants/navigation.ts
export const NAV_LINKS = [
  { name: 'Beranda', href: '/' },
  { name: 'Layanan', href: '/#services' },
  { name: 'Katalog Produk', href: '/#products' },
  { name: 'Artikel', href: '/#article' },
  { name: 'Kontak', href: '/#contact' },
  { name: 'Sitemap', href: '/sitemap' }
];

export const SOCIAL_LINKS = [
  { name: 'Facebook', icon: 'Facebook', href: '#' },
  { name: 'Instagram', icon: 'Instagram', href: '#' },
  { name: 'LinkedIn', icon: 'Linkedin', href: '#' },
  { name: 'Twitter', icon: 'X', href: '#' }
];

export const CONTACT_INFO = {
  phone: '+62 123 4567 890',
  whatsapp: '6281282336464',
  email: 'info@company.com',
  address: 'Jl. Contoh No. 123, Jakarta Selatan, DKI Jakarta 12345'
};

export type NavLink = {
  name: string;
  href: string;
};

export type SocialLink = {
  name: string;
  icon: string;
  href: string;
};

export type ContactInfo = {
  phone: string;
  email: string;
  address: string;
};