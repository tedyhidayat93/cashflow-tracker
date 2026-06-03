import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import HeaderTitle from '@/components/header-title';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Edit, Shield, Users, Key, Calendar, Hash, ToggleLeft, ToggleRight } from 'lucide-react';

interface Permission {
  id: number;
  name: string;
  group_name: string | null;
}

interface User {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
}

interface Role {
  id: number;
  name: string;
  guard_name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  permissions: Permission[];
  users: User[];
}

interface Props {
  role: Role;
}

export default function RoleShow({ role }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Authorization', href: '/cpanel/authorization' },
    { title: 'Role Management', href: '/cpanel/authorization/roles' },
    { title: 'Detail', href: `/cpanel/authorization/roles/${role.id}` },
  ];

  const getActiveBadge = (isActive: boolean) => {
    return isActive ? <Badge variant="default">Aktif</Badge> : <Badge variant="secondary">Tidak Aktif</Badge>;
  };

  const getPermissionGroups = (permissions: Permission[]) => {
    const groups: { [key: string]: Permission[] } = {};
    permissions.forEach(permission => {
      const group = permission.group_name || 'General';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(permission);
    });
    return groups;
  };

  const permissionGroups = getPermissionGroups(role.permissions);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Role: ${role.name}`} />
      
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/cpanel/authorization/roles">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Roles
              </Button>
            </Link>
            <div>
              <h2 className="text-lg font-semibold">Detail Role</h2>
              <p className="text-muted-foreground">Informasi lengkap role</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {role.name !== 'Super Admin' && (
              <>
                <Link href={`/cpanel/authorization/roles/${role.id}/permissions`}>
                  <Button variant="outline">
                    <Key className="mr-2 h-4 w-4" />
                    Manage Permissions
                  </Button>
                </Link>
                <Link href={`/cpanel/authorization/roles/edit/${role.id}`}>
                  <Button>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Role
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-purple-500" />
                  Informasi Role
                </CardTitle>
                <CardDescription>Detail informasi role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">ID</label>
                    <div className="flex items-center mt-1">
                      <Hash className="mr-1 h-4 w-4 text-gray-400" />
                      <span className="font-mono">{role.id}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Guard</label>
                    <div className="mt-1">
                      <Badge variant="outline">{role.guard_name}</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Nama Role</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <span className="font-semibold text-purple-600">{role.name}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="flex items-center mt-1 space-x-2">
                    {getActiveBadge(role.is_active)}
                    {role.is_active ? (
                      <ToggleRight className="h-5 w-5 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Deskripsi</label>
                  <div className="mt-1">
                    {role.description ? (
                      <p className="text-sm">{role.description}</p>
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
                      <span className="text-sm">{new Date(role.created_at).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Diperbarui</label>
                    <div className="flex items-center mt-1">
                      <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                      <span className="text-sm">{new Date(role.updated_at).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="mr-2 h-5 w-5 text-blue-500" />
                  Permissions ({role.permissions.length})
                </CardTitle>
                <CardDescription>Permissions yang dimiliki role ini</CardDescription>
              </CardHeader>
              <CardContent>
                {role.permissions.length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(permissionGroups).map(([groupName, permissions]) => (
                      <div key={groupName}>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">{groupName}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {permissions.map((permission) => (
                            <div key={permission.id} className="flex items-center p-2 border rounded-md">
                              <Key className="mr-2 h-3 w-3 text-blue-500" />
                              <span className="text-xs font-mono">{permission.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Key className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Role ini tidak memiliki permission</p>
                    {role.name !== 'Super Admin' && (
                      <div className="mt-4">
                        <Link href={`/cpanel/authorization/roles/${role.id}/permissions`}>
                          <Button size="sm">
                            <Key className="mr-2 h-4 w-4" />
                            Tambah Permission
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-green-500" />
                  Users ({role.users.length})
                </CardTitle>
                <CardDescription>Users yang memiliki role ini</CardDescription>
              </CardHeader>
              <CardContent>
                {role.users.length > 0 ? (
                  <div className="space-y-2">
                    {role.users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-green-500" />
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getActiveBadge(user.is_active)}
                          <Badge variant="outline">ID: {user.id}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Users className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Tidak ada user yang memiliki role ini</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-purple-500" />
                  Statistik
                </CardTitle>
                <CardDescription>Ringkasan statistik role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total Permissions</span>
                  <Badge variant="secondary">{role.permissions.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total Users</span>
                  <Badge variant="secondary">{role.users.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Permission Groups</span>
                  <Badge variant="secondary">{Object.keys(permissionGroups).length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Status</span>
                  {getActiveBadge(role.is_active)}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
