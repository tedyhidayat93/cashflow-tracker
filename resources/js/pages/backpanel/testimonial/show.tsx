import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import HeaderTitle from '@/components/header-title';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Edit, Star, User, Building2, Calendar, Eye, EyeOff } from 'lucide-react';

interface Testimonial {
  id: number;
  nama: string;
  keterangan?: string;
  perusahaan?: string;
  foto_avatar?: string;
  rate_star: number;
  testimoni: string;
  is_show_public: boolean;
  sequence: number;
  created_at: string;
  updated_at: string;
}

interface Props {
  testimonial: Testimonial;
}

export default function TestimonialShow({ testimonial }: Props) {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'CMS',
      href: '/cpanel/cms',
    },
    {
      title: 'Testimonial',
      href: '/cpanel/cms/testimonial',
    },
    {
      title: testimonial.nama,
      href: `/cpanel/cms/testimonial/${testimonial.id}`,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Testimonial: ${testimonial.nama}`} />
      
      <div className="space-y-6 p-6">
        <HeaderTitle
          title="Detail Testimonial"
          description="Informasi lengkap testimonial"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Testimoni</CardTitle>
                <CardDescription>
                  Detail informasi testimonial dari {testimonial.nama}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Testimoni</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {testimonial.testimoni}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Informasi Pribadi</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          <span className="font-medium">Nama:</span> {testimonial.nama}
                        </span>
                      </div>
                      {testimonial.keterangan && (
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            <span className="font-medium">Keterangan:</span> {testimonial.keterangan}
                          </span>
                        </div>
                      )}
                      {testimonial.perusahaan && (
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            <span className="font-medium">Perusahaan:</span> {testimonial.perusahaan}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Penilaian</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          <span className="font-medium">Rating:</span>
                          <div className="flex items-center space-x-1 ml-1">
                            {renderStars(testimonial.rate_star)}
                            <span className="text-sm text-gray-500 ml-1">({testimonial.rate_star}/5)</span>
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Avatar Card */}
            <Card>
              <CardHeader>
                <CardTitle>Foto Avatar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  {testimonial.foto_avatar ? (
                    <img
                      src={`/storage/${testimonial.foto_avatar}`}
                      alt={testimonial.nama}
                      className="h-32 w-32 rounded-full object-cover mx-auto mb-4"
                    />
                  ) : (
                    <div className="h-32 w-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  <p className="text-sm font-medium text-gray-900">{testimonial.nama}</p>
                  {testimonial.keterangan && (
                    <p className="text-sm text-gray-500">{testimonial.keterangan}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Tampil Publik</span>
                  <Badge variant={testimonial.is_show_public ? 'default' : 'secondary'}>
                    {testimonial.is_show_public ? (
                      <>
                        <Eye className="h-3 w-3 mr-1" />
                        Publik
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3 mr-1" />
                        Draft
                      </>
                    )}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Meta Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Meta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Dibuat</p>
                    <p className="text-sm font-medium">{formatDate(testimonial.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Diperbarui</p>
                    <p className="text-sm font-medium">{formatDate(testimonial.updated_at)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Urutan:</span>
                  <span className="text-sm font-medium">{testimonial.sequence}</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Aksi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/cpanel/cms/testimonial/edit/${testimonial.id}`}>
                  <Button className="w-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Ubah Testimonial
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
