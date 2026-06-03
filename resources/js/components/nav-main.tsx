import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface NavMainProps {
  items: NavItem[];
  groupTitle: string;
  newOrdersCount?: number;
}

interface NavItemWithActive extends NavItem {
  isOpen?: boolean;
}

export function NavMain({ items, groupTitle, newOrdersCount }: NavMainProps) {
  const { url } = usePage();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [isGroupOpen, setIsGroupOpen] = useState(groupTitle === 'CMS');

  const isActive = (href: string) => {
    // Exact match for dashboard
    if (href === '/cpanel') {
      return url === href;
    }
    
    // For settings pages, check if it starts with /cpanel/settings/
    if (href.includes('/settings/')) {
      return url.startsWith('/cpanel/settings/') || url.startsWith(href);
    }
    
    // For other pages, check if URL starts with href or exact match
    return url.startsWith(href) || url === href;
  };

  const toggleItem = (href: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [href]: !prev[href],
    }));
  };

  const renderNavItem = (item: NavItemWithActive, level = 0) => {
    const hasChildren = item.items && item.items.length > 0;
    const isItemActive = isActive(item.href.toString()) || item.isActive;
    const isOpen = openItems[item.href.toString()] ?? isItemActive;

    return (
      <Collapsible
        key={item.href.toString()}
        open={isOpen}
        onOpenChange={() => toggleItem(item.href.toString())}
        className={cn(
          'transition-colors duration-200',
          isItemActive && '',
          level > 0 && 'border-border/20 ml-4 border-l-2'
        )}
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              asChild
              className={cn(
                'w-full',
                isItemActive
                  ? 'bg-primary dark:bg-accent-foreground font-semibold dark:text-black!'
                  : 'text-foreground hover:bg-white/10!'
              )}
            >
              <div className="flex w-full items-center justify-between">
                <Link
                  href={item.href}
                  className={cn(
                    'flex flex-1 items-center gap-2 text-sm',
                    'transition-colors duration-200',
                    isItemActive ? 'text-slate-800 font-bold' : 'text-accent/70 dark:text-white/70',
                    level > 0 && 'text-xs'
                  )}
                >
                  {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                  <span className="truncate">{item.title}</span>
                </Link>
                {/* Badge for new orders */}
                {
                  !newOrdersCount ? null : (
                    item.title === 'Daftar Pesanan' && newOrdersCount > 0 && (
                      <Badge className="animate-pulse h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-600">
                        {newOrdersCount}
                      </Badge>
                    )
                  )
                }
                {hasChildren && (
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform duration-200',
                      isOpen ? 'rotate-180' : ''
                    )}
                  />
                )}
              </div>
            </SidebarMenuButton>
          </CollapsibleTrigger>
          {hasChildren && (
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items?.map((subItem) => (
                  <SidebarMenuSubItem
                    key={subItem.href.toString()}
                    className={cn(
                      'border-border/20 ml-2 border-l-2',
                      isActive(subItem.href.toString()) && 'border-primary/50'
                    )}
                  >
                    <SidebarMenuSubButton asChild>
                      <Link
                        href={subItem.href}
                        className={cn(
                          'flex items-center gap-2 text-sm',
                          isActive(subItem.href.toString())
                            ? 'text-foreground font-medium'
                            : 'text-muted-foreground hover:text-foreground',
                          'transition-colors duration-200'
                        )}
                      >
                        {subItem.icon && <subItem.icon className="h-3.5 w-3.5 shrink-0" />}
                        <span className="truncate">{subItem.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          )}
        </SidebarMenuItem>
      </Collapsible>
    );
  };

  return (
    <SidebarGroup className="space-y-0">
      {groupTitle && (
        <Collapsible
          defaultOpen={groupTitle === 'CMS'}
          onOpenChange={setIsGroupOpen}
          className="space-y-0"
        >
          <CollapsibleTrigger asChild>
            <SidebarGroupLabel
              className={cn(
                'text-xxs! text-muted-foreground hover:bg-accent/50 flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 font-semibold transition-colors',
                isGroupOpen && 'mb-1'
              )}
            >
              <span>{groupTitle}</span>
              {isGroupOpen ? (
                <ChevronUp className="text-muted-foreground h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="text-muted-foreground h-3.5 w-3.5" />
              )}
            </SidebarGroupLabel>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenu className="space-y-0">
              {items.map((item) => renderNavItem(item))}
            </SidebarMenu>
          </CollapsibleContent>
        </Collapsible>
      )}
      {!groupTitle && (
        <SidebarMenu className="space-y-0">{items.map((item) => renderNavItem(item))}</SidebarMenu>
      )}
    </SidebarGroup>
  );
}
