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
  Star,
  Package,
  DollarSign,
  Image as ImageIcon
} from 'lucide-react';
import { formatPrice } from '@/utils/currency';

interface Service {
  id: number;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  sku?: string;
  price: number | null;
  compare_at_price?: number | null;
  duration?: string;
  image?: string;
  is_active: boolean;
  is_featured: boolean;
  category_id?: number;
  meta_title?: string;
  meta_description?: string;
  category?: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

interface PaginatedServices {
  data: Service[];
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
  services: PaginatedServices;
  categories: Array<{
    id: number;
    name: string;
  }>;
  filters: {
    search?: string;
    active?: string;
    featured?: string;
    category?: string;
  };
}

export default function ServiceIndex({ services, categories, filters }: Props) {

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'CMS',
      href: '/cpanel/cms',
    },
    {
      title: 'Services',
      href: '/cpanel/cms/service',
    },
  ];

  const [search, setSearch] = React.useState(filters.search || '');
  const [activeFilter, setActiveFilter] = React.useState(filters.active || '');
  const [featuredFilter, setFeaturedFilter] = React.useState(filters.featured || '');
  const [categoryFilter, setCategoryFilter] = React.useState(filters.category || '');

  const handleSearch = (value: string) => {
    setSearch(value);
    router.get(
      '/cpanel/cms/service',
      { 
        search: value, 
        active: activeFilter, 
        featured: featuredFilter,
        category: categoryFilter
      },
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleActiveFilter = (value: string) => {
    setActiveFilter(value);
    router.get(
      '/cpanel/cms/service',
      { 
        search: search, 
        active: value, 
        featured: featuredFilter,
        category: categoryFilter
      },
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleFeaturedFilter = (value: string) => {
    setFeaturedFilter(value);
    router.get(
      '/cpanel/cms/service',
      { 
        search: search, 
        active: activeFilter, 
        featured: value,
        category: categoryFilter
      },
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value);
    router.get(
      '/cpanel/cms/service',
      { 
        search: search, 
        active: activeFilter, 
        featured: featuredFilter,
        category: value
      },
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus layanan ini?')) {
      router.delete(`/cpanel/cms/service/${id}`);
    }
  };

  const handleToggleStatus = (id: number) => {
    router.patch(`/cpanel/cms/service/${id}/toggle-status`);
  };

  const handleToggleFeatured = (id: number) => {
    router.patch(`/cpanel/cms/service/${id}/toggle-featured`);
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
      <Head title="Layanan" />
      
      <div className="space-y-6 p-6">
        <HeaderTitle
          title="Data Layanan"
          description="Data layanan yang tersedia di website"
        >
          <Link href="/cpanel/cms/service/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Layanan
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
                    placeholder="Cari layanan..."
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

              {/* Featured */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">
                  Unggulan
                </label>

                <Select
                  value={featuredFilter}
                  onValueChange={handleFeaturedFilter}
                >
                  <SelectTrigger className="w-full">
                    <Star className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Unggulan" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="true">Unggulan</SelectItem>
                    <SelectItem value="false">Bukan Unggulan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              {/* 
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">
                  Kategori
                </label>

                <Select
                  value={categoryFilter}
                  onValueChange={handleCategoryFilter}
                >
                  <SelectTrigger className="w-full">
                    <Package className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>

                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              */}
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Gambar</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Unggulan</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.data.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      {service.image ? (
                        <img
                          src={`/storage/${service.image}`}
                          alt={service.name}
                          className="h-12 w-12 object-cover rounded-md"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-gray-500">{service.slug}</div>
                        {service.short_description && (
                          <div className="text-sm text-gray-400 mt-1 line-clamp-1">
                            {service.short_description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-mono">{service.sku || '-'}</span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-semibold text-green-600">
                          {formatPrice(service.price)}
                        </div>
                        {service.compare_at_price && service.price && service.compare_at_price > service.price && (
                          <div className="text-sm text-gray-500 line-through">
                            {formatPrice(service.compare_at_price)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {service.category ? (
                        <Badge variant="outline">{service.category.name}</Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {service.is_active ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">Aktif</Badge>
                      ) : (
                        <Badge variant="secondary">Tidak Aktif</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleFeatured(service.id)}
                        className="p-1"
                      >
                        <Star 
                          className={`h-5 w-5 ${service.is_featured ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} 
                        />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {formatDate(service.created_at)}
                      </div>
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
                            <Link href={`/cpanel/cms/service/edit/${service.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(service.id)}
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

            {services.data.length === 0 && (
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Tidak ada layanan</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Mulai dengan membuat layanan baru.
                </p>
                <div className="mt-6">
                  <Link href="/cpanel/cms/service/create">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Layanan
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {services.last_page > 1 && (
              <Pagination
                currentPage={services.current_page}
                totalPages={services.last_page}
                total={services.total}
                perPage={services.per_page}
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
