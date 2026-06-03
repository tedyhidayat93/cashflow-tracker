import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import HeaderTitle from '@/components/header-title';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Edit, MessageCircleQuestion, Calendar, User } from 'lucide-react';

interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Props {
  faq: Faq;
}

export default function FaqShow({ faq }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'CMS',
      href: '/cpanel/cms',
    },
    {
      title: 'FAQ',
      href: '/cpanel/cms/faq',
    },
    {
      title: 'Detail',
      href: `/cpanel/cms/faq/${faq.id}`,
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
      <Head title="Detail FAQ" />
      
      <div className="flex h-4 flex-wrap p-6">
        <h1 className="text-2xl font-bold">Detail FAQ</h1>
      </div>

      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-4">
          <Link href="/cpanel/cms/faq">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke FAQ
            </Button>
          </Link>
          <div>
            <p className="text-muted-foreground">Lihat informasi lengkap FAQ di bawah ini</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircleQuestion className="h-5 w-5" />
                  {faq.question}
                </CardTitle>
                <CardDescription>
                  Kategori: {faq.category} • Posisi: {faq.position}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={faq.is_active ? 'default' : 'secondary'}>
                  {faq.is_active ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
                <Link href={`/cpanel/cms/faq/edit/${faq.id}`}>
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
              <h3 className="text-lg font-semibold mb-2">Jawaban</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{faq.answer}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500">Informasi Kategori</h4>
                <div className="space-y-1">
                  <p className="text-sm"><span className="font-medium">Kategori:</span> {faq.category}</p>
                  <p className="text-sm"><span className="font-medium">Posisi:</span> {faq.position}</p>
                  <p className="text-sm"><span className="font-medium">Status:</span> 
                    <Badge variant={faq.is_active ? 'default' : 'secondary'} className="ml-2">
                      {faq.is_active ? 'Aktif' : 'Tidak Aktif'}
                    </Badge>
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500">Informasi Waktu</h4>
                <div className="space-y-1">
                  <p className="text-sm">
                    <Calendar className="inline h-3 w-3 mr-1" />
                    <span className="font-medium">Dibuat:</span> {formatDate(faq.created_at)}
                  </p>
                  <p className="text-sm">
                    <Calendar className="inline h-3 w-3 mr-1" />
                    <span className="font-medium">Diperbarui:</span> {formatDate(faq.updated_at)}
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
