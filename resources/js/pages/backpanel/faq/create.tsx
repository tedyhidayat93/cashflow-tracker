import React from 'react';
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
import { ArrowLeft, Save, MessageCircleQuestion, Loader } from 'lucide-react';

export default function FaqCreate() {
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
      title: 'Buat',
      href: '/cpanel/cms/faq/create',
    },
  ];

  const { data, setData, post, processing, transform, errors, reset }= useForm({
    question: '',
    answer: '',
    category: 'general',
    position: 0,
    is_active: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(name as keyof typeof data, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    transform((data) => ({
      ...data,

      // boolean → string
      is_active: data.is_active ? '1' : '0',
    }));

    post('/cpanel/cms/faq', {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Buat FAQ" />
      
      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-4">
          <Link href="/cpanel/cms/faq">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke FAQ
            </Button>
          </Link>
          <div>
            <p className="text-muted-foreground">Buat FAQ baru untuk website Anda</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detail FAQ</CardTitle>
            <CardDescription>
              Isi informasi untuk FAQ baru.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="question">Pertanyaan *</Label>
                <Input
                  id="question"
                  name="question"
                  value={data.question}
                  onChange={handleInputChange}
                  placeholder="Tulis pertanyaan di sini..."
                  required
                />
                {errors.question && <p className="text-sm text-red-600">{errors.question}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="answer">Jawaban *</Label>
                <Textarea
                  id="answer"
                  name="answer"
                  value={data.answer}
                  onChange={handleInputChange}
                  placeholder="Tulis jawaban lengkap di sini..."
                  rows={6}
                  required
                />
                {errors.answer && <p className="text-sm text-red-600">{errors.answer}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori *</Label>
                  <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Umum</SelectItem>
                      <SelectItem value="product">Produk</SelectItem>
                      <SelectItem value="service">Layanan</SelectItem>
                      <SelectItem value="payment">Pembayaran</SelectItem>
                      <SelectItem value="shipping">Pengiriman</SelectItem>
                      <SelectItem value="account">Akun</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
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

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={data.is_active}
                  onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                />
                <Label htmlFor="is_active">Aktif</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Link href="/cpanel/cms/faq">
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
                  {processing ? 'Membuat...' : 'Buat FAQ'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
