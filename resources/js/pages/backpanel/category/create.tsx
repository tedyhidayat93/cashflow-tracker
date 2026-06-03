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
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Loader, Save } from 'lucide-react';
import { flattenCategories } from '@/lib/utils';
import TreeSelect from '@/components/tree-select';

export interface Category {
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
  created_at?: string;
  updated_at?: string;
}

interface Props {
  parentCategories: Category[];
}

export default function CategoryCreate({ parentCategories }: Props) {
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
      title: 'Create',
      href: '/cpanel/cms/category/create',
    },
  ];

  const [imagePreview, setImagePreview] = useState<string>('');

  const { data, setData, post, processing, transform, errors, reset }= useForm<{
    name: string;
    slug: string;
    description: string;
    type: string;
    parent_id: string | null;
    is_active: boolean;
    meta_title: string;
    meta_description: string;
    image: File | null;
  }>({
    name: '',
    slug: '',
    description: '',
    type: 'product',
    parent_id: null,
    is_active: true,
    meta_title: '',
    meta_description: '',
    image: null as File | null,
  });

  const flatCategories = flattenCategories(parentCategories);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(name as keyof typeof data, value);
    
    if (name === 'name') {
      const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setData('slug', slug);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    transform((data) => ({
      ...data,

      // root category
      parent_id: data.parent_id === '0'
        ? null
        : data.parent_id,
    }));

    post('/cpanel/cms/category', {
      forceFormData: true,

      onSuccess: () => {
        reset();
        setImagePreview('');
      },
    });
  };
  
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Buat Kategori" />
      
      <div className="flex h-4 flex-wrap p-6">
        <h1 className="text-2xl font-bold">Buat Kategori</h1>
      </div>

      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-4">
          <Link href="/cpanel/cms/category">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Kategori
            </Button>
          </Link>
          <div>
            <p className="text-muted-foreground">Tambahkan kategori baru ke sistem Anda</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detail Kategori</CardTitle>
            <CardDescription>
              Isi informasi di bawah ini untuk membuat kategori baru.
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
                    placeholder="Nama kategori"
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
                    placeholder="slug-kategori"
                  />
                  {errors.slug && <p className="text-sm text-red-600">{errors.slug}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipe *</Label>
                  <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product">Produk</SelectItem>
                      <SelectItem value="service">Layanan</SelectItem>
                      <SelectItem value="blog">Blog</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="parent_id">Kategori Induk</Label>
                  <TreeSelect
                    data={parentCategories}
                    value={data.parent_id}
                    onChange={(val) => setData('parent_id', val)}
                  />
                  {errors.parent_id && <p className="text-sm text-red-600">{errors.parent_id}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={data.description}
                  onChange={handleInputChange}
                  placeholder="Deskripsi kategori"
                  rows={3}
                />
                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Gambar</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Pratinjau" 
                      className="h-32 w-32 object-cover rounded-md border"
                    />
                  </div>
                )}
                {errors.image && <p className="text-sm text-red-600">{errors.image}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    name="meta_title"
                    value={data.meta_title}
                    onChange={handleInputChange}
                    placeholder="Meta title untuk SEO"
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
                    placeholder="Meta description untuk SEO"
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
                <Link href="/cpanel/cms/category">
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
                  {processing ? 'Membuat...' : 'Buat Kategori'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
