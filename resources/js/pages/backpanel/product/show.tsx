import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import HeaderTitle from '@/components/header-title';
import { type BreadcrumbItem, Product } from '@/types';
import { formatPrice } from '@/utils/currency';
import { formatDate } from '@/lib/utils';
import { Edit, Eye, EyeOff, Star, TrendingUp, Sparkles,  Image, ExternalLink } from 'lucide-react';

import SingleGalleryPreview from '@/components/single-gallery-preview';

interface Props {
  product: Product & {
    full_category?: string;
  };
}

export default function ProductShow({ product }: Props) {
  
  const productImages = (product.images as any[])?.map((img: any) => ({
    original: img.image_path?.startsWith('/storage/') ? img.image_path : `/storage/${img.image_path}`,
    thumbnail: img.image_path?.startsWith('/storage/') ? img.image_path : `/storage/${img.image_path}`,
  })) || [{
    original: '/images/placeholder.png',
    thumbnail: '/images/placeholder.png',
  }];

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'CMS',
      href: '/cpanel/cms',
    },
    {
      title: 'Produk',
      href: '/cpanel/cms/product',
    },
    {
      title: product.name,
      href: `/cpanel/cms/product/${product.id}`,
    },
  ];

  
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Produk: ${product.name}`} />
      
      <Card className="border-0 shadow-none">
        <CardContent className="px-6 py-1 space-y-6">

          {/* ================= HEADER ================= */}
          <div className="space-y-2 border-b pb-4">
            <h1 className="text-2xl md:text-4xl font-bold text-slate-800">
              {product.name}
            </h1>
            {product.short_description && (
              <p>
                {product.short_description}
              </p>
            )} 

            <div className="flex flex-wrap justify-between gap-2 pt-2">
              <div className="flex flex-wrap justify-between gap-2">
                <Badge 
                  variant={product.status === 'published' ? 'default' : 'secondary'}
                  className={product.status === 'published' 
                    ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                  }
                >
                  {product.status === 'published' ? (
                    <>
                      <Eye className="h-3 w-3 mr-1" />
                      Tayang Di Katalog
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3 mr-1" />
                      Draft
                    </>
                  )}
                </Badge>

                {product.is_featured && (
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200">
                    <Star className="h-3 w-3 mr-1" />
                    Unggulan
                  </Badge>
                )}
                
                {product.is_bestseller && (
                  <Badge className="bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Terlaris
                  </Badge>
                )}
                
                {product.is_new && (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Baru
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <a href={`/catalog/${product.slug}`} target="_blank">
                  <Button size="sm" variant="outline">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Lihat di Katalog 
                  </Button>
                </a>
                <Link href={`/cpanel/cms/product/edit/${product.id}`}>
                  <Button size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-3">
            {/* ================= IMAGE ================= */}
            <SingleGalleryPreview images={productImages} />
            {/* ================= BASIC INFO ================= */}
            <div className="border rounded-xl p-4 space-y-2 text-sm">
              <h3 className="text-lg font-bold text-slate-700 mb-4">Informasi Produk</h3>

              <div className="divide-y space-y-2">
                <div className="flex justify-between pb-2"><span className="text-gray-500">SKU</span><span className="font-semibold">{product?.sku}</span></div>
                <div className="flex justify-between pb-2"><span className="text-gray-500">Harga</span><span className="font-semibold text-green-600">{formatPrice(product?.price)}</span></div>
                <div className="flex justify-between pb-2"><span className="text-gray-500">Stok</span><span className="font-semibold">{product?.quantity}</span></div>
                {/* <div className="flex justify-between pb-2"><span className="text-gray-500">Dilihat</span><span className="font-semibold">{product?.views}</span></div> */}
                {/* <div className="flex justify-between pb-2"><span className="text-gray-500">Tipe</span><span className="font-semibold">{product?.type}</span></div> */}
                <div className="flex justify-between pb-2"><span className="text-gray-500">Barcode</span><span>{product?.barcode || '-'}</span></div>
                <div className="flex justify-between pb-2"><span className="text-gray-500">Merek</span><span>{product?.brand?.name || '-'}</span></div>
                <div className="flex justify-between pb-2"><span className="text-gray-500">Kategori</span><span>{product?.full_category || '-'}</span></div>
                <div className="flex justify-between pb-2"><span className="text-gray-500">Dijual</span><Badge>{product?.is_for_sell ? 'Ya' : 'Tidak'}</Badge></div>
                <div className="flex justify-between pb-2"><span className="text-gray-500">Disewakan</span><Badge>{product?.is_rent ? 'Ya' : 'Tidak'}</Badge></div>
                
                {/* SPECS */}
                {product.specific_specs && product.specific_specs.length > 0 && (
                  <div className="py-2 space-y-2 divide-y">
                    <h4 className="text-base text-black mb-2">Spesifikasi</h4>
                    {product.specific_specs.map((spec: any, i: number) => (
                      <div key={i} className="pb-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600 text-xs">{spec.label}</span>
                          <span className="text-xs">{spec.value}</span>
                        </div>
                        {spec.note && (
                          <div className="text-gray-400 text-xs mt-1">{spec.note}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================= DESCRIPTION ================= */}
          <div className="border rounded-xl p-4 space-y-2">
            <h3 className="text-lg font-bold text-slate-700">Deskripsi</h3>
            <div
              className="text-sm text-gray-700 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: product.description || '-',
              }}
            />

          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {/* ================= TAGS ================= */}
            {product.tags?.length > 0 && (
              <div className="border rounded-xl p-4">
                <h3 className="text-lg font-bold text-slate-700 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag: string, i: number) => (
                    <Badge key={i} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* ================= VISIBILITY ================= */}
            <div className="border rounded-xl p-4 text-sm space-y-2">
              <h3 className="text-lg font-bold text-slate-700">Visibilitas</h3>

              <div className="flex justify-between">
                <span>Harga</span>
                <Badge>{product.show_price ? 'Tampil' : 'Hidden'}</Badge>
              </div>

              <div className="flex justify-between">
                <span>Stok</span>
                <Badge>{product.show_stock ? 'Tampil' : 'Hidden'}</Badge>
              </div>
            </div>

            {/* ================= META ================= */}
            <div className="border rounded-xl p-4 text-sm space-y-2">
              <h3 className="text-lg font-bold text-slate-700">SEO</h3>
              <div><b>Meta Title:</b> <br /> {product.meta_title || '-'}</div>
              <div className="text-gray-500"><b>Meta Description:</b> <br /> {product.meta_description || '-'}</div>
            </div>

            {/* ================= LOG ================= */}
            <div className="border rounded-xl p-4 text-sm space-y-2">
              <h3 className="text-lg font-bold text-slate-700">Log</h3>
              <div>Dibuat: {formatDate(product.created_at)}</div>
              <div>Update: {formatDate(product.updated_at)}</div>
            </div>
          </div>


        </CardContent>
      </Card>
    </AppLayout>
  );
}