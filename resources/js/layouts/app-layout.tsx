import { type BreadcrumbItem, type SharedData } from '@/types';
import { type PropsWithChildren } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { usePage } from '@inertiajs/react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';

interface AppLayoutProps {
  breadcrumbs?: BreadcrumbItem[];
  navMenu?: any[];
  appName?: string;
  appSublabel?: string;
}

export default function AppLayout({
  children,
  breadcrumbs = [],
  navMenu,
  appName,
  appSublabel,
}: PropsWithChildren<AppLayoutProps>) {
  const { sidebarMenu, auth } = usePage<SharedData>().props;

  // Gunakan props jika ada, atau fallback ke Inertia shared props
  const finalNavMenu = navMenu || sidebarMenu?.navMain || [];
  const finalAppName = appName || sidebarMenu?.appName || 'App System';
  const finalAppSublabel = appSublabel || sidebarMenu?.appSublabel || 'Dashboard';

  return (
    <SidebarProvider>
      <TooltipProvider>
        <AppSidebar 
          navMain={finalNavMenu} 
          appName={finalAppName} 
          appSublabel={finalAppSublabel}
          user={auth?.user}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
            </div>
            <AppearanceToggleDropdown />
          </header>
          <div className="flex flex-1 flex-col bg-slate-200 gap-4">
            {children}
          </div>
        </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  );
}