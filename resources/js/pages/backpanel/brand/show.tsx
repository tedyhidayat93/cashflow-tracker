import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import HeaderTitle from '@/components/header-title';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Edit, Globe, Calendar, Eye, EyeOff, Package } from 'lucide-react';

interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  is_active: boolean;
  position: number;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  brand: Brand;
}

export default function BrandShow({ brand }: Props) {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'CMS',
      href: '/cpanel/cms',
    },
    {
      title: 'Merek',
      href: '/cpanel/cms/brand',
    },
    {
      title: brand.name,
      href: `/cpanel/cms/brand/${brand.id}`,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Merek: ${brand.name}`} />
      
      <div className="space-y-6 p-6">
        <HeaderTitle
          title="Detail Merek"
          description="Informasi lengkap merek"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Merek</CardTitle>
                <CardDescription>
                  Detail informasi merek {brand.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Deskripsi</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {brand.description || 'Tidak ada deskripsi'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Informasi Dasar</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          <span className="font-medium">Nama:</span> {brand.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          <span className="font-medium">Slug:</span> {brand.slug}
                        </span>
                      </div>
                      {brand.website && (
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            <span className="font-medium">Website:</span> 
                            <a 
                              href={brand.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 ml-1"
                            >
                              {brand.website}
                            </a>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant={brand.is_active ? 'default' : 'secondary'}>
                          {brand.is_active ? (
                            <>
                              <Eye className="h-3 w-3 mr-1" />
                              Aktif
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3 mr-1" />
                              Tidak Aktif
                            </>
                          )}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        Posisi: {brand.position}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Logo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  {brand.logo ? (
                    <img
                      src={`/storage/${brand.logo}`}
                      alt={brand.name}
                      className="h-32 w-32 object-contain mx-auto mb-4"
                    />
                  ) : (
                    <div className="h-32 w-32 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Package className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  <p className="text-sm font-medium text-gray-900">{brand.name}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informasi Meta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Meta Title</p>
                  <p className="text-sm font-medium">
                    {brand.meta_title || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Meta Description</p>
                  <p className="text-sm font-medium">
                    {brand.meta_description || '-'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informasi Meta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Dibuat</p>
                    <p className="text-sm font-medium">{formatDate(brand.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Diperbarui</p>
                    <p className="text-sm font-medium">{formatDate(brand.updated_at)}</p>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Posisi:</span>
                  <span className="font-medium ml-1">{brand.position}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aksi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/cpanel/cms/brand/edit/${brand.id}`}>
                  <Button className="w-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Ubah Merek
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
