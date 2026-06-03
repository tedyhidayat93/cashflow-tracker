import React from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
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
  Package,
  ExternalLink,
  GripVertical
} from 'lucide-react';

interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  is_active: boolean;
  position: number;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

interface PaginatedBrands {
  data: Brand[];
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
  brands: PaginatedBrands;
  filters: {
    search?: string;
    active?: string;
  };
}

export default function BrandIndex({ brands, filters }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'CMS',
      href: '/cpanel/cms',
    },
    {
      title: 'Merek',
      href: '/cpanel/cms/brand',
    },
  ];

  const [search, setSearch] = React.useState(filters.search || '');
  const [activeFilter, setActiveFilter] = React.useState(filters.active || '');

  const handleSearch = (value: string) => {
    setSearch(value);
    router.get(
      '/cpanel/cms/brand',
      { 
        search: value, 
        active: activeFilter
      },
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleActiveFilter = (value: string) => {
    setActiveFilter(value);
    router.get(
      '/cpanel/cms/brand',
      { 
        search: search, 
        active: value
      },
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus merek ini?')) {
      router.delete(`/cpanel/cms/brand/${id}`);
    }
  };

  const handleToggleStatus = (id: number) => {
    router.patch(`/cpanel/cms/brand/${id}/toggle-status`);
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
      <Head title="Merek" />
      
      <div className="space-y-6 p-6">
        <HeaderTitle
          title="Data Merek"
          description="Data merek yang tersedia di website"
        >
          <Link href="/cpanel/cms/brand/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Merek
            </Button>
          </Link>
        </HeaderTitle>

        <Card>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end mb-4">

              {/* Search */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-gray-600">
                  Cari
                </label>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />

                  <Input
                    placeholder="Cari merek..."
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
                  value={activeFilter}
                  onValueChange={handleActiveFilter}
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
                  {/* <TableHead className="w-[50px]">Pos</TableHead> */}
                  <TableHead>Nama</TableHead>
                  {/* <TableHead>Website</TableHead> */}
                  <TableHead>Status</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brands.data.map((brand) => (
                  <TableRow key={brand.id}>
                    {/* <TableCell>
                      <div className="flex items-center space-x-1">
                        <GripVertical className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">{brand.position}</span>
                      </div>
                    </TableCell> */}
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {brand.logo && (
                          <img 
                            src={`/storage/${brand.logo}`} 
                            alt={brand.name}
                            className="h-8 w-8 rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{brand.name}</div>
                          {/* <div className="text-sm text-gray-500">{brand.slug}</div> */}
                          {/* {brand.description && (
                            <div className="text-sm text-gray-400 mt-1 line-clamp-1">
                              {brand.description}
                            </div>
                          )} */}
                        </div>
                      </div>
                    </TableCell>
                    {/* <TableCell>
                      {brand.website ? (
                        <a 
                          href={brand.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="text-sm">{brand.website}</span>
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell> */}
                    <TableCell>
                      {getActiveBadge(brand.is_active)}
                    </TableCell>
                    <TableCell>
                      {formatDate(brand.created_at)}
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
                            <Link href={`/cpanel/cms/brand/edit/${brand.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleToggleStatus(brand.id)}
                            className="text-blue-600"
                          >
                            <ToggleRight className="mr-2 h-4 w-4" />
                            Toggle Status
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(brand.id)}
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

            {brands.data.length === 0 && (
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Tidak ada merek</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Mulai dengan membuat merek baru.
                </p>
                <div className="mt-6">
                  <Link href="/cpanel/cms/brand/create">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Merek
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {brands.last_page > 1 && (
              <Pagination
                currentPage={brands.current_page}
                totalPages={brands.last_page}
                total={brands.total}
                perPage={brands.per_page}
                onPageChange={(page) => {
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
