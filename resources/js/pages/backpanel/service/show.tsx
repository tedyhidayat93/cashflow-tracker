import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import HeaderTitle from '@/components/header-title';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Edit, Package, DollarSign, Calendar, Star, Clock } from 'lucide-react';
import { formatPrice } from '@/utils/currency';

interface Category {
  id: number;
  name: string;
}

interface Service {
  id: number;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  sku?: string;
  price: number;
  compare_at_price?: number;
  duration?: string;
  is_active: boolean;
  is_featured: boolean;
  category_id?: number;
  meta_title?: string;
  meta_description?: string;
  category?: Category;
  created_at: string;
  updated_at: string;
}

interface Props {
  service: Service;
}

export default function ServiceShow({ service }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'CMS',
      href: '/cpanel/cms',
    },
    {
      title: 'Services',
      href: '/cpanel/cms/service',
    },
    {
      title: 'Detail',
      href: `/cpanel/cms/service/${service.id}`,
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Detail Layanan" />
      
      <div className="flex h-4 flex-wrap p-6">
        <h1 className="text-2xl font-bold">Detail Layanan</h1>
      </div>

      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-4">
          <Link href="/cpanel/cms/service">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Layanan
            </Button>
          </Link>
          <div>
            <p className="text-muted-foreground">Lihat informasi lengkap layanan di bawah ini</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {service.name}
                </CardTitle>
                <CardDescription>
                  {service.sku && `SKU: ${service.sku} • `}
                  {service.category?.name || 'Tidak ada kategori'}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {service.is_featured && (
                  <Badge variant="default" className="bg-yellow-500">
                    <Star className="mr-1 h-3 w-3" />
                    Unggulan
                  </Badge>
                )}
                <Badge variant={service.is_active ? 'default' : 'secondary'}>
                  {service.is_active ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
                <Link href={`/cpanel/cms/service/edit/${service.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Deskripsi Singkat</h3>
              <p className="text-gray-700">
                {service.short_description || 'Tidak ada deskripsi singkat'}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Deskripsi Lengkap</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {service.description || 'Tidak ada deskripsi lengkap'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Informasi Harga</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-green-900">Harga</span>
                    <span className="text-xl font-bold text-green-900">
                      {formatPrice(service.price)}
                    </span>
                  </div>
                  {service.compare_at_price && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">Bandingkan Harga</span>
                      <span className="text-lg font-semibold text-gray-900 line-through">
                        {formatPrice(service.compare_at_price)}
                      </span>
                    </div>
                  )}
                  {service.duration && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Durasi</span>
                      <span className="text-blue-900">{service.duration}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Informasi Lain</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Status</span>
                    <Badge variant={service.is_active ? 'default' : 'secondary'}>
                      {service.is_active ? 'Aktif' : 'Tidak Aktif'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Unggulan</span>
                    <Badge variant={service.is_featured ? 'default' : 'secondary'}>
                      {service.is_featured ? 'Ya' : 'Tidak'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Kategori</span>
                    <span>{service.category?.name || 'Tidak ada'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500">Informasi SEO</h4>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Meta Title:</span> {service.meta_title || '-'}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Meta Description:</span> {service.meta_description || '-'}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Slug:</span> {service.slug}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500">Informasi Waktu</h4>
                <div className="space-y-1">
                  <p className="text-sm">
                    <Calendar className="inline h-3 w-3 mr-1" />
                    <span className="font-medium">Dibuat:</span> {formatDate(service.created_at)}
                  </p>
                  <p className="text-sm">
                    <Calendar className="inline h-3 w-3 mr-1" />
                    <span className="font-medium">Diperbarui:</span> {formatDate(service.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
