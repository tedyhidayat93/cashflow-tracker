import AppLogoIcon from '@/components/app-logo-icon';
import { homepage } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import BgHero from '@/assets/images/bg-hero.png';
import LogoMainSquare from '@/assets/images/logo-main-square.png';
import { handleImageError } from '@/utils/image';

interface AuthLayoutProps {
  title?: string;
  description?: string;
}

export default function AuthSplitLayout({
  children,
  title,
  description,
}: PropsWithChildren<AuthLayoutProps>) {
  const { name, quote, siteconfig } = usePage<SharedData>().props;

  // Get configuration values from database
  const getHomepageConfig = (key: string, defaultValue: string = '') => {
    const config = siteconfig?.find((c) => c.key === key && c.group === 'view_homepage');
    return config?.value || defaultValue;
  };

  const homepageLogo = getHomepageConfig('site_logo');
  const homepageLogoAlt = getHomepageConfig('homepage_logo_alt', 'Company Logo');
  const homepageBgImage = getHomepageConfig('homepage_bg_image');
  const homepageTagline = getHomepageConfig('site_tagline', 'Solusi Terpercaya Untuk Kebutuhan Kontainer Anda');

  return (
    <div className="relative min-h-dvh overflow-hidden bg-black">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${
            homepageBgImage
              ? `/storage/${homepageBgImage}`
              : BgHero
          })`,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content Wrapper */}
      <div className="relative z-10 flex min-h-dvh">
        {/* Left Caption */}
        <div className="hidden lg:flex flex-1 flex-col p-12 text-white">
          <Link
            href={homepage()}
            className="flex items-center text-lg font-semibold tracking-wide"
          >
            {name}
          </Link>
          <small>{homepageTagline}</small>

          {quote && (
            <div className="mt-auto max-w-xl">
              <blockquote className="space-y-4">
                <p className="text-3xl font-semibold leading-relaxed text-white">
                  &ldquo;{quote.message}&rdquo;
                </p>

                <footer className="text-sm text-white/80">
                  {quote.author}
                </footer>
              </blockquote>
            </div>
          )}
        </div>

        {/* Right Login Card */}
        <div className="flex w-full items-center justify-center p-6 lg:w-[520px] lg:justify-end lg:pr-16">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-4 md:p-8 shadow-2xl backdrop-blur-md">
            <Link
              href={homepage()}
              className="mb-4 flex items-center justify-center"
            >
              {homepageLogo ? (
                <img
                  src={`/storage/${homepageLogo}`}
                  onError={handleImageError}
                  className="size-20 object-contain"
                  alt={homepageLogoAlt}
                />
              ) : (
                <img
                  src={LogoMainSquare}
                  onError={handleImageError}
                  className="size-20 object-contain"
                  alt="PT Alumoda Sinergi Kontainer Indonesia"
                />
              )}
            </Link>

            <div className="mb-10 flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold leading-tight text-gray-900">
                {title}
              </h1>

              <p className="max-w-sm text-sm leading-relaxed text-gray-500">
                {description}
              </p>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
