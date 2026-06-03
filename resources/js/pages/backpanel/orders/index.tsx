import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent} from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination } from '@/components/ui/pagination-custom';
import DateRangePicker from '@/components/ui/date-range-picker';
import OrderStatusInfoModal from '@/components/order-status-info-modal';
import AppLayout from '@/layouts/app-layout';
import HeaderTitle from '@/components/header-title';
import { type DateRange } from 'react-day-picker';
import { type BreadcrumbItem } from '@/types';
import { setDateParam } from "@/utils/date";
import { 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Search, 
  Filter,
  Eye,
  Package,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  ShoppingCart,
  RefreshCw
} from 'lucide-react';
import { orderStatusColors, orderStatusLabels, getOrderStatusBadgeProps, OrderStatusBadge } from '@/utils/order-status';
import { formatCurrencyDisplay } from '@/utils/currency';
import { formatDate } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { handleImageError } from '@/utils/image';

interface Order {
  id: number;
  order_number: string;
  company_name: string;
  pic_name: string;
  phone: string;
  email?: string;
  address: string;
  province: string;
  regency: string;
  district: string;
  village: string;
  postal_code: string;
  notes?: string;
  product_id: number;
  product_name: string;
  product_category: string;
  product_image: string;
  product_price: number;
  quantity: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  status_label: string;
  status_color: string;
  customer?: {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
}

interface PaginatedOrders {
  data: Order[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

interface OrderStatistic {
  name: string;
  value: number;
  icon: string;
  color: string;
}

interface Props {
  orders: PaginatedOrders;
  orderStatistics: OrderStatistic[];
  filters: {
    search?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
    per_page?: string;
  };
}

export default function OrderIndex({ orders, orderStatistics, filters }: Props) {
  const [search, setSearch] = React.useState(filters.search || '');
  const [statusFilter, setStatusFilter] = React.useState(filters.status || 'all');
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: filters.date_from ? new Date(filters.date_from) : undefined,
    to: filters.date_to ? new Date(filters.date_to) : undefined,
  });
  const [perPageFilter, setPerPageFilter] = React.useState(filters.per_page || '5');

  const hasActiveFilters = search || statusFilter !== 'all' || dateRange.from || dateRange.to;

  // Map backend statistics to frontend format with icon components
  const orderStats = orderStatistics.map(stat => ({
    ...stat,
    value: stat.value.toLocaleString(),
    icon: getIconComponent(stat.icon)
  }));

  // Helper function to map icon strings to components
  function getIconComponent(iconName: string) {
    const iconMap: Record<string, any> = {
      'shopping-cart': ShoppingCart,
      'clock': Clock,
      'check-circle': CheckCircle,
      'package': Package,
      'x-circle': XCircle,
      'file-text': FileText
    };
    return iconMap[iconName] || FileText;
  }

  const handleSearch = (value: string) => {
    setSearch(value);
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    if (statusFilter !== 'all') params.set('status', statusFilter);
    setDateParam(params, 'date_from', dateRange.from);
    setDateParam(params, 'date_to', dateRange.to);
    
    router.get(`/cpanel/crm/orders?${params.toString()}`, {}, { preserveState: true });
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    const params = new URLSearchParams(window.location.search);
    if (search) params.set('search', search);
    if (value !== 'all') {
      params.set('status', value);
    } else {
      params.delete('status');
    }
    setDateParam(params, 'date_from', dateRange.from);
    setDateParam(params, 'date_to', dateRange.to);
    
    router.get(`/cpanel/crm/orders?${params.toString()}`, {}, { preserveState: true });
  };

  
  const handlePerPageFilter = (value: string) => {
    setPerPageFilter(value);
    const params = new URLSearchParams(window.location.search);
    if (search) params.set('search', search);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    setDateParam(params, 'date_from', dateRange.from);
    setDateParam(params, 'date_to', dateRange.to);
    if (value !== '5') params.set('per_page', value);
    
    router.get(`/cpanel/crm/orders?${params.toString()}`, {}, { preserveState: true });
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range || { from: undefined, to: undefined });

    const params = new URLSearchParams(window.location.search);

    if (search) params.set('search', search);

    if (statusFilter !== 'all') {
      params.set('status', statusFilter);
    }

    setDateParam(params, 'date_from', range?.from);
    setDateParam(params, 'date_to', range?.to);

    router.get(`/cpanel/crm/orders?${params.toString()}`, {}, {
      preserveState: true,
    });
  };

