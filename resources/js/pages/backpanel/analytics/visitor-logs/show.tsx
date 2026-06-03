import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HeaderTitle from '@/components/header-title';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { 
  ArrowLeft, 
  Monitor, 
  Smartphone, 
  Tablet,
  MapPin,
  Clock,
  Activity,
  Eye,
  Globe2Icon,
  Navigation
} from 'lucide-react';

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
  visitorLog: LogVisitor;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Analitik', href: '/cpanel/analytics/visitor-logs' },
  { title: 'Log Pengunjung', href: '/cpanel/analytics/visitor-logs' },
  { title: 'Detail', href: '#' },
];

const getDeviceIcon = (device: string) => {
  switch (device) {
    case 'phone': return <Smartphone className="h-5 w-5" />;
    case 'tablet': return <Tablet className="h-5 w-5" />;
    default: return <Monitor className="h-5 w-5" />;
  }
};

const getActionColor = (action: string) => {
  switch (action) {
    case 'visit': return 'bg-blue-100 text-blue-700';
    case 'click': return 'bg-green-100 text-green-700';
    case 'submit': return 'bg-orange-100 text-orange-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getHttpMethodColor = (method: string) => {
  switch (method) {
    case 'GET': return 'bg-green-100 text-green-700';
    case 'POST': return 'bg-blue-100 text-blue-700';
    case 'PUT': return 'bg-yellow-100 text-yellow-700';
    case 'DELETE': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default function VisitorLogShow({ visitorLog }: Props) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Log Pengunjung #${visitorLog.id}`} />

      <div className="space-y-6 p-6">

        {/* HERO HEADER */}
        <div className="rounded-xl border bg-gradient-to-r from-blue-50 to-white dark:from-blue-950/40 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/40">
              {getDeviceIcon(visitorLog.device)}
            </div>

            <div>
              <h2 className="text-xl font-bold">
                {visitorLog.device_label} • {visitorLog.action}
              </h2>

              <p className="text-sm text-muted-foreground">
                {visitorLog.ip_address} • {visitorLog.full_location || 'Unknown location'}
              </p>

              <div className="flex gap-2 mt-2">
                <Badge className={getActionColor(visitorLog.action)}>
                  {visitorLog.action}
                </Badge>
                <Badge className={getHttpMethodColor(visitorLog.http_method)}>
                  {visitorLog.http_method}
                </Badge>
              </div>
            </div>
          </div>

          <Button variant="outline" asChild>
            <Link href="/cpanel/analytics/visitor-logs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Link>
          </Button>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* INFORMASI UTAMA */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Utama</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 text-sm">

                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">IP Address</span>
                  <span className="font-mono">{visitorLog.ip_address}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Device</span>
                  <span className="flex items-center gap-2">
                    {getDeviceIcon(visitorLog.device)}
                    {visitorLog.device_label}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Provider</span>
                  <span>{visitorLog.provider || '-'}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Page</span>
                  <span className="font-mono text-xs truncate max-w-[200px]">
                    {visitorLog.page}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">URL Path</span>
                  <span className="font-mono text-xs truncate max-w-[200px]">
                    {visitorLog.url_path}
                  </span>
                </div>

              </CardContent>
            </Card>

            {/* LOKASI */}
            <Card>
              <CardHeader>
                <CardTitle>Lokasi</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 text-sm">

                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Negara</span>
                  <span>{visitorLog.country || '-'}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Wilayah</span>
                  <span>{visitorLog.region || '-'}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Kota</span>
                  <span>{visitorLog.city || '-'}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Koordinat</span>
                  <span className="font-mono text-xs">
                    {visitorLog.latitude && visitorLog.longitude
                      ? `${visitorLog.latitude}, ${visitorLog.longitude}`
                      : '-'}
                  </span>
                </div>

                {visitorLog.latitude && visitorLog.longitude && (
                  <Button size="sm" variant="outline" className="w-full mt-2" asChild>
                    <Link
                      href={`https://www.google.com/maps?q=${visitorLog.latitude},${visitorLog.longitude}`}
                      target="_blank"
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Lihat di Google Maps
                    </Link>
                  </Button>
                )}

              </CardContent>
            </Card>

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">

            {/* TIME */}
            <Card>
              <CardHeader>
                <CardTitle>Waktu</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Dibuat</p>
                  <p>{new Date(visitorLog.created_at).toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Diperbarui</p>
                  <p>{new Date(visitorLog.updated_at).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* TECH */}
            <Card>
              <CardHeader>
                <CardTitle>User Agent</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-xs break-all text-muted-foreground">
                  {visitorLog.user_agent}
                </p>
              </CardContent>
            </Card>

            {/* ACTION */}
            <Card>
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/cpanel/analytics/visitor-logs">
                    <Eye className="h-4 w-4 mr-2" />
                    Semua Log
                  </Link>
                </Button>

                {visitorLog.url_path && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={visitorLog.url_path} target="_blank">
                      <Globe2Icon className="h-4 w-4 mr-2" />
                      Kunjungi Halaman
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>

          </div>

        </div>
      </div>
    </AppLayout>
  );
}