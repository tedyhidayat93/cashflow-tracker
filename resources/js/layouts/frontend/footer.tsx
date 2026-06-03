import { Link } from '@inertiajs/react';
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Music, SquarePlay, Phone, MapPin, Mail, MessageCircle } from 'lucide-react';
import { NAV_LINKS, SOCIAL_LINKS, CONTACT_INFO, NavLink, SocialLink } from '@/constants/navigation';
import { useConfig } from '@/utils/config';
import { usePage } from '@inertiajs/react';

const socialIcons = {
  Facebook: Facebook,
  Instagram: Instagram,
  Linkedin: Linkedin,  // Changed from LinkedIn to match SOCIAL_LINKS
  X: Twitter,
  Youtube: Youtube,
  Tiktok: SquarePlay
};

export default function Footer() {
  const { getConfig } = useConfig();
  const { props } = usePage();
  const { footerProducts, footerArticles, footerServices } = props as any;
  
  // Handle cases where data might not be available yet
  const products = footerProducts || [];
  const articles = footerArticles || [];
  const services = footerServices || [];

  return (
    <footer className="bg-gray-950 text-white">
  <div className="container mx-auto px-4 py-14">

    {/* Top Section */}
    <div className="flex flex-col gap-6 border-b border-gray-800 pb-8 md:flex-row md:items-center md:justify-between">

      {/* Brand */}
      <div className="max-w-2xl">
        <h3 className="text-2xl font-bold leading-snug text-primary">
          {getConfig('site_name', 'PT. Alumoda Sinergi Kontainer Indonesia')}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-gray-400">
          {getConfig(
            'meta_description',
            'Solusi terpercaya untuk kebutuhan kontainer Anda dengan layanan profesional dan berkualitas.'
          )}
        </p>
      </div>

      {/* Social Media */}
      <div className="flex flex-wrap gap-3">
        {[
          { name: 'Facebook', icon: 'Facebook', href: getConfig('social_facebook', '') },
          { name: 'Twitter', icon: 'X', href: getConfig('social_twitter', '') },
          { name: 'Instagram', icon: 'Instagram', href: getConfig('social_instagram', '') },
          { name: 'YouTube', icon: 'Youtube', href: getConfig('social_youtube', '') },
          { name: 'TikTok', icon: 'Tiktok', href: getConfig('social_tiktok', '') }
        ]
          .filter((social) => social.href)
          .map((social) => {
            const Icon = socialIcons[social.icon as keyof typeof socialIcons];

            return (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-800 bg-gray-900 text-gray-400 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-white"
              >
                <Icon className="h-5 w-5" />
              </a>
            );
          })}
      </div>
    </div>

    {/* Main Footer Grid */}
    <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

      {/* Navigation */}
      <div>
        <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
          Navigasi
        </h4>

        <ul className="space-y-3">
          {NAV_LINKS.map((link: NavLink) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="text-sm text-gray-400 transition-colors hover:text-primary"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Services */}
      <div>
        <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
          Layanan
        </h4>

        <ul className="space-y-3">
          {services.map((service: any) => (
            <li key={service.id}>
              <Link
                href={`/layanan/${service.slug}`}
                className="text-sm text-gray-400 transition-colors hover:text-primary"
              >
                {service.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Products */}
      <div>
        <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
          Produk Unggulan
        </h4>

        <ul className="space-y-3">
          {products.slice(0, 8).map((product: any) => (
            <li key={product.id}>
              <Link
                href={`/catalog/${product.slug}`}
                className="line-clamp-1 text-sm text-gray-400 transition-colors hover:text-primary"
              >
                {product.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact */}
      <div>
        <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
          Kontak Kami
        </h4>

        <ul className="space-y-3 text-sm leading-relaxed text-gray-400">
          <li>
            <MapPin className="h-4 w-4 inline-block mr-2" />
            {getConfig('address', CONTACT_INFO.address)}
          </li>

          <li>
            <Mail className="h-4 w-4 inline-block mr-2" />
            {getConfig('contact_email', CONTACT_INFO.email)}
          </li>

          <li>
            <Phone className="h-4 w-4 inline-block mr-2" />
            {getConfig('contact_phone', CONTACT_INFO.phone)}
          </li>

          <li>
            <a
              href={`https://wa.me/${getConfig(
                'contact_whatsapp',
                CONTACT_INFO.whatsapp
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary transition-colors hover:text-primary/80"
            >
              <MessageCircle className="h-4 w-4 inline-block mr-2" />
              Hubungi via WhatsApp
            </a>
          </li>
        </ul>

        {/* Mini Maps */}
        <div className="mt-5 overflow-hidden rounded-xl border border-gray-800">
          {getConfig('google_maps_embed', '') ? (
            <div
              dangerouslySetInnerHTML={{
                __html: getConfig('google_maps_embed', '')
              }}
              className="h-40 w-full"
            />
          ) : (
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18..."
              width="100%"
              height="160"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="w-full"
              title="Google Maps"
            />
          )}
        </div>
      </div>
    </div>

    {/* Bottom */}
    <div className="mt-12 flex flex-col gap-3 border-t border-gray-800 pt-6 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
      <p>
        © {new Date().getFullYear()} {getConfig('site_name', 'Your Company')}
      </p>

      <p>
        {getConfig('site_tagline', 'Tagline')}
      </p>
    </div>
  </div>
</footer>
  );
}