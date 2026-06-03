import React from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import HeaderTitle from '@/components/header-title';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Save, Users, Mail, Phone, MapPin, Loader } from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Props {
  customer: Customer;
}

export default function CustomerEdit({ customer }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'CRM',
      href: '/cpanel/crm',
    },
    {
      title: 'Pelanggan',
      href: '/cpanel/crm/customer',
    },
    {
      title: 'Edit',
      href: `/cpanel/crm/customer/edit/${customer.id}`,
    },
  ];

  const { data, setData, post, processing, transform, errors, reset } = useForm({
    name: customer.name,
    email: customer.email,
    phone: customer.phone || '',
    address: customer.address || '',
    is_active: customer.is_active,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(name as keyof typeof data, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    transform((data) => ({
      ...data,
      _method: 'PUT',
      // boolean → string
      is_active: data.is_active ? '1' : '0',
    }));
    post(`/cpanel/crm/customer/${customer.id}`, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Pelanggan" />
      
      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-4">
          <Link href="/cpanel/crm/customer">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Pelanggan
            </Button>
          </Link>
          <div>
            <p className="text-muted-foreground">Perbarui informasi pelanggan di bawah ini</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detail Pelanggan</CardTitle>
            <CardDescription>
              Ubah informasi untuk "{customer.name}".
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap *</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="name"
                      name="name"
                      value={data.name}
                      onChange={handleInputChange}
                      placeholder="Nama lengkap pelanggan"
                      className="pl-10"
                      required
                    />
                  </div>
                  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={data.email}
                      onChange={handleInputChange}
                      placeholder="email@example.com"
                      className="pl-10"
                      required
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telepon</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="phone"
                      name="phone"
                      value={data.phone}
                      onChange={handleInputChange}
                      placeholder="+62 812-3456-7890"
                      className="pl-10"
                    />
                  </div>
                  {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Alamat</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                    <Textarea
                      id="address"
                      name="address"
                      value={data.address}
                      onChange={handleInputChange}
                      placeholder="Alamat lengkap pelanggan"
                      rows={3}
                      className="pl-10"
                    />
                  </div>
                  {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
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
                <Link href="/cpanel/crm/customer">
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
                  {processing ? 'Memperbarui...' : 'Perbarui Pelanggan'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
