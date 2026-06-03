import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import HeaderTitle from '@/components/header-title';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Edit, Users, Shield, Key, Calendar, Hash, Mail, ToggleLeft, ToggleRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Role {
  id: number;
  name: string;
  guard_name: string;
  description?: string;
  is_active: boolean;
  permissions?: Permission[];
}

interface Permission {
  id: number;
  name: string;
  guard_name: string;
  group_name?: string;
  description?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  avatar?: string;
  roles: Role[];
}

interface Props {
  user: User;
}

export default function UserShow({ user }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Authorization', href: '/cpanel/authorization' },
    { title: 'User Management', href: '/cpanel/authorization/user-management' },
    { title: 'Detail', href: `/cpanel/authorization/user-management/${user.id}` },
  ];

  const getActiveBadge = (isActive: boolean) => {
    return isActive ? <Badge variant="default">Aktif</Badge> : <Badge variant="secondary">Tidak Aktif</Badge>;
  };

  const getVerifiedBadge = (verifiedAt: string | null) => {
    return verifiedAt ? <Badge variant="default">Terverifikasi</Badge> : <Badge variant="destructive">Belum Terverifikasi</Badge>;
  };

  const getPermissionGroups = (roles: Role[]) => {
    const groups: { [key: string]: Permission[] } = {};
    
    // Extract all permissions from all roles
    roles.forEach(role => {
      if (role.permissions && Array.isArray(role.permissions)) {
        role.permissions.forEach(permission => {
          const group = permission.group_name || 'General';
          if (!groups[group]) {
            groups[group] = [];
          }
          groups[group].push(permission);
        });
      }
    });
    
    return groups;
  };

  const permissionGroups = getPermissionGroups(user.roles);
  
  // Calculate total permissions from all roles
  const getTotalPermissions = (roles: Role[]) => {
    const allPermissions = new Set();
    roles.forEach(role => {
      if (role.permissions) {
        role.permissions.forEach(permission => {
          allPermissions.add(permission.id);
        });
      }
    });
    return allPermissions.size;
  };
  
  const totalPermissions = getTotalPermissions(user.roles);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`User: ${user.name}`} />
      
      <div className="space-y-6 p-6">

        {/* PROFILE HEADER */}
        <div className="rounded-2xl border bg-white dark:bg-gray-900 p-6 shadow-sm">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            {/* LEFT PROFILE */}
            <div className="flex items-center gap-5">

              {/* Avatar */}
              {user.avatar ? (
                <img
                  src={`/storage/${user.avatar}`}
                  className="h-20 w-20 rounded-full object-cover border-4 border-white shadow"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center shadow">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
              )}

              {/* Identity */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h2>
                <p className="text-sm text-gray-500">{user.email}</p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {getActiveBadge(user.is_active)}
                  {getVerifiedBadge(user.email_verified_at)}
                </div>
              </div>

            </div>

            {/* ACTION */}
            <div className="flex gap-2">
              <Link href="/cpanel/authorization/user-management">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali
                </Button>
              </Link>

              <Link href={`/cpanel/authorization/user-management/${user.id}/edit`}>
                <Button size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </Link>
            </div>

          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT - ABOUT */}
          <div className="lg:col-span-2 space-y-6">

            <Card>
              <CardHeader>
                <CardTitle>Informasi Profil</CardTitle>
                <CardDescription>Detail akun user</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 text-sm">

                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">User ID</span>
                  <span className="font-mono">{user.id}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium">{user.email}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Status</span>
                  {getActiveBadge(user.is_active)}
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Verifikasi</span>
                  {getVerifiedBadge(user.email_verified_at)}
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Dibuat</span>
                  <span>{formatDate(user.created_at)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Diperbarui</span>
                  <span>{formatDate(user.updated_at)}</span>
                </div>
                {user.deleted_at && (
                  <div className="flex justify-between text-red-400">
                    <span className="text-gray-500">Dihapus/Dinonaktifkan</span>
                    <span className="text-end">
                      {user.deleted_at ? formatDate(user.deleted_at) : '-'}
                      <br />
                      <small className="text-slate-400"> 
                        *User menonaktifkan akunnya
                      </small>
                    </span>
                  </div>
                )}

              </CardContent>
            </Card>

          </div>

          {/* RIGHT - SIDEBAR */}
          <div className="space-y-6">

            {/* ROLES */}
            <Card>
              <CardHeader>
                <CardTitle>Berperan Sebagai</CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                {user.roles.length > 0 ? (
                  user.roles.map((role) => (
                    <div
                      key={role.id}
                      className="flex items-center justify-between rounded-lg border px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <div>
                        <p className="font-medium">{role.name}</p>
                        {role.description && (
                          <p className="text-xs text-gray-500">
                            {role.description}
                          </p>
                        )}
                      </div>

                      {role.is_active ? (
                        <Badge variant="default">Aktif</Badge>
                      ) : (
                        <Badge variant="secondary">Nonaktif</Badge>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-gray-500">
                    Tidak ada role
                  </div>
                )}
              </CardContent>
            </Card>

          </div>

        </div>

        {/* Permissions */}
            <Card>
              <CardHeader>
                <CardTitle>Daftar Hak Akses</CardTitle>
                <CardDescription>
                  {totalPermissions} hak akses dari peran yang melekat pada akun ini
                </CardDescription>
              </CardHeader>

              <CardContent>
                {totalPermissions > 0 ? (
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                            Group
                          </th>
                          <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                            Permission
                          </th>
                          <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                            Deskripsi
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y">
                        {Object.entries(permissionGroups).map(([groupName, permissions]) =>
                          permissions.map((permission, index) => (
                            <tr key={permission.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                              
                              {/* Group (rowspan effect manual) */}
                              {index === 0 && (
                                <td
                                  rowSpan={permissions.length}
                                  className="px-4 py-3 align-top font-semibold text-gray-800 dark:text-white bg-gray-50/50 dark:bg-gray-800/30"
                                >
                                  {groupName}
                                </td>
                              )}

                              {/* Permission name */}
                              <td className="px-4 py-3 font-mono text-xs">
                                {permission.name}
                              </td>

                              {/* Description */}
                              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                {permission.description || '-'}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    Tidak ada permission
                  </div>
                )}
              </CardContent>
            </Card>

      </div>
    </AppLayout>
  );
}
