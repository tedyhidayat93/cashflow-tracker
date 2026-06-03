import React from 'react';
import { Head, useForm, router, usePage, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pagination } from '@/components/ui/pagination-custom';
import HeadingSmall from '@/components/heading-small';
import HeaderTitle from '@/components/header-title';
import { type BreadcrumbItem } from '@/types';
import { formatDate } from '@/lib/utils';
import AppLayout from '@/layouts/app-layout';
import DateRangePicker from '@/components/ui/date-range-picker';
import { type DateRange } from 'react-day-picker';
import { setDateParam } from '@/utils/date';
import { 
  Search, 
  Filter, 
  Eye, 
  Calendar, 
  Globe, 
  Monitor, 
  Smartphone, 
  Tablet,
  MapPin,
  User,
  Clock,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogVisitor {
  id: number;
  action: string;
  page: string;
  message: string;
  ip_address: string;
  provider: string;
  device: string;
  user_agent: string;
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  region: string | null;
  country: string | null;
  url_path: string;
  http_method: string;
  created_at: string;
  updated_at: string;
  device_label: string;
  full_location: string;
}

interface Props {
  visitorLogs: {
    data: LogVisitor[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
  };
  filters: {
    search?: string;
    device?: string;
    action?: string;
    date_from?: string;
    date_to?: string;
    per_page?: string;
  };
  statistics: {
    total_visitors: number;
    unique_ips: number;
    by_device: Record<string, number>;
    by_action: Record<string, number>;
    by_country: Array<{ country: string; count: number }>;
    recent_visits: Array<{
      page: string;
      ip_address: string;
      device: string;
      created_at: string;
    }>;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Analitik',
    href: '/cpanel/analytics/visitor-logs',
  },
  {
    title: 'Log Pengunjung',
    href: '/cpanel/analytics/visitor-logs',
  },
];

const getDeviceIcon = (device: string) => {
  switch (device) {
    case 'phone':
      return <Smartphone className="h-4 w-4" />;
    case 'tablet':
      return <Tablet className="h-4 w-4" />;
    case 'pc':
      return <Monitor className="h-4 w-4" />;
    default:
      return <Monitor className="h-4 w-4" />;
  }
};

const getActionColor = (action: string) => {
  switch (action) {
    case 'visit':
      return 'bg-blue-100 text-blue-800';
    case 'click':
      return 'bg-green-100 text-green-800';
    case 'submit':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function VisitorLogIndex({ visitorLogs, filters, statistics }: Props) {
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: filters.date_from ? new Date(filters.date_from) : undefined,
    to: filters.date_to ? new Date(filters.date_to) : undefined,
  });

  const { data, setData, processing } = useForm({
    search: filters.search || '',
    device: filters.device || '',
    action: filters.action || '',
    date_from: filters.date_from || '',
    date_to: filters.date_to || '',
    per_page: filters.per_page || '50',
  });

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (data.search) params.set('search', data.search);
    if (data.device && data.device !== 'all') params.set('device', data.device);
    if (data.action && data.action !== 'all') params.set('action', data.action);
    setDateParam(params, 'date_from', dateRange.from);
    setDateParam(params, 'date_to', dateRange.to);
    if (data.per_page && data.per_page !== '50') params.set('per_page', data.per_page);
    
    router.get(`/cpanel/analytics/visitor-logs?${params.toString()}`, {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleReset = () => {
    setData({
      search: '',
      device: '',
      action: '',
      date_from: '',
      date_to: '',
      per_page: '50',
    });
    setDateRange({ from: undefined, to: undefined });
    router.get('/cpanel/analytics/visitor-logs', {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Visitor Logs" />

      <div className="space-y-6 p-6">
        {/* Header */}
        <div>
          <HeaderTitle title="Log Pengunjung" description="Pantau dan analisis aktivitas pengunjung website" />
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* TOTAL VISITORS */}
          <Card className="border-blue-100 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/40">
            <CardContent className="px-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-600 font-medium">Total Pengunjung</p>
                <h3 className="text-2xl font-bold text-blue-700">
                  {statistics.total_visitors.toLocaleString()}
                </h3>
              </div>
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          {/* UNIQUE IPS */}
          <Card className="border-purple-100 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/40">
            <CardContent className="px-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-600 font-medium">IP Unik</p>
                <h3 className="text-2xl font-bold text-purple-700">
                  {statistics.unique_ips.toLocaleString()}
                </h3>
              </div>
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/40">
                <Globe className="h-5 w-5 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          {/* TOP DEVICE */}
          <Card className="border-orange-100 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/40">
            <CardContent className="px-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-orange-600 font-medium">Perangkat Terbanyak</p>
                <h3 className="text-lg font-bold text-orange-700 capitalize">
                  {Object.keys(statistics.by_device).length > 0
                    ? Object.entries(statistics.by_device).sort(([, a], [, b]) => b - a)[0][0]
                    : 'N/A'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {Object.keys(statistics.by_device).length > 0
                    ? Object.entries(statistics.by_device).sort(([, a], [, b]) => b - a)[0][1]
                    : 0} kunjungan
                </p>
              </div>
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/40">
                <Monitor className="h-5 w-5 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          {/* TOP COUNTRY */}
          <Card className="border-green-100 bg-gradient-to-br from-green-50 to-white dark:from-green-950/40">
            <CardContent className="px-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-green-600 font-medium">Negara Terbanyak</p>
                <h3 className="text-lg font-bold text-green-700">
                  {statistics.by_country.length > 0 ? statistics.by_country[0].country : 'N/A'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {statistics.by_country.length > 0 ? statistics.by_country[0].count : 0} kunjungan
                </p>
              </div>
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/40">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>

        </div>


        {/* Visitor Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Log Pengunjung ({visitorLogs.total})</CardTitle>
            <CardDescription>
              Log aktivitas pengunjung detail dengan opsi filter
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <Card className='shadow-none border-none m-0 p-0 pb-4'>
              <CardContent className='p-0'>
                <form onSubmit={handleFilter} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className='col-span-5'>
                      <Label htmlFor="search">Cari</Label>
                      <Input
                        id="search"
                        type="text"
                        placeholder="Cari log pengunjung..."
                        value={data.search}
                        onChange={(e) => setData('search', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="device">Perangkat</Label>
                      <Select value={data.device} onValueChange={(value) => setData('device', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Semua perangkat" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua perangkat</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                          <SelectItem value="tablet">Tablet</SelectItem>
                          <SelectItem value="pc">PC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="action">Aksi</Label>
                      <Select value={data.action} onValueChange={(value) => setData('action', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Semua aksi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua aksi</SelectItem>
                          <SelectItem value="visit">Kunjungan</SelectItem>
                          <SelectItem value="click">Klik</SelectItem>
                          <SelectItem value="submit">Submit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <DateRangePicker
                      value={dateRange}
                      onChange={(range) => {
                        setDateRange(range || { from: undefined, to: undefined });
                        setData('date_from', range?.from ? range.from.toISOString().split('T')[0] : '');
                        setData('date_to', range?.to ? range.to.toISOString().split('T')[0] : '');
                      }}
                      className="col-span-2"
                    />
                    <div>
                      <Label htmlFor="per_page">Per Halaman</Label>
                      <Select value={data.per_page} onValueChange={(value) => setData('per_page', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Pilih per halaman" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                          <SelectItem value="200">200</SelectItem>
                          <SelectItem value="500">500</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>


                  <div className="flex gap-2">
                    <Button type="submit" disabled={processing} className="flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Cari
                    </Button>
                    <Button type="button" variant="outline" onClick={handleReset}>
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Alamat IP</TableHead>
                    <TableHead>Perangkat</TableHead>
                    <TableHead>Aksi</TableHead>
                    <TableHead>Halaman</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visitorLogs.data.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm">
                              {formatDate(log.created_at)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(log.created_at).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                          {log.ip_address}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(log.device)}
                          <span className="capitalize">{log.device}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(getActionColor(log.action))}>
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={log.page}>
                          {log.page}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {log.country && <MapPin className="h-3 w-3" />}
                          <span className="text-sm">
                            {log.full_location || 'Unknown'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate text-xs text-muted-foreground" title={log.user_agent}>
                          {log.user_agent}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/cpanel/analytics/visitor-logs/${log.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {visitorLogs.last_page > 1 && (
              <Pagination
                currentPage={visitorLogs.current_page}
                totalPages={visitorLogs.last_page}
                total={visitorLogs.total}
                perPage={visitorLogs.per_page}
                onPageChange={(page: number) => {
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
