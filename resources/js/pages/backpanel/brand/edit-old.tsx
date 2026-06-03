import React, { useState } from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import HeaderTitle from '@/components/header-title';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Save, Upload, X, Image as ImageIcon } from 'lucide-react';

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

export default function BrandEdit({ brand }: Props) {
  const { props } = usePage();
  const flash = props.flash as { success?: string; error?: string } || { success: '', error: '' };
  
  // Tampilkan flash messages
  React.useEffect(() => {
    if (flash.success) {
      console.log('Success:', flash.success);
      alert(flash.success);
    }
    if (flash.error) {
      console.log('Error:', flash.error);
      alert(flash.error);
    }
  }, [flash]);

  const { data, setData, post, processing, transform, errors, reset }= useForm({
    name: brand.name,
    slug: brand.slug,
    description: brand.description || '',
    logo: null as File | null,
    website: brand.website || '',
    is_active: brand.is_active,
    position: brand.position,
    meta_title: brand.meta_title || '',
    meta_description: brand.meta_description || '',
    remove_logo: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(name as keyof typeof data, value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setData('logo', e.target.files[0]);
      setData('remove_logo', false); // Reset remove flag when new image is selected
    }
  };

  const handleRemoveImage = () => {
    setData('logo', null);
    setData('remove_logo', true); // Set remove flag
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'logo' && value instanceof File) {
        formData.append(key, value);
      } else if (key === 'is_active') {
        formData.append(key, value ? '1' : '0');
      } else if (key === 'remove_logo' && value === true) {
        formData.append(key, '1'); // Add remove flag only if true
      } else if (key !== 'logo' && key !== 'remove_logo') {
        formData.append(key, value?.toString() || '');
      }
    });

    // Add method spoofing for PUT
    formData.append('_method', 'PUT');

    router.post(`/cpanel/cms/brand/${brand.id}`, formData, {
      onSuccess: () => {
        reset();
      },
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
      title: 'Ubah',
      href: `/cpanel/cms/brand/edit/${brand.id}`,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Merek" />
      
      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-4">
          <Link href="/cpanel/cms/brand">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Merek
            </Button>
          </Link>
          <div>
            <p className="text-muted-foreground">Perbarui informasi merek di bawah ini</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detail Merek</CardTitle>
            <CardDescription>
              Ubah informasi untuk "{brand.name}".
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
                    placeholder="Nama merek"
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
                    placeholder="merek-slug"
                  />
                  {errors.slug && <p className="text-sm text-red-600">{errors.slug}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="website"
                      name="website"
                      value={data.website}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                      className="pl-10"
                    />
                  </div>
                  {errors.website && <p className="text-sm text-red-600">{errors.website}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">Posisi</Label>
                  <Input
                    id="position"
                    name="position"
                    type="number"
                    min="0"
                    value={data.position}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                  {errors.position && <p className="text-sm text-red-600">{errors.position}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={data.description}
                  onChange={handleInputChange}
                  placeholder="Deskripsi lengkap merek"
                  rows={4}
                />
                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="h-32 w-32 object-cover rounded-md border"
                    />
                  </div>
                )}
                {errors.logo && <p className="text-sm text-red-600">{errors.logo}</p>}
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
                  id="is_active"
                  checked={data.is_active}
                  onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                />
                <Label htmlFor="is_active">Aktif</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Link href="/cpanel/cms/brand">
                  <Button type="button" variant="outline">
                    Batal
                  </Button>
                </Link>
                <Button type="submit" disabled={processing}>
                  <Save className="mr-2 h-4 w-4" />
                  {processing ? 'Memperbarui...' : 'Perbarui Merek'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
