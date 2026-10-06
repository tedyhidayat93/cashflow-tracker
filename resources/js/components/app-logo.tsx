import React from 'react';
import { Link } from '@inertiajs/react';
import { Command } from 'lucide-react';

interface AppLogoProps {
  name?: string;
  sublabel?: string;
  href?: string;
}

export default function AppLogo({
  name = 'Workspace',
  sublabel = 'Enterprise App',
  href = '/overview',
}: AppLogoProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 py-1.5 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
    >
      <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
        <img
          src="/images/logo-main.png"
          alt="Logo"
          width={32}
          height={32}
          className="rounded-lg"
        />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
        <span className="truncate font-bold text-sidebar-foreground">
          {name}
        </span>
        <span className="truncate text-xs text-sidebar-foreground/70">
          {sublabel}
        </span>
      </div>
    </Link>
  );
}