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
import { ArrowLeft, Save, Upload, X, Image as ImageIcon, Star, Loader } from 'lucide-react';

interface Props {
  // No props needed for create
}

export default function TestimonialCreate({}: Props) {

  const { data, setData, post, processing, transform, errors, reset }= useForm({
    nama: '',
    keterangan: '',
    perusahaan: '',
    foto_avatar: null as File | null,
    rate_star: 5,
    testimoni: '',
    is_show_public: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(name as keyof typeof data, value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setData('foto_avatar', e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setData('foto_avatar', null);
  };

  const handleRatingChange = (rating: number) => {
    setData('rate_star', rating);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    transform((data) => ({
      ...data,

      // boolean → string
      is_show_public: data.is_show_public ? '1' : '0',
    }));

    post('/cpanel/cms/testimonial', {
      forceFormData: true,

      onSuccess: () => {
        reset();
      },
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => handleRatingChange(i + 1)}
        className="p-1 hover:scale-110 transition-transform"
      >
        <Star
          className={`h-6 w-6 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      </button>
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
      title: 'Tambah',
      href: '/cpanel/cms/testimonial/create',
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tambah Testimonial" />
      
      <div className="space-y-6 p-6">
        <HeaderTitle
          title="Tambah Testimonial"
          description="Tambah testimonial baru"
        />

        <Card>
          <CardHeader>
            <CardTitle>Form Testimonial</CardTitle>
            <CardDescription>
              Isi form di bawah untuk menambah testimonial baru
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama *</Label>
                  <Input
                    id="nama"
                    name="nama"
                    type="text"
                    value={data.nama}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                  {errors.nama && <p className="text-sm text-red-600">{errors.nama}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keterangan">Keterangan</Label>
                  <Input
                    id="keterangan"
                    name="keterangan"
                    type="text"
                    value={data.keterangan}
                    onChange={handleInputChange}
                    placeholder="Jabatan, posisi, atau keterangan lainnya"
                  />
                  {errors.keterangan && <p className="text-sm text-red-600">{errors.keterangan}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="perusahaan">Perusahaan</Label>
                  <Input
                    id="perusahaan"
                    name="perusahaan"
                    type="text"
                    value={data.perusahaan}
                    onChange={handleInputChange}
                    placeholder="Nama perusahaan"
                  />
                  {errors.perusahaan && <p className="text-sm text-red-600">{errors.perusahaan}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rate_star">Rating Bintang *</Label>
                  <div className="flex items-center space-x-2">
                    {renderStars(data.rate_star)}
                    <span className="text-sm text-gray-500 ml-2">({data.rate_star} bintang)</span>
                  </div>
                  {errors.rate_star && <p className="text-sm text-red-600">{errors.rate_star}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="testimoni">Testimoni *</Label>
                <Textarea
                  id="testimoni"
                  name="testimoni"
                  value={data.testimoni}
                  onChange={handleInputChange}
                  placeholder="Masukkan isi testimoni"
                  rows={4}
                  required
                />
                {errors.testimoni && <p className="text-sm text-red-600">{errors.testimoni}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="foto_avatar">Foto Avatar</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    {data.foto_avatar ? (
                      <div className="space-y-4">
                        <div className="relative inline-block">
                          <img
                            src={URL.createObjectURL(data.foto_avatar)}
                            alt="Preview"
                            className="h-32 w-32 rounded-full object-cover mx-auto"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600">{data.foto_avatar.name}</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="foto-avatar"
                            className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                          >
                            <span>Upload file</span>
                            <input
                              id="foto-avatar"
                              name="foto_avatar"
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
                {errors.foto_avatar && <p className="text-sm text-red-600">{errors.foto_avatar}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_show_public"
                  checked={data.is_show_public}
                  onCheckedChange={(checked) => setData('is_show_public', Boolean(checked))}
                />
                <Label htmlFor="is_show_public">Tampilkan di publik</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Link href="/cpanel/cms/testimonial">
                  <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
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
