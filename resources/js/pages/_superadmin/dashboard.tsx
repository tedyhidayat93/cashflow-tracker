import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types/index';
import { Head, Link, usePage } from '@inertiajs/react';
import {
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Package,
  ShoppingCart,
  Users,
  XCircle,
  TrendingUp,
  MessageSquare,
  TrendingDown,
  StarIcon,
  Calendar,
  User,
  ShoppingBag,
  Calendar1,
  ArrowRight,
} from 'lucide-react';
import { OrderStatusBadge } from '@/utils/order-status';
import { Button } from '@/components/ui/button';
import { formatCurrencyDisplay } from '@/utils/currency';
import { formatDate } from '@/lib/utils';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PageHeader from '../apps/cashflow/_components/page-header';

// Type definitions
interface TrafficData {
  time?: string;
  date?: string;
  visitors: number;
}

interface WebsiteTrafficData {
  today: TrafficData[];
  thisMonth: TrafficData[];
  last3Months: TrafficData[];
  thisYear: TrafficData[];
}

type DateFilter = 'today' | 'thisMonth' | 'last3Months' | 'thisYear';

interface Props {
  stats: Array<{
    name: string;
    value: number;
    icon: string;
    change: string;
    color: string;
    link?: string;
    changeType: 'increase' | 'decrease';
  }>;
  orderStats: Array<{
    name: string;
    value: number;
    icon: string;
    color: string;
  }>;
  topSearchedProducts: Array<{
    id: number;
    name: string;
    searches: number;
    image_path: string | null;
    change: string;
  }>;
  latestProducts: Array<{
    id: number;
    name: string;
    sku: string;
    added: string;
    status: string;
    edit_url: string;
  }>;
  recentOrders: any[];
  websiteTrafficData: WebsiteTrafficData;
}


const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: "/cpanel/dashboard",
  },
];

// Icon mapping
const iconMap: Record<string, any> = {
  Package,
  FileText,
  Users,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  StarIcon,
  Calendar,
  MessageSquare,
  TrendingUp,
  TrendingDown,
};

export default function Dashboard({
  stats,
  orderStats,
  topSearchedProducts,
  latestProducts,
  // recentOrders,
  websiteTrafficData,
}: Props) {


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="space-y-4 p-6 min-h-screen">
        {/* Header Section dengan Aksi Cepat */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <PageHeader
            title="Dashboard"
            description="Pantau performa aktivitas bisnis Anda hari ini."
          />
          <div className="flex items-center gap-2">
            {/* Tambahkan button aksi global jika perlu, misal: Export Report */}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
