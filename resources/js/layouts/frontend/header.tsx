import { useState, useEffect, useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
  Phone, Mail, X, Heart, Menu, LogInIcon, LayoutDashboardIcon 
} from 'lucide-react';

import { useWishlist } from '@/hooks/useWishlist';
import { CONTACT_INFO } from '@/constants/navigation';
import { Button } from '@/components/ui/button';
import { dashboard, login } from '@/routes';
import Wishlist from '@/components/wishlist';
import { useConfig } from '@/utils/config';
import { handleImageError } from '@/utils/image';

// --- Sub-Components ---

const NavItem = ({ link, onClick }: { link: any, onClick: (e: any, id: string) => void }) => (
  <a
    href={link.href}
    onClick={(e) => onClick(e, link.id)}
    className="rounded-full border-2 border-white hover:border-orange-300 font-bold px-3 py-1.5 xl:px-5 text-sm xl:text-base text-gray-900 hover:text-orange-600 hover:bg-orange-400/20 dark:text-gray-300 transition-colors cursor-pointer"
  >
    {link.name}
  </a>
);

export default function Header() {
  const { auth, url } = usePage().props as any;
  const { getConfig } = useConfig();
  const { wishlist, removeFromWishlist } = useWishlist();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const isHomepage = url === '/';
  const isCatalog = url === '/catalog';

  // Memoized values
  const logoImage = getConfig('/storage/site_logo', '/images/logo-main.png');
  const navLinks = useMemo(() => [
    { name: 'Beranda', id: 'home', href: isHomepage ? '#' : '/' },
    { name: 'Layanan', id: 'services', href: isHomepage ? '#' : '/#services' },
    { name: 'Produk', id: 'products', href: isCatalog ? '#' : '/catalog' },
    { name: 'Artikel', id: 'article', href: isHomepage ? '#' : '/#article' },
    { name: 'Kontak', id: 'contact', href: isHomepage ? '#' : '/#contact' }
  ], [isHomepage, isCatalog]);

  // Handlers
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (e: React.MouseEvent, id: string) => {
    if (isHomepage && id !== 'products') {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        const y = element.getBoundingClientRect().top + window.pageYOffset - 70;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
      setIsMenuOpen(false);
    }
  };

  const whatsappUrl = `https://wa.me/${getConfig('contact_whatsapp', '6281282336464').replace(/\D/g, '')}?text=${getConfig('whatsapp_message', 'Halo%20Alumoda%2C%20saya%20ingin%20bertanya')}`;

  return (
    <>
      <Wishlist
        isOpen={isWishlistOpen} 
        onClose={() => setIsWishlistOpen(false)}
        items={wishlist}
        onRemove={removeFromWishlist}
      />
      
      <header className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
        
        {/* 1. Top Bar */}
        <div className="bg-primary text-white py-1">
          <div className="container mx-auto px-4 flex justify-between items-center text-sm">
            
            <div className="flex items-center space-x-2 overflow-hidden">
              <a
                href={`tel:${getConfig('contact_phone', CONTACT_INFO.phone).replace(/\D/g, '')}`}
                className="flex items-center hover:text-yellow-300 truncate"
              >
                <Phone className="h-3 w-3 mr-1" />
                <span className="inline text-xs">
                  {getConfig('contact_phone', CONTACT_INFO.phone)}
                </span>
              </a>

              <a
                href={`mailto:${getConfig('contact_email', CONTACT_INFO.email)}`}
                className="flex items-center hover:text-yellow-300 truncate max-w-16 md:max-w-full"
              >
                <Mail className="h-3 w-3 mr-1" />
                <span className="inline text-xs">
                  {getConfig('contact_email', CONTACT_INFO.email)}
                </span>
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={auth?.user ? dashboard() : login()}
                className="md:px-6 py-1 hover:text-yellow-300 transition-colors"
              >
                {auth?.user
                  ? 'Dashboard'
                  : <LogInIcon className="h-4 w-4" />
                }
              </Link>

            </div>
          </div>
        </div>

        {/* 2. Main Navbar */}
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              
              {/* Logo */}
              <Link href="/" className="flex-shrink-0">
                <img
                  src={logoImage}
                  alt="Logo"
                  className="h-13 xl:h-16 w-auto object-contain"
                  onError={(e) => handleImageError(e, '/images/logo-main.png', 'Logo')}
                />
              </Link>

              {/* Desktop Nav Links */}
              <div className="hidden lg:flex items-center space-x-2">
                {navLinks.map((link) => (
                  <NavItem key={link.id} link={link} onClick={handleScrollTo} />
                ))}
              </div>

              {/* Action Buttons (Desktop & Mobile Wishlist) */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button 
                  onClick={() => setIsWishlistOpen(true)}
                  className="relative p-2 rounded-full border cursor-pointer hover:border-orange-300 text-gray-700 hover:text-primary dark:text-white transition-transform active:scale-90"
                >
                  <Heart className="h-5 w-5" />
                  {wishlist.length > 0 && (
                    <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                <div className="hidden lg:flex items-center space-x-3">
                  <Button asChild className="flex h-10 items-center px-5 rounded-full border border-orange-200 bg-orange-50 text-orange-700 text-sm font-semibold hover:bg-orange-100 transition-colors gap-2">
                    <a href={whatsappUrl}>
                      <Phone className="h-4 w-4" />
                      Hubungi Kami
                    </a>
                  </Button>
                  <Link
                    href="/catalog"
                    className="flex h-10 items-center px-5 rounded-full border border-slate-700 bg-slate-800 text-white text-sm font-semibold hover:bg-slate-900 transition-colors gap-2"
                  >
                    <LayoutDashboardIcon className="h-4 w-4" />
                    Katalog
                  </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                  className="lg:hidden p-2 text-gray-700 dark:text-white"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* 3. Mobile Menu Dropdown */}
          <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[500px] border-t' : 'max-h-0'}`}>
            <div className="p-4 space-y-3 bg-gray-50 dark:bg-gray-800">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.id)}
                  className="block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-white rounded-lg transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <hr className="border-gray-200 dark:border-gray-700" />
              <Button asChild className="w-full justify-start py-6 text-lg">
                <a href={whatsappUrl}>
                  <Phone className="mr-3 h-5 w-5" />
                  Hubungi Kami
                </a>
              </Button>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}