  const handleReset = () => {
    setSearch('');
    setStatusFilter('all');
    setDateRange({
      from: undefined,
      to: undefined,
    });
    setPerPageFilter('5');
    router.get('/cpanel/crm/orders', {}, { preserveState: true });
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'CRM',
      href: '/cpanel/crm',
    },
    {
      title: 'Daftar Pesanan',
      href: '/cpanel/crm/orders',
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Daftar Pesanan" />

      <div className="space-y-6 p-6">
        <HeaderTitle 
          title="Daftar Pesanan" 
          description="Kelola semua pesanan produk dari pelanggan"
        >
          <div className="flex items-center gap-2">
            <OrderStatusInfoModal />
            {/* <Link href="/cpanel/crm/orders/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Pesanan
              </Button>
            </Link> */}
          </div>
        </HeaderTitle>

        {/* Statistic */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-800 p-4">
          {orderStats.map((stat, index) => {
            const Icon = stat.icon;
            const isTotal = index === 0;

            return (
              <Card
                key={stat.name}
                className={`
                  group relative overflow-hidden border-0
                  rounded-2xl shadow-sm
                  transition-all duration-300
                  hover:-translate-y-1 hover:shadow-xl
                  ${
                    isTotal
                      ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white'
                      : 'bg-white/95 backdrop-blur'
                  }
                `}
              >
                {/* Glow */}
                <div
                  className={`
                    absolute inset-0 opacity-[0.06]
                    ${!isTotal ? stat.color.split(' ')[0] : 'bg-white'}
                  `}
                />

                {/* Blur Accent */}
                <div
                  className={`
                    absolute -right-10 -top-10 h-24 w-24 rounded-full blur-3xl opacity-20
                    ${!isTotal ? stat.color.split(' ')[0] : 'bg-white'}
                  `}
                />
                {/* Icon */}
                <div
                  className={`
                    flex h-7 w-7 shrink-0 items-center justify-center
                    rounded-2xl
                    absolute
                    top-2 right-3
                    transition-all duration-300
                    group-hover:scale-110
                    ${
                      isTotal
                        ? 'bg-white/10 text-white'
                        : `${stat.color.split(' ')[0]} bg-opacity-10 ${stat.color.split(' ')[1]}`
                    }
                  `}
                >
                  <Icon className="h-3 w-3" />
                </div>

                <CardContent className="relative">
                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-2">

                    {/* Value */}
                    <h3
                      className={`
                        font-black tracking-tight leading-none
                        truncate
                        ${
                          isTotal
                            ? 'text-white text-3xl'
                            : 'text-slate-900 text-3xl'
                        }
                      `}
                    >
                      {stat.value}
                    </h3>

                    {/* Label */}
                    <p
                      className={`
                        text-[10px] font-bold uppercase tracking-[0.2em]
                        truncate
                        ${
                          isTotal
                            ? 'text-slate-400'
                            : 'text-slate-500'
                        }
                      `}
                    >
                      {stat.name}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Orders Table */}
        <Card className="shadow-card">
          <CardContent className="space-y-4">
            {/* Filters */}
            <Card className='gap-3 shadow-none p-0 border-0 border-b pb-3 rounded-none'>
              <CardContent className='p-0'>
                <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pencarian</label>
                      <Input
                        placeholder="Cari nomor pesanan, perusahaan, PIC..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                    </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <Select value={statusFilter} onValueChange={handleStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Status</SelectItem>
                          <SelectItem value="pending">Pesanan Baru</SelectItem>
                          <SelectItem value="confirmed">Dikonfirmasi</SelectItem>
                          <SelectItem value="processing">Diproses</SelectItem>
                          <SelectItem value="shipped">Dikirim</SelectItem>
                          <SelectItem value="completed">Selesai</SelectItem>
                          <SelectItem value="cancelled">Dibatalkan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <DateRangePicker
                        value={dateRange}
                        onChange={handleDateRangeChange}
                        className="lg:col-span-2"
                      />
                    <div className='lg:col-span-2'>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tampilkan per Halaman</label>
                      <Select value={perPageFilter} onValueChange={handlePerPageFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Per Halaman" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      {hasActiveFilters && (
                        <Button 
                          type="button" 
                          size="sm"
                          variant="destructive" 
                          onClick={handleReset}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nomor Pesanan</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Produk</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.data.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <div>#{order.order_number}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{order.company_name}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <User className="h-3 w-3 inline" />
                          {order.pic_name}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Phone className="h-3 w-3 inline" />
                          {order.phone}
                        </div>
                        {order.email && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Mail className="h-3 w-3 inline" />
                            {order.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-3">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          {order.product_image ? (
                            <img 
                              src={`/storage/${order.product_image}`} 
                              alt={order.product_name}
                              className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                              onError={handleImageError}
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        {/* Product Info */}
                        <div className="space-y-1 flex-1">
                          <div className="text-base font-medium">{order.product_name}</div>
                          <div className="text-xs text-gray-500">Qty: {order.quantity} x {formatCurrencyDisplay(order.product_price)}</div>
                          <div className="font-medium text-xs text-green-700">
                            Total: {formatCurrencyDisplay(order.total_price)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className='capitalize flex flex-col pt-6'>
                      <OrderStatusBadge status={order.status} />
                      {
                        order.admin_notes && (
                          <span className="text-xs pl-2 pt-1 text-gray-500">Catatan: <br /> 
                            {order.admin_notes}
                          </span>
                        )
                      }
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-gray-500 mb-2">
                        Tanggal Pemesanan: <br /> <span className="text-black">{formatDate(order.created_at)}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Terakhir Diperbarui: <br /> <span className="text-black">{formatDate(order.updated_at)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/cpanel/crm/orders/${order.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Detail
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/cpanel/crm/orders/edit/${order.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              if (confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) {
                                router.delete(`/cpanel/crm/orders/${order.id}`);
                              }
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {orders.data.length === 0 && (
              <div className="text-center py-8">
                <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Tidak ada pesanan</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Belum ada pesanan masuk.
                </p>
              </div>
            )}

            {orders.last_page > 1 && (
              <Pagination
                currentPage={orders.current_page}
                totalPages={orders.last_page}
                total={orders.total}
                perPage={orders.per_page}
                onPageChange={(page) => {
                  const url = new URL(window.location.href);
                  url.searchParams.set('page', page.toString());
                  router.get(url.toString());
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
