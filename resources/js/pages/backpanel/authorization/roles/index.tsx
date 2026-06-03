import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination } from '@/components/ui/pagination-custom';
import AppLayout from '@/layouts/app-layout';
import HeaderTitle from '@/components/header-title';
import { type BreadcrumbItem } from '@/types';
import { formatDate } from '@/lib/utils';
import { 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Search, 
  Filter,
  ToggleLeft,
  ToggleRight,
  Shield,
  Users,
  Key
} from 'lucide-react';

interface Role {
  id: number;
  name: string;
  guard_name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  permissions: Array<{
    id: number;
    name: string;
  }>;
  users_count?: number;
}

interface PaginatedRoles {
  data: Role[];
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
  roles: PaginatedRoles;
  filters: {
    search?: string;
    status?: string;
  };
}

export default function RoleIndex({ roles, filters }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Authorization',
      href: '/cpanel/authorization',
    },
    {
      title: 'Roles',
      href: '/cpanel/authorization/roles',
    },
  ];

  const [search, setSearch] = React.useState(filters.search || '');
  const [statusFilter, setStatusFilter] = React.useState(filters.status || '');

  const handleSearch = (value: string) => {
    setSearch(value);
    router.get(
      '/cpanel/authorization/roles',
      { 
        search: value, 
        status: statusFilter
      },
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    router.get(
      '/cpanel/authorization/roles',
      { 
        search: search, 
        status: value
      },
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus role "${name}"?`)) {
      router.delete(`/cpanel/authorization/roles/${id}`);
    }
  };

  const handleToggleStatus = (id: number) => {
    router.patch(`/cpanel/authorization/roles/${id}/toggle-status`);
  };

  const getActiveBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default">Aktif</Badge>
    ) : (
      <Badge variant="secondary">Tidak Aktif</Badge>
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Role Management" />
      
      <div className="space-y-6 p-6">
        <HeaderTitle
          title="Manajemen Peran"
          description="Kelola peran dan atur hak akses tiap peran"
        >
          <Link href="/cpanel/authorization/roles/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Peran
            </Button>
          </Link>
        </HeaderTitle>

        <Card>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 items-end mb-4">

              {/* Search */}
              <div className="space-y-1 xl:col-span-2">
                <label className="text-xs font-medium text-gray-600">
                  Cari
                </label>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />

                  <Input
                    placeholder="Cari peran..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
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
                  <TableHead>Nama Peran</TableHead>
                  <TableHead>Guard</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Hak Akses</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.data.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-blue-500" />
                        <div>
                          <div className="font-medium">{role.name}</div>
                          <div className="text-sm text-gray-500">ID: {role.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{role.guard_name}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {role.description || '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="flex items-center">
                          <Key className="mr-1 h-3 w-3" />
                          {role.permissions?.length || 0}
                        </Badge>
                        {role.users_count !== undefined && (
                          <Badge variant="outline" className="flex items-center">
                            <Users className="mr-1 h-3 w-3" />
                            {role.users_count}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getActiveBadge(role.is_active)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(role.id)}
                        className="p-1"
                        disabled={role.name === 'Super Admin'}
                      >
                        {role.is_active ? (
                          <ToggleRight className="h-5 w-5 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      {formatDate(role.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/cpanel/authorization/roles/${role.id}`}>
                              <Shield className="mr-2 h-4 w-4" />
                              Detail
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/cpanel/authorization/roles/${role.id}/permissions`}>
                              <Key className="mr-2 h-4 w-4" />
                              Permissions
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/cpanel/authorization/roles/edit/${role.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(role.id, role.name)}
                            className="text-red-600"
                            disabled={role.name === 'Super Admin'}
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

            {roles.data.length === 0 && (
              <div className="text-center py-8">
                <Shield className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Tidak ada role</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Mulai dengan membuat role baru.
                </p>
                <div className="mt-6">
                  <Link href="/cpanel/authorization/roles/create">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Role
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {roles.last_page > 1 && (
              <Pagination
                currentPage={roles.current_page}
                totalPages={roles.last_page}
                total={roles.total}
                perPage={roles.per_page}
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
