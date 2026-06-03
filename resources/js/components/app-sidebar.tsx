import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavGroupItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
  Activity,
  BarChart,
  BookmarkCheck,
  BookOpen,
  FileText,
  Folder,
  HandHeart,
  HandshakeIcon,
  LayoutGrid,
  ListOrdered,
  Lock,
  MessageCircleQuestion,
  MessageSquare,
  Settings,
  Shield,
  ShieldEllipsis,
  ShoppingCart,
  StarIcon,
  Tag,
  UserCircle,
  Users,
  UsersIcon,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavGroups: NavGroupItem[] = [
  {
    group: {
      title: '',
      items: [
        {
          title: 'Dashboard',
          href: '/cpanel',
          icon: LayoutGrid,
        },
        {
          title: 'Daftar Pesanan',
          href: '/cpanel/crm/orders',
          icon: ShoppingCart,
          permission: 'order-list',
        },
        {
          title: 'Posting Artikel',
          href: '/cpanel/cms/article',
          icon: FileText,
          permission: 'article-list',
        },
        {
          title: 'Produk',
          href: '/cpanel/cms/product?status=published',
          icon: LayoutGrid,
          permission: 'product-list',
        },
        {
          title: 'Pelanggan',
          href: '/cpanel/crm/customer',
          icon: Users,
          permission: 'customer-list',
        },
        {
          title: 'Klien',
          href: '/cpanel/cms/client',
          icon: HandshakeIcon,
          permission: 'client-list',
        },
        {
          title: 'Merek',
          href: '/cpanel/cms/brand',
          icon: Tag,
          permission: 'brand-list',
        },
        {
          title: 'Layanan',
          href: '/cpanel/cms/service',
          icon: HandHeart,
          permission: 'service-list',
        },
        {
          title: 'Kategori',
          href: '/cpanel/cms/category',
          icon: Folder,
          permission: 'category-list',
        },
        // {
        //   title: 'Tag',
        //   href: '/cpanel/cms/tag',
        //   icon: BookmarkCheck,
        //   permission: 'tag-list',
        // },
        {
          title: 'FAQ',
          href: '/cpanel/cms/faq',
          icon: MessageCircleQuestion,
          permission: 'faq-list',
        },
        {
          title: 'Ulasan',
          href: '/cpanel/cms/testimonial',
          icon: StarIcon,
          permission: 'testimonial-list',
        },
        {
          title: 'Akun Pengguna',
          href: '/cpanel/authorization/user-management',
          icon: UsersIcon,
          permission: 'user-list',
        },
        {
          title: 'Peran',
          href: '/cpanel/authorization/roles',
          icon: UserCircle,
          permission: 'role-list',
        },
        {
          title: 'Hak Akses',
          href: '/cpanel/authorization/permissions',
          icon: Shield,
          permission: 'permission-list',
        },
        {
          title: 'Pengaturan',
          href: '/cpanel/settings/configuration/site',
          icon: Settings,
          permission: 'setting-configuration-list',
        }
      ],
    }
  }
];

const footerNavItems: NavItem[] = [
  {
    title: 'Repository',
    href: 'https://github.com/laravel/react-starter-kit',
    icon: Folder,
  },
  {
    title: 'Documentation',
    href: 'https://laravel.com/docs/starter-kits#react',
    icon: BookOpen,
  },
];

interface AppSidebarProps {
  recentOrders?: any[];
}

export function AppSidebar({ recentOrders = [] }: AppSidebarProps) {
  const { auth } = usePage<SharedData>().props;
  const userPermissions = auth.permissions || [];

  // Count new orders (pending status)
  const newOrdersCount = recentOrders.filter(order => order.status === 'pending').length;

  // Filter menu items based on user permissions
  const filteredNavGroups = mainNavGroups.map(({ group }) => ({
    group: {
      ...group,
      items: group.items.filter(item => {
        // If no permission is required, show the item
        if (!item.permission) return true;
        // Show item if user has the required permission
        return userPermissions.includes(item.permission);
      })
    }
  }));

  return (
    <Sidebar collapsible="icon" variant="inset" className="bg-slate-900">
      <SidebarHeader className="bg-slate-900">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-slate-900" size="lg" asChild>
              <Link href={dashboard()} prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="-space-y-2! bg-slate-900">
        {filteredNavGroups.map(({ group }, index) => (
          <NavMain key={index} items={group.items} groupTitle={group.title} newOrdersCount={newOrdersCount} />
        ))}
      </SidebarContent>

      <SidebarFooter className='bg-slate-900'>
        {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
