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
  FolderTree
} from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  type: string;
  parent_id?: number;
  is_active: boolean;
  meta_title?: string;
  meta_description?: string;
  parent?: Category;
  children?: Category[];
  created_at: string;
  updated_at: string;
}

interface PaginatedCategories {
  data: Category[];
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
  categories: Category[];
  filters: {
    search?: string;
    type?: string;
  };
}

export default function CategoryIndex({ categories, filters }: Props) {
  const { props } = usePage();
  const [expanded, setExpanded] = React.useState<Record<number, boolean>>({});

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'CMS',
      href: '/cpanel/cms',
    },
    {
      title: 'Categories',
      href: '/cpanel/cms/category',
    },
  ];

  const [search, setSearch] = React.useState(filters.search || '');
  const [typeFilter, setTypeFilter] = React.useState(filters.type || '');

  const handleSearch = (value: string) => {
    setSearch(value);
    const params: { search?: string; type?: string } = {};
    if (value) params.search = value;
    if (typeFilter && typeFilter !== 'all') params.type = typeFilter;
    router.get(
      '/cpanel/cms/category',
      params,
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleTypeFilter = (value: string) => {
    setTypeFilter(value);
    const params: { search?: string; type?: string } = {};
    if (value && value !== 'all') params.type = value;
    if (search) params.search = search;
    router.get(
      '/cpanel/cms/category',
      params,
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      router.delete(`/cpanel/cms/category/${id}`);
    }
  };

  const handleToggleStatus = (id: number) => {
    router.patch(`/cpanel/cms/category/${id}/toggle-status`);
  };

  const toggleExpand = (id: number) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderCategory = (category: Category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isOpen = expanded[category.id];

    return (
      <React.Fragment key={category.id}>
        <TableRow className="hover:bg-muted/50">
          
          {/* NAME */}
          <TableCell>
            <div 
              className="flex items-center space-x-2"
              style={{ paddingLeft: `${level * 24}px` }}
            >
              
              {/* 🔽 Toggle button */}
              {hasChildren ? (
                <button
                  onClick={() => toggleExpand(category.id)}
                  className="w-5 text-gray-400 hover:text-primary transition"
                >
                  {isOpen ? '▼' : '▶'}
                </button>
              ) : (
                <span className="w-5" />
              )}

              {/* Icon garis */}
              {level > 0 && <span className="text-gray-400 text-xs">└─</span>}
              
              {/* Image */}
              {category.image && (
                <img 
                  src={`/storage/${category.image}`} 
                  className="h-8 w-8 rounded object-cover"
                />
              )}

              {/* Text */}
              <div>
                <div className="font-medium">{category.name}</div>
                <div className="text-xs text-gray-500">{category.slug}</div>
              </div>
            </div>
          </TableCell>

          {/* TYPE */}
          <TableCell>{category.type}</TableCell>

          {/* PARENT */}
          <TableCell>
            {category.parent?.name ?? '-'}
          </TableCell>

          {/* STATUS */}
          <TableCell>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggleStatus(category.id)}
            >
              {category.is_active ? (
                <ToggleRight className="h-5 w-5 text-green-600" />
              ) : (
                <ToggleLeft className="h-5 w-5 text-gray-400" />
              )}
            </Button>
          </TableCell>

          {/* DATE */}
          <TableCell>
            {formatDate(category.created_at)}
          </TableCell>

          {/* ACTION */}
          <TableCell className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/cpanel/cms/category/edit/${category.id}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Ubah
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>

        {/* 🔥 CHILDREN (collapsible) */}
        {hasChildren && isOpen &&
          category.children?.map(child =>
            renderCategory(child, level + 1)
          )
        }
      </React.Fragment>
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Categories" />
      

      <div className="space-y-6 p-6">
        <HeaderTitle
          title="Data Kategori"
          description="Data kategori yang ada di website"
        >
          <Link href="/cpanel/cms/category/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Kategori
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
                    placeholder="Cari kategori..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">
                  Tipe
                </label>

                <Select
                  value={typeFilter}
                  onValueChange={handleTypeFilter}
                >
                  <SelectTrigger className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter tipe" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    <SelectItem value="product">Produk</SelectItem>
                    <SelectItem value="service">Layanan</SelectItem>
                    <SelectItem value="blog">Blog</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Induk</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map(category => renderCategory(category))}
              </TableBody>
            </Table>

            {categories.length === 0 && (
              <div className="text-center py-8">
                <FolderTree className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Tidak ada kategori</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Mulai dengan membuat kategori baru.
                </p>
                <div className="mt-6">
                  <Link href="/cpanel/cms/category/create">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Kategori
                    </Button>
                  </Link>
                </div>
              </div>
            )}

          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
