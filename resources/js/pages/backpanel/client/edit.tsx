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
import { ArrowLeft, Save, Upload, X, Image as ImageIcon, Loader } from 'lucide-react';

interface Client {
  id: number;
  name: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  pic?: string;
  image?: string;
  is_active: boolean;
  sequence: number;
  created_at: string;
  updated_at: string;
}

interface Props {
  client: Client;
}

export default function ClientEdit({ client }: Props) {
 
  const { data, setData, post, processing, transform, errors, reset }= useForm({
    name: client.name,
    website: client.website || '',
    phone: client.phone || '',
    email: client.email || '',
    address: client.address || '',
    pic: client.pic || '',
    image: null as File | null,
    is_active: client.is_active,
    remove_image: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(name as keyof typeof data, value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setData('image', e.target.files[0]);
      setData('remove_image', false); // Reset remove flag when new image is selected
    }
  };

  const handleRemoveImage = () => {
    setData('image', null);
    setData('remove_image', true); // Set remove flag
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    transform((data) => ({
      ...data,
      _method: 'PUT',
      
      // boolean → string
      is_active: data.is_active ? '1' : '0',

      // remove flag
      remove_image: data.remove_image ? '1' : '0',
    }));

    post(`/cpanel/cms/client/${client.id}`, {
      forceFormData: true,

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
      title: 'Clients',
      href: '/cpanel/cms/client',
    },
    {
      title: 'Edit',
      href: `/cpanel/cms/client/edit/${client.id}`,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Klien" />

      <div className="space-y-6 p-6">
        <HeaderTitle
          title="Edit Klien"
          description="Ubah informasi klien"
        >
          <Link href="/cpanel/cms/client">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </HeaderTitle>

        <Card>
          <CardHeader>
            <CardTitle>Informasi Klien</CardTitle>
            <CardDescription>
              Ubah informasi lengkap klien
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={data.name}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama klien"
                    required
                  />
                  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={data.website}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                  />
                  {errors.website && <p className="text-sm text-red-600">{errors.website}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={data.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                  />
                  {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telepon</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={data.phone}
                    onChange={handleInputChange}
                    placeholder="+62 812-3456-7890"
                  />
                  {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pic">PIC (Person in Charge)</Label>
                  <Input
                    id="pic"
                    name="pic"
                    type="text"
                    value={data.pic}
                    onChange={handleInputChange}
                    placeholder="Nama PIC"
                  />
                  {errors.pic && <p className="text-sm text-red-600">{errors.pic}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Gambar</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      {data.image || client.image ? (
                        <div className="space-y-4">
                          <div className="relative inline-block">
                            <img
                              src={data.image ? URL.createObjectURL(data.image) : client.image ? `/storage/${client.image}` : ''}
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
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <label
                                htmlFor="image-hidden"
                                className="cursor-pointer bg-white text-gray-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100"
                              >
                                Change
                              </label>
                            </div>
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
                              htmlFor="image-hidden"
                              className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                            >
                              <span>Upload file</span>
                            </label>
                            <p className="pl-1">atau drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF, SVG up to 2MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Hidden input field for image upload - always present */}
                  <input
                    id="image-hidden"
                    name="image"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {errors.image && <p className="text-sm text-red-600">{errors.image}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={data.address}
                  onChange={handleInputChange}
                  placeholder="Masukkan alamat lengkap"
                  rows={3}
                />
                {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={data.is_active}
                  onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                />
                <Label htmlFor="is_active">Aktif</Label>
                {errors.is_active && <p className="text-sm text-red-600">{errors.is_active}</p>}
              </div>

              <div className="flex justify-end space-x-4">
                <Link href="/cpanel/cms/client">
                  <Button variant="outline" type="button">
                    Batal
                  </Button>
                </Link>
                <Button type="submit" disabled={processing}>
                  {processing ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {processing ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
