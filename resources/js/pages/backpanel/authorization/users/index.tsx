import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination } from '@/components/ui/pagination-custom';
import AppLayout from '@/layouts/app-layout';
import HeaderTitle from '@/components/header-title';
import { type BreadcrumbItem } from '@/types';
import { Plus, Edit, Trash2, MoreHorizontal, Search, Filter, Users, Shield, Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface User {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  avatar?: string;
  deleted_at?: string;
  roles: Array<{
    id: number;
    name: string;
    guard_name: string;
  }>;
}

interface PaginatedUsers {
  data: User[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

interface Props {
  users: PaginatedUsers;
  roles: string[];
  filters: {
    search?: string;
    role?: string;
    status?: string;
  };
}

export default function UserIndex({ users, roles, filters }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Authorization',
      href: '/cpanel/authorization',
    },
    {
      title: 'User Management',
      href: '/cpanel/authorization/user-management',
    },
  ];

  const [search, setSearch] = React.useState(filters.search || '');
  const [roleFilter, setRoleFilter] = React.useState(filters.role || '');
  const [statusFilter, setStatusFilter] = React.useState(filters.status || '');

  const handleSearch = (value: string) => {
    setSearch(value);
    router.get('/cpanel/authorization/user-management', { search: value, role: roleFilter, status: statusFilter }, { preserveState: true, preserveScroll: true });
  };

  const handleRoleFilter = (value: string) => {
    setRoleFilter(value);
    router.get('/cpanel/authorization/user-management', { search: search, role: value, status: statusFilter }, { preserveState: true, preserveScroll: true });
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    router.get('/cpanel/authorization/user-management', { search: search, role: roleFilter, status: value }, { preserveState: true, preserveScroll: true });
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus user "${name}"?`)) {
      router.delete(`/cpanel/authorization/user-management/${id}`);
    }
  };

  const handleToggleStatus = (id: number) => {
    router.patch(`/cpanel/authorization/user-management/${id}/toggle-status`);
  };

  const getRoleBadge = (roles: User['roles']) => {
    if (roles.length === 0) {
      return <Badge variant="outline">No Role</Badge>;
    }
    
    return (
      <div className="flex flex-wrap gap-1">
        {roles.map((role) => (
          <Badge key={role.id} variant="secondary" className="text-xs">
            {role.name}
          </Badge>
        ))}
      </div>
    );
  };

  const getActiveBadge = (isActive: boolean) => {
    return isActive ? <Badge variant="default">Aktif</Badge> : <Badge variant="secondary">Tidak Aktif</Badge>;
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="User Management" />
      
      <div className="space-y-6 p-6">
        <HeaderTitle title="User Management" description="Kelola user dan hak akses sistem">
          <Link href="/cpanel/authorization/user-management/create">
            <Button><Plus className="mr-2 h-4 w-4" />Tambah User</Button>
          </Link>
        </HeaderTitle>

        <Card>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 items-end mb-4">

              {/* Search */}
              <div className="space-y-1 xl:col-span-2">
                <label className="text-xs font-medium text-gray-600">
                  Cari
                </label>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />

                  <Input
                    placeholder="Cari user..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Role */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">
                  Role
                </label>

                <Select
                  value={roleFilter}
                  onValueChange={handleRoleFilter}
                >
                  <SelectTrigger className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">Semua Role</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">
                  Status
                </label>

                <Select
                  value={statusFilter}
                  onValueChange={handleStatusFilter}
                >
                  <SelectTrigger className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="true">Aktif</SelectItem>
                    <SelectItem value="false">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Peran</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.data.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {user.avatar ? (
                            <img
                              src={`/storage/${user.avatar}`}
                              alt={user.name}
                              className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                              <Users className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.length > 0 ? (
                          user.roles.map((role) => (
                            <Badge key={role.id} variant="secondary" className="flex items-center">
                              <Shield className="mr-1 h-3 w-3" />
                              {role.name}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="outline">No Role</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getActiveBadge(user.is_active)}
                      <br />
                      <small className='text-red-800'>
                        {user.deleted_at ? 'User menonaktifkan akunnya pada: ' + formatDate(user.deleted_at) : ''}
                      </small>
                    </TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/cpanel/authorization/user-management/${user.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Detail
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/cpanel/authorization/user-management/${user.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(user.id, user.name)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {users.data.length === 0 && (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Tidak ada user</h3>
                <p className="mt-1 text-sm text-gray-500">Mulai dengan membuat user baru.</p>
                <div className="mt-6">
                  <Link href="/cpanel/authorization/user-management/create">
                    <Button><Plus className="mr-2 h-4 w-4" />Tambah User</Button>
                  </Link>
                </div>
              </div>
            )}

            {users.last_page > 1 && (
              <Pagination
                currentPage={users.current_page}
                totalPages={users.last_page}
                total={users.total}
                perPage={users.per_page}
                onPageChange={(page: number) => {
                  const url = new URL(window.location.href);
                  url.searchParams.set('page', page.toString());
                  router.get(url.toString());
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
