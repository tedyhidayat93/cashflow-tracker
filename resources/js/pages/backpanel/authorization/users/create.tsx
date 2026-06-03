import React from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import HeaderTitle from '@/components/header-title';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Save, Users, Shield, Upload, X, Eye, EyeOff, Loader } from 'lucide-react';

interface Role {
  id: number;
  name: string;
  guard_name: string;
}

interface Props {
  roles: Role[];
}

export default function UserCreate({ roles }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Authorization', href: '/cpanel/authorization' },
    { title: 'User Management', href: '/cpanel/authorization/user-management' },
    { title: 'Buat', href: '/cpanel/authorization/user-management/create' },
  ];

  const { data, setData, post, processing, transform, errors, reset }= useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    is_active: true,
    roles: [] as string[],
    avatar: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setData(name as keyof typeof data, checked);
    } else {
      setData(name as keyof typeof data, value);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('avatar', file);
    }
  };

  const removeAvatar = () => {
    setData('avatar', null);
  };

  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  React.useEffect(() => {
    if (data.avatar) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(data.avatar);
    } else {
      setPreview(null);
    }
  }, [data.avatar]);

  const handleRoleChange = (roleName: string, checked: boolean) => {
    if (checked) {
      setData('roles', [...data.roles, roleName]);
    } else {
      setData('roles', data.roles.filter(r => r !== roleName));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/cpanel/authorization/user-management', {
      onSuccess: () => reset(),
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Buat User" />
      
      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-4">
          <Link href="/cpanel/authorization/user-management">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Users
            </Button>
          </Link>
          <div>
            <p className="text-muted-foreground">Buat user baru untuk sistem</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Detail User
            </CardTitle>
            <CardDescription>Isi informasi untuk user baru.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama *</Label>
                  <Input id="name" name="name" value={data.name} onChange={handleInputChange} placeholder="Nama user" required />
                  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" value={data.email} onChange={handleInputChange} placeholder="email@example.com" required />
                  {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input id="password" name="password" type={showPassword ? 'text' : 'password'} value={data.password} onChange={handleInputChange} placeholder="Minimal 8 karakter" required className="pr-10" />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">Konfirmasi Password *</Label>
                  <div className="relative">
                    <Input id="password_confirmation" name="password_confirmation" type={showConfirmPassword ? 'text' : 'password'} value={data.password_confirmation} onChange={handleInputChange} placeholder="Ulangi password" required className="pr-10" />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password_confirmation && <p className="text-sm text-red-600">{errors.password_confirmation}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Avatar</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {preview ? (
                      <div className="relative">
                        <img
                          src={preview}
                          alt="Avatar preview"
                          className="h-20 w-20 rounded-full object-cover border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={removeAvatar}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                        <Users className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      id="avatar"
                      name="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Format: jpeg, jpg, png, gif. Maksimal: 2MB
                    </p>
                    {errors.avatar && <p className="text-sm text-red-600">{errors.avatar}</p>}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Roles</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <Checkbox
                        id={`role-${role.id}`}
                        checked={data.roles.includes(role.name)}
                        onCheckedChange={(checked) => handleRoleChange(role.name, checked as boolean)}
                      />
                      <Label htmlFor={`role-${role.id}`} className="text-sm font-medium cursor-pointer flex items-center">
                        <Shield className="mr-1 h-4 w-4 text-blue-500" />
                        {role.name}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.roles && <p className="text-sm text-red-600">{errors.roles}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="is_active" name="is_active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked as boolean)} />
                <Label htmlFor="is_active">User Aktif</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Link href="/cpanel/authorization/user-management">
                  <Button type="button" variant="outline">Batal</Button>
                </Link>
                <Button type="submit" disabled={processing}>
                  {processing ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {processing ? 'Membuat...' : 'Buat User'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
