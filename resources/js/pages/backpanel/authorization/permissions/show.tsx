import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import HeaderTitle from '@/components/header-title';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Edit, Key, Users, Shield, Calendar, Hash } from 'lucide-react';

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Permission {
  id: number;
  name: string;
  guard_name: string;
  group_name: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  roles: Role[];
  users: User[];
}

interface Props {
  permission: Permission;
}

export default function PermissionShow({ permission }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Authorization', href: '/cpanel/authorization' },
    { title: 'Permission Management', href: '/cpanel/authorization/permissions' },
    { title: 'Detail', href: `/cpanel/authorization/permissions/${permission.id}` },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Permission: ${permission.name}`} />
      
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/cpanel/authorization/permissions">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Permissions
              </Button>
            </Link>
            <div>
              <h2 className="text-lg font-semibold">Detail Permission</h2>
              <p className="text-muted-foreground">Informasi lengkap permission</p>
            </div>
          </div>
          <Link href={`/cpanel/authorization/permissions/edit/${permission.id}`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Permission
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="mr-2 h-5 w-5 text-blue-500" />
                  Informasi Permission
                </CardTitle>
                <CardDescription>Detail informasi permission</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">ID</label>
                    <div className="flex items-center mt-1">
                      <Hash className="mr-1 h-4 w-4 text-gray-400" />
                      <span className="font-mono">{permission.id}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Guard</label>
                    <div className="mt-1">
                      <Badge variant="outline">{permission.guard_name}</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Nama Permission</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <code className="text-sm font-mono text-blue-600">{permission.name}</code>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Group</label>
                  <div className="mt-1">
                    {permission.group_name ? (
                      <Badge variant="secondary">{permission.group_name}</Badge>
                    ) : (
                      <span className="text-gray-400">Tidak ada group</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Deskripsi</label>
                  <div className="mt-1">
                    {permission.description ? (
                      <p className="text-sm">{permission.description}</p>
                    ) : (
                      <span className="text-gray-400">Tidak ada deskripsi</span>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Dibuat</label>
                    <div className="flex items-center mt-1">
                      <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                      <span className="text-sm">{new Date(permission.created_at).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Diperbarui</label>
                    <div className="flex items-center mt-1">
                      <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                      <span className="text-sm">{new Date(permission.updated_at).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-purple-500" />
                  Roles ({permission.roles.length})
                </CardTitle>
                <CardDescription>Roles yang memiliki permission ini</CardDescription>
              </CardHeader>
              <CardContent>
                {permission.roles.length > 0 ? (
                  <div className="space-y-2">
                    {permission.roles.map((role) => (
                      <div key={role.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center">
                          <Shield className="mr-2 h-4 w-4 text-purple-500" />
                          <span className="font-medium">{role.name}</span>
                        </div>
                        <Badge variant="outline">ID: {role.id}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Shield className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Tidak ada role yang memiliki permission ini</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-green-500" />
                  Users ({permission.users.length})
                </CardTitle>
                <CardDescription>Users yang memiliki permission ini</CardDescription>
              </CardHeader>
              <CardContent>
                {permission.users.length > 0 ? (
                  <div className="space-y-2">
                    {permission.users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-green-500" />
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </div>
                        <Badge variant="outline">ID: {user.id}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Users className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Tidak ada user yang memiliki permission ini</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
