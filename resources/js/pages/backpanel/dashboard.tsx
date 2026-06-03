import HeaderTitle from '@/components/header-title';
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
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
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
import  { CountryData, RegionData } from '@/components/traffic-per-country-region';
import { formatCurrencyDisplay } from '@/utils/currency';
import { formatDate } from '@/lib/utils';
import TrafficVisitorCharts from '@/components/traffic-visitor-charts';
import { useEffect, useState } from 'react';
import axios from 'axios';

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
  countryStats: CountryData[];
  regionStats: RegionData[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: dashboard().url,
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
  countryStats,
  regionStats,
}: Props) {

    const [recentOrdersStats, setRecentOrders] = useState<any[]>([]);
  
    useEffect(() => {
  
      const fetchRecentOrders = async () => {
  
        try {
  
          const response = await axios.get(
            '/cpanel/dashboard/recent-orders'
          );
  
          setRecentOrders(
            response.data.recentOrders || []
          );
  
        } catch (error) {
  
          console.error(
            'Failed fetch recent orders',
            error
          );
        }
      };
  
      /*
      |--------------------------------------------------------------------------
      | Initial Fetch
      |--------------------------------------------------------------------------
      */
  
      fetchRecentOrders();
  
      /*
      |--------------------------------------------------------------------------
      | Polling
      |--------------------------------------------------------------------------
      */
  
      const interval = setInterval(
        fetchRecentOrders,
        10000
      );
  
      /*
      |--------------------------------------------------------------------------
      | Cleanup
      |--------------------------------------------------------------------------
      */
  
      return () => clearInterval(interval);
  
    }, []);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="space-y-4 p-6 min-h-screen">
        {/* Header Section dengan Aksi Cepat */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <HeaderTitle
            title="Dashboard"
            description="Pantau performa aktivitas bisnis Anda hari ini."
          />
          <div className="flex items-center gap-2">
            {/* Tambahkan button aksi global jika perlu, misal: Export Report */}
          </div>
        </div>

        {/* Top Stats Overview - Lebih Bersih */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {stats.map((stat) => {
            const Icon = iconMap[stat.icon] || Package;

            return (
              <Link href={stat.link} key={stat.name}>
                <Card
                  className="
                    group relative h-full overflow-hidden
                    border border-slate-200/80
                    bg-white
                    shadow-sm
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:shadow-xl
                  "
                >
                  {/* Accent Line */}
                  <div
                    className={`
                      absolute left-0 top-0 bottom-0 w-1
                      ${stat.color}
                      opacity-80
                    `}
                  />

                  {/* Bubble Accent Layers */}
                  <div className="pointer-events-none absolute inset-0 overflow-hidden">

                    {/* Big Bubble */}
                    <div
                      className={`
                        absolute -right-10 -top-10
                        h-42 w-42 rounded-full
                        ${stat.color}
                        opacity-[0.08]
                        blur-xl
                        transition-all duration-700 ease-out
                        group-hover:scale-150
                        group-hover:-translate-y-2
                        group-hover:translate-x-2
                      `}
                    />

                    {/* Icon Bubble */}
                    <div
                      className={`
                        flex items-center justify-center
                        absolute top-4 right-4
                        rounded-2xl
                        h-8 w-8
                        ${stat.color} bg-opacity-10
                        transition-all duration-500 ease-out
                        group-hover:rotate-[12deg]
                        group-hover:scale-125
                      `}
                    >
                      <Icon
                        className={`
                          h-4 w-4
                          ${stat.color.replace('bg-', 'text-')}
                        `}
                      />
                    </div>

                    {/* Medium Bubble */}
                    <div
                      className={`
                        absolute right-6 bottom-4
                        h-20 w-20 rounded-full
                        ${stat.color}
                        opacity-[0.06]
                        blur-xl
                        transition-all duration-700 ease-out
                        group-hover:scale-150
                        group-hover:translate-y-3
                        group-hover:-translate-x-2
                      `}
                    />

                    {/* Small Bubble */}
                    <div
                      className={`
                        absolute top-1 right-1
                        h-24 w-24 rounded-full
                        ${stat.color}
                        opacity-[0.1]
                        blur-md
                        transition-all duration-700 ease-out
                        group-hover:scale-125
                        group-hover:translate-x-1
                      `}
                    />

                    {/* Tiny Bubble */}
                    <div
                      className={`
                        absolute -top-5 -right-8
                        h-24 w-24 rounded-full
                        ${stat.color}
                        opacity-[0.09]
                        transition-all duration-700 ease-out
                        group-hover:scale-140
                        group-hover:-translate-y-2
                      `}
                    />

                    {/* Extra Bubble */}
                    <div
                      className={`
                        absolute top-4 -right-8
                        h-32 w-32 rounded-full
                        ${stat.color}
                        opacity-[0.07]
                        transition-all duration-700 ease-out
                        group-hover:scale-125
                        group-hover:translate-x-2
                      `}
                    />

                  </div>

                  <CardContent className="relative z-10">
                    {/* Content */}
                    <div className="space-y-1">
                      <p
                        className="
                          line-clamp-2 min-h-[34px]
                          text-[10px] font-bold uppercase
                          tracking-[0.2em]
                          text-slate-500
                        "
                      >
                        {stat.name}
                      </p>

                      <h3
                        className="
                          text-2xl font-black
                          text-slate-900
                          sm:text-3xl
                          xl:text-4xl

                          transition-all duration-300
                          group-hover:tracking-tighter
                        "
                      >
                        {stat.value.toLocaleString()}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-4 xl:grid-cols-3">
          
          {/* Table Section (Lebih Lebar) */}
          <div className="xl:col-span-2 min-w-0">
            <Card className="border-none gap-0 shadow-sm ring-1 ring-slate-200 min-h-[370px] p-0 overflow-hidden">
              <CardHeader className="flex flex-col bg-slate-800 md:flex-row items-center justify-between space-y-0 py-4">
                <div>
                  <CardTitle className="text-lg font-bold text-orange-300">Daftar Pesanan Terbaru</CardTitle>
                  <p className="text-sm text-slate-300">Pesanan terbaru 24 jam terakhir</p>
                </div>
                <div className="relative">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/cpanel/crm/orders">Lihat Semua <ArrowRight className="h-4 w-4 ml-1 inline-block" /></Link>
                </Button>
                {recentOrdersStats.length > 0 && (
                  <Badge className="absolute animate-pulse -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-600">
                    {recentOrdersStats.length}
                  </Badge>
                )}
              </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full overflow-x-auto">
                  <Table className="w-full min-w-[200px] -mt-2">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="pt-7 pb-4 pl-6 text-xs uppercase tracking-wider font-semibold">ID Pesanan</TableHead>
                        <TableHead className="pt-7 pb-4 text-xs uppercase tracking-wider font-semibold">Pelanggan</TableHead>
                        <TableHead className="pt-7 pb-4 text-xs uppercase tracking-wider font-semibold">Detail Produk</TableHead>
                        <TableHead className="pt-7 pb-4 text-xs uppercase tracking-wider font-semibold">Status</TableHead>
                        <TableHead className="pt-7 pb-4 text-right pr-6 text-xs uppercase tracking-wider font-semibold">Total Nilai</TableHead>
                      </TableRow>
                    </TableHeader>
                    
                    <TableBody>
                      {recentOrdersStats.length > 0 ? (
                        recentOrdersStats.map((order: any) => (
                          <TableRow 
                            key={order.id} 
                            onClick={() => window.location.href = `/cpanel/crm/orders/${order.id}`} 
                            className="group hover:bg-slate-50/80 transition-all cursor-pointer border-b"
                          >
                            {/* ID Pesanan */}
                            <TableCell className="pl-6 space-y-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700">
                                #{order.order_number}
                              </span>
                              <span className="text-xs pl-1 text-slate-400 flex items-center gap-1">
                                <Calendar1 className="h-3 w-3 ml-1" /> {formatDate(order.created_at)}
                              </span>
                            </TableCell>

                            {/* Pelanggan */}
                            <TableCell>
                              <div className="flex items-start gap-3">
                                <div className="flex flex-col">
                                  <span className="font-semibold text-slate-900 leading-none mb-1">{order.company_name}</span>
                                  <div className="flex flex-col gap-0.5">
                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                      <User className="h-3 w-3" /> {order.pic_name}
                                    </span>
                                    <span className="text-[11px] text-slate-400 italic font-light">{order.phone}</span>
                                  </div>
                                </div>
                              </div>
                            </TableCell>

                            {/* Produk & Catatan */}
                            <TableCell className="max-w-[250px]">
                              <div className="flex flex-col">
                                <span className="font-medium text-slate-800">{order.product_name}</span>
                                <span className="text-xs text-slate-500">
                                  {order.quantity} Unit &times; {formatCurrencyDisplay(order.product_price)}
                                </span>
                                
                                {order.notes && (
                                  <div className="mt-2 text-wrap p-1 bg-amber-50/50 border-l-2 border-amber-200 rounded text-[11px] text-amber-800 leading-relaxed italic">
                                    &ldquo;{order.notes}&rdquo;
                                  </div>
                                )}
                              </div>
                            </TableCell>

                            {/* Status */}
                            <TableCell>
                              <OrderStatusBadge status={order.status} />
                            </TableCell>

                            {/* Total Harga */}
                            <TableCell className="text-right pr-6">
                              <div className="flex flex-col items-end">
                                <span className="font-bold text-slate-900 text-base">
                                  {formatCurrencyDisplay(order.total_price)}
                                </span>
                                {/* <span className="text-[10px] text-slate-400 uppercase font-medium">Pembayaran Selesai</span> */}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-64 text-center">
                            <div className="flex flex-col items-center justify-center space-y-3 opacity-60">
                              <div className="p-4 rounded-full bg-slate-50">
                                <ShoppingBag className="h-8 w-8 text-slate-300" />
                              </div>
                              <div>
                                <p className="text-base font-semibold text-slate-900">Belum Ada Pesanan</p>
                                <p className="text-sm text-slate-500">Daftar transaksi pelanggan akan tampil di sini.</p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Content: Top Searched & Latest */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm ring-1 ring-slate-200">
              <CardHeader>
                <CardTitle className="text-base font-bold">Produk Paling Banyak Dilihat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 min-h-67">
                {topSearchedProducts.length > 0 ? (
                  topSearchedProducts.map((product) => (
                    <div onClick={() => window.location.href = `/cpanel/cms/product/${product.id}`} key={product.id} className="flex items-center justify-between group pb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center overflow-hidden">
                          {product.image_path ? (
                            <img 
                              src={product.image_path} 
                              alt={product.name}
                              className="h-12 w-12 rounded object-cover"
                            />
                          ) : (
                            <span className="font-bold text-slate-400 text-xs">IMG</span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold group-hover:text-primary transition-colors cursor-pointer">{product.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{product.searches} Dilihat</p>
                        </div>
                      </div>
                      {/* <div className={`text-xs font-bold ${product.change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                        {product.change}
                      </div> */}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col min-h-52 items-center justify-center py-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">Belum ada data pencarian</p>
                    <p className="text-xs text-slate-400 mt-1">Produk yang dicari akan muncul di sini</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>

        {/* traffic Visitors */}
        <TrafficVisitorCharts
          websiteTrafficData={websiteTrafficData}
          countryStats={countryStats}
          regionStats={regionStats}
        />
      </div>
    </AppLayout>
  );
}
