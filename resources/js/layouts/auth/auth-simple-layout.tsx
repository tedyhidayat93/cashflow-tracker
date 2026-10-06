import { homepage } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
  name?: string;
  title?: string;
  description?: string;
}

export default function AuthSimpleLayout({
  children,
  title,
  description,
}: PropsWithChildren<AuthLayoutProps>) {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center gap-4">
            <Link href={homepage()} className="flex flex-col items-center gap-2 font-medium">
              <span className="sr-only">{title}</span>
            </Link>

            <div className="text-center">
              <img src="/images/logo-main.png" alt="Logo" className="mx-auto mb-4  w-24 h-auto" />
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="text-muted-foreground text-center text-sm">{description}</p>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
