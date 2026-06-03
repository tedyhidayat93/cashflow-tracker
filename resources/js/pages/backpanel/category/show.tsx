import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  type: string;
  parent_id?: number;
  is_active: boolean;
  meta_title?: string;
  meta_description?: string;
  parent?: Category;
  children?: Category[];
  created_at: string;
  updated_at: string;
}

interface Props {
  category: Category;
}

export default function CategoryShow({ category }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'CMS',
      href: '/cpanel/cms',
    },
    {
      title: 'Categories',
      href: '/cpanel/cms/category',
    },
    {
      title: category.name,
      href: `/cpanel/cms/category/${category.id}`,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Detail Kategori - ${category.name}`} />
      
      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-4">
          <Link href="/cpanel/cms/category">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Kategori
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{category.name}</h1>
            <p className="text-muted-foreground">Detail informasi kategori</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Kategori</CardTitle>
                <CardDescription>
                  Detail lengkap dari kategori "{category.name}"
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nama</label>
                    <p className="text-lg font-semibold">{category.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Slug</label>
                    <p className="text-lg">{category.slug}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tipe</label>
                    <div className="mt-1">
                      <Badge variant={category.type === 'product' ? 'default' : category.type === 'service' ? 'secondary' : 'outline'}>
                        {category.type === 'product' ? 'Produk' : category.type === 'service' ? 'Layanan' : 'Blog'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">
                      <Badge variant={category.is_active ? 'default' : 'secondary'}>
                        {category.is_active ? 'Aktif' : 'Tidak Aktif'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Kategori Induk</label>
                  <p className="text-lg">
                    {category.parent ? category.parent.name : 'Tidak Ada (Kategori Utama)'}
                  </p>
                </div>

                {category.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Deskripsi</label>
                    <p className="mt-1 text-gray-700">{category.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Dibuat</label>
                    <p className="text-lg">{new Date(category.created_at).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Diperbarui</label>
                    <p className="text-lg">{new Date(category.updated_at).toLocaleDateString('id-ID')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {category.image && (
              <Card>
                <CardHeader>
                  <CardTitle>Gambar Kategori</CardTitle>
                </CardHeader>
                <CardContent>
                  <img 
                    src={`/storage/${category.image}`} 
                    alt={category.name}
                    className="w-full h-48 object-cover rounded-md"
                  />
                </CardContent>
              </Card>
            )}

            {(category.meta_title || category.meta_description) && (
              <Card>
                <CardHeader>
                  <CardTitle>SEO Meta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {category.meta_title && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Meta Title</label>
                      <p className="text-sm">{category.meta_title}</p>
                    </div>
                  )}
                  {category.meta_description && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Meta Description</label>
                      <p className="text-sm text-gray-700">{category.meta_description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Aksi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href={`/cpanel/cms/category/edit/${category.id}`}>
                  <Button className="w-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Ubah Kategori
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {category.children && category.children.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Subkategori ({category.children.length})</CardTitle>
              <CardDescription>
                Daftar subkategori dari "{category.name}"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.children.map((child) => (
                  <Link 
                    key={child.id} 
                    href={`/cpanel/cms/category/${child.id}`}
                    className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {child.image && (
                        <img 
                          src={`/storage/${child.image}`} 
                          alt={child.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                      )}
                      <div>
                        <h4 className="font-medium">{child.name}</h4>
                        <p className="text-sm text-gray-500">{child.slug}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
