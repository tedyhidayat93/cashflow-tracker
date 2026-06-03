import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import HeaderTitle from '@/components/header-title';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Save, Upload, X, Image as ImageIcon, Loader } from 'lucide-react';
import { formatCurrencyInput, parseCurrencyInput } from '@/utils/currency';
import TreeSelect from '@/components/tree-select';

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
  image?: string;
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
  categories: Category[];
}

export default function ServiceEdit({ service, categories }: Props) {
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
      title: 'Edit',
      href: `/cpanel/cms/service/edit/${service.id}`,
    },
  ];

  const { data, setData, post, processing, transform, errors, reset }= useForm({
    name: service.name,
    slug: service.slug,
    description: service.description || '',
    short_description: service.short_description || '',
    sku: service.sku || '',
    price: service.price?.toString() || '',
    compare_at_price: service.compare_at_price?.toString() || '',
    duration: service.duration || '',
    image: null as File | null,
    is_active: service.is_active,
    is_featured: service.is_featured,
    category_id: service.category_id?.toString() || '',
    meta_title: service.meta_title || '',
    meta_description: service.meta_description || '',
  });

  // State for formatted currency display
  const [formattedPrice, setFormattedPrice] = useState(
    service.price ? formatCurrencyInput(service.price.toString()) : ''
  );
  const [formattedComparePrice, setFormattedComparePrice] = useState(
    service.compare_at_price ? formatCurrencyInput(service.compare_at_price.toString()) : ''
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(name as keyof typeof data, value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value);
    setFormattedPrice(formatted);
    const rawValue = parseCurrencyInput(formatted);
    setData('price', rawValue.toString());
  };

  const handleComparePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value);
    setFormattedComparePrice(formatted);
    const rawValue = parseCurrencyInput(formatted);
    setData('compare_at_price', rawValue.toString());
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setData('image', e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setData('image', null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    transform((data) => ({
      ...data,
      _method: 'PUT',

      // boolean → string
      is_active: data.is_active ? '1' : '0',
      is_featured: data.is_featured ? '1' : '0',
    }));

    post(`/cpanel/cms/service/${service.id}`, {
      forceFormData: true,

      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Layanan" />
      
      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-4">
          <Link href="/cpanel/cms/service">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Button>
          </Link>
          <div>
            <p className="text-muted-foreground">Perbarui informasi layanan di bawah ini</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detail Layanan</CardTitle>
            <CardDescription>
              Ubah informasi untuk "{service.name}".
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={data.name}
                    onChange={handleInputChange}
                    placeholder="Nama layanan"
                    required
                  />
                  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={data.slug}
                    onChange={handleInputChange}
                    placeholder="layanan-slug"
                  />
                  {errors.slug && <p className="text-sm text-red-600">{errors.slug}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={data.sku}
                    onChange={handleInputChange}
                    placeholder="SKU layanan"
                  />
                  {errors.sku && <p className="text-sm text-red-600">{errors.sku}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Durasi</Label>
                  <Input
                    id="duration"
                    name="duration"
                    value={data.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 2 jam, 1 hari"
                  />
                  {errors.duration && <p className="text-sm text-red-600">{errors.duration}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Harga</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">Rp</span>
                    <Input
                      id="price"
                      name="price"
                      type="text"
                      value={formattedPrice}
                      onChange={handlePriceChange}
                      placeholder="0"
                      className="pl-10"
                      maxLength={15} // Maksimal 15 digit untuk mencegah overflow
                    />
                  </div>
                  {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="compare_at_price">Harga Perbandingan</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">Rp</span>
                    <Input
                      id="compare_at_price"
                      name="compare_at_price"
                      type="text"
                      value={formattedComparePrice}
                      onChange={handleComparePriceChange}
                      placeholder="0"
                      className="pl-10"
                      maxLength={15} // Maksimal 15 digit untuk mencegah overflow
                    />
                  </div>
                  {errors.compare_at_price && <p className="text-sm text-red-600">{errors.compare_at_price}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Gambar</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    {data.image || service.image ? (
                      <div className="space-y-4">
                        <div className="relative inline-block">
                          <img
                            src={data.image ? URL.createObjectURL(data.image) : `/storage/${service.image}`}
                            alt="Preview"
                            className="h-32 w-32 object-cover rounded-lg mx-auto"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600">
                          {data.image ? data.image.name : 'Gambar saat ini'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="image"
                            className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                          >
                            <span>Upload file</span>
                            <input
                              id="image"
                              name="image"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </label>
                          <p className="pl-1">atau drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF, SVG up to 2MB</p>
                      </div>
                    )}
                  </div>
                </div>
                {errors.image && <p className="text-sm text-red-600">{errors.image}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="is_active">Status</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_active"
                      checked={data.is_active}
                      onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                    />
                    <Label htmlFor="is_active">Aktif</Label>
                  </div>
                  {errors.is_active && <p className="text-sm text-red-600">{errors.is_active}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category_id">Kategori</Label>
                  <TreeSelect
                    data={categories}
                    value={data.category_id}
                    onChange={(val) => setData('category_id', val ?? '')}
                  />
                  {errors.category_id && <p className="text-sm text-red-600">{errors.category_id}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description">Deskripsi Singkat</Label>
                <Textarea
                  id="short_description"
                  name="short_description"
                  value={data.short_description}
                  onChange={handleInputChange}
                  placeholder="Deskripsi singkat (maks 500 karakter)"
                  rows={2}
                  maxLength={500}
                />
                {errors.short_description && <p className="text-sm text-red-600">{errors.short_description}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={data.description}
                  onChange={handleInputChange}
                  placeholder="Deskripsi lengkap layanan"
                  rows={5}
                />
                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    name="meta_title"
                    value={data.meta_title}
                    onChange={handleInputChange}
                    placeholder="SEO meta title"
                  />
                  {errors.meta_title && <p className="text-sm text-red-600">{errors.meta_title}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Input
                    id="meta_description"
                    name="meta_description"
                    value={data.meta_description}
                    onChange={handleInputChange}
                    placeholder="SEO meta description"
                  />
                  {errors.meta_description && <p className="text-sm text-red-600">{errors.meta_description}</p>}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_featured"
                  checked={data.is_featured}
                  onCheckedChange={(checked) => setData('is_featured', checked as boolean)}
                />
                <Label htmlFor="is_featured">Layanan Unggulan</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Link href="/cpanel/cms/service">
                  <Button type="button" variant="outline">
                    Batal
                  </Button>
                </Link>
                <Button type="submit" disabled={processing}>
                  {processing ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {processing ? 'Memperbarui...' : 'Perbarui Layanan'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
