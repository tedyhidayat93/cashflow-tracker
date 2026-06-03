import { useConfig } from '@/utils/config';
import { handleImageError } from '@/utils/image';

export default function AppLogo() {
  const { getConfig } = useConfig();
  const siteLogo = getConfig('site_favicon', '/images/logo-main-square.png');
  const siteName = getConfig('site_name', 'Alumoda Sinergi Kontainer Indonesia');

  // Add storage prefix if it's a stored file
  const logoSrc = siteLogo.startsWith('configurations/') ? `/storage/${siteLogo}` : siteLogo;

  return (
    <>
      <div className="text-sidebar-primary-foreground flex aspect-square size-9 items-center justify-center rounded-md bg-white/10">
        <img 
          src={logoSrc} 
          className="size-9 fill-current text-white dark:text-black" 
          onError={(e) => handleImageError(e, '/images/logo-main-square.png', 'Site logo')}
        />
      </div>
      <div className="ml-1 grid flex-1 text-left text-sm">
        <span className="mb-0.5 truncate leading-tight font-semibold text-orange-400">Admin Panel</span>
        <span className="text-muted dark:text-white/50 truncate text-xs">
          {siteName}
        </span>
      </div>
    </>
  );
}
