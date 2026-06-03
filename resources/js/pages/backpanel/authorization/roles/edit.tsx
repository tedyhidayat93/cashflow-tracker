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
import { ArrowLeft, Loader, Save, Shield } from 'lucide-react';

interface Role {
  id: number;
  name: string;
  guard_name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Props {
  role: Role;
}

export default function RoleEdit({ role }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Authorization',
      href: '/cpanel/authorization',
    },
    {
      title: 'Roles',
      href: '/cpanel/authorization/roles',
    },
    {
      title: 'Edit',
      href: `/cpanel/authorization/roles/edit/${role.id}`,
    },
  ];

  const { data, setData, post, processing, transform, errors, reset } = useForm({
    name: role.name,
    guard_name: role.guard_name,
    description: role.description || '',
    is_active: role.is_active,
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
    }));
    
    post(`/cpanel/authorization/roles/${role.id}`, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Role" />
      
      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-4">
          <Link href="/cpanel/authorization/roles">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Roles
            </Button>
          </Link>
          <div>
            <p className="text-muted-foreground">Edit role: {role.name}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Detail Role
            </CardTitle>
            <CardDescription>
              Perbarui informasi role.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Role *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={data.name}
                    onChange={handleInputChange}
                    placeholder="Nama role"
                    required
                    disabled={role.name === 'Super Admin'}
                  />
                  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="guard_name">Guard Name *</Label>
                  <Input
                    id="guard_name"
                    name="guard_name"
                    value={data.guard_name}
                    onChange={handleInputChange}
                    placeholder="web"
                    required
                    disabled={role.name === 'Super Admin'}
                  />
                  {errors.guard_name && <p className="text-sm text-red-600">{errors.guard_name}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={data.description}
                  onChange={handleInputChange}
                  placeholder="Deskripsi role (maks 500 karakter)"
                  rows={3}
                  maxLength={500}
                />
                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={data.is_active}
                  onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                  disabled={role.name === 'Super Admin'}
                />
                <Label htmlFor="is_active">Role Aktif</Label>
                {role.name === 'Super Admin' && (
                  <p className="text-sm text-gray-500">Status role Super Admin tidak dapat diubah</p>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Link href="/cpanel/authorization/roles">
                  <Button type="button" variant="outline">
                    Batal
                  </Button>
                </Link>
                <Button type="submit" disabled={processing || role.name === 'Super Admin'}>
                  {processing ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {processing ? 'Memperbarui...' : 'Perbarui Role'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
