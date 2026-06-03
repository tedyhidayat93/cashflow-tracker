import React from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
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
  Tag as TagIcon,
  Package
} from 'lucide-react';

interface Tag {
  id: number;
  name: string;
  slug: string;
  type: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface PaginatedTags {
  data: Tag[];
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
  tags: PaginatedTags;
  filters: {
    search?: string;
    type?: string;
  };
}

export default function TagIndex({ tags, filters }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'CMS',
      href: '/cpanel/cms',
    },
    {
      title: 'Tag',
      href: '/cpanel/cms/tag',
    },
  ];

  const [search, setSearch] = React.useState(filters.search || '');
  const [typeFilter, setTypeFilter] = React.useState(filters.type || '');

  const handleSearch = (value: string) => {
    setSearch(value);
    router.get(
      '/cpanel/cms/tag',
      { 
        search: value, 
        type: typeFilter
      },
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleTypeFilter = (value: string) => {
    setTypeFilter(value);
    router.get(
      '/cpanel/cms/tag',
      { 
        search: search, 
        type: value
      },
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus tag ini?')) {
      router.delete(`/cpanel/cms/tag/${id}`);
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'product':
        return <Badge variant="default">Produk</Badge>;
      case 'service':
        return <Badge variant="secondary">Layanan</Badge>;
      case 'blog':
        return <Badge variant="outline">Blog</Badge>;
      case 'category':
        return <Badge className="bg-purple-100 text-purple-800">Kategori</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tag" />
      
      <div className="space-y-6 p-6">
        <HeaderTitle
          title="Data Tag"
          description="Data tag yang tersedia di website"
        >
          <Link href="/cpanel/cms/tag/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Tag
            </Button>
          </Link>
        </HeaderTitle>

        <Card>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari tag..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={handleTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="article">Artikel</SelectItem>
                  <SelectItem value="product">Produk</SelectItem>
                  <SelectItem value="common">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.data.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <TagIcon className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium">{tag.name}</div>
                          {tag.description && (
                            <div className="text-sm text-gray-400 mt-1 line-clamp-1">
                              {tag.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-mono">{tag.slug}</span>
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(tag.type)}
                    </TableCell>
                    <TableCell>
                      {formatDate(tag.created_at)}
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
                            <Link href={`/cpanel/cms/tag/edit/${tag.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(tag.id)}
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

            {tags.data.length === 0 && (
              <div className="text-center py-8">
                <TagIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Tidak ada tag</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Mulai dengan membuat tag baru.
                </p>
                <div className="mt-6">
                  <Link href="/cpanel/cms/tag/create">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Tag
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {tags.last_page > 1 && (
              <Pagination
                currentPage={tags.current_page}
                totalPages={tags.last_page}
                total={tags.total}
                perPage={tags.per_page}
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
