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
  MessageCircleQuestion,
  ToggleLeft,
  ToggleRight,
  GripVertical
} from 'lucide-react';

interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface PaginatedFaqs {
  data: Faq[];
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
  faqs: PaginatedFaqs;
  filters: {
    search?: string;
    category?: string;
    active?: string;
  };
}

export default function FaqIndex({ faqs, filters }: Props) {
 
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'CMS',
      href: '/cpanel/cms',
    },
    {
      title: 'FAQ',
      href: '/cpanel/cms/faq',
    },
  ];

  const [search, setSearch] = React.useState(filters.search || '');
  const [categoryFilter, setCategoryFilter] = React.useState(filters.category || 'all');
  const [activeFilter, setActiveFilter] = React.useState(filters.active || 'all');

  const handleSearch = (value: string) => {
    setSearch(value);
    router.get(
      '/cpanel/cms/faq',
      { 
        search: value || undefined, 
        category: categoryFilter === 'all' ? undefined : categoryFilter,
        active: activeFilter === 'all' ? undefined : activeFilter
      },
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value);
    router.get(
      '/cpanel/cms/faq',
      { 
        search: search, 
        category: value === 'all' ? undefined : value,
        active: activeFilter === 'all' ? undefined : activeFilter
      },
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleActiveFilter = (value: string) => {
    setActiveFilter(value);
    router.get(
      '/cpanel/cms/faq',
      { 
        search: search, 
        category: categoryFilter === 'all' ? undefined : categoryFilter,
        active: value === 'all' ? undefined : value
      },
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus FAQ ini?')) {
      router.delete(`/cpanel/cms/faq/${id}`);
    }
  };

  const handleToggleStatus = (id: number) => {
    router.patch(`/cpanel/cms/faq/${id}/toggle-status`);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="FAQ" />
      
      <div className="space-y-6 p-6">
        <HeaderTitle
          title="Data FAQ"
          description="Data pertanyaan yang sering diajukan"
        >
          <Link href="/cpanel/cms/faq/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah FAQ
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
                    placeholder="Cari FAQ..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">
                  Kategori
                </label>

                <Select
                  value={categoryFilter}
                  onValueChange={handleCategoryFilter}
                >
                  <SelectTrigger className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="service">Services</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="shipping">Shipping</SelectItem>
                    <SelectItem value="account">Account</SelectItem>
                  </SelectContent>
                </Select>
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
                  <TableHead>Pertanyaan</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faqs.data.map((faq) => (
                  <TableRow key={faq.id}>
                    {/* <TableCell>
                      <div className="flex items-center space-x-1">
                        <GripVertical className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">{faq.position}</span>
                      </div>
                    </TableCell> */}
                    <TableCell>
                      <div className="max-w-md">
                        <div className="font-medium">{faq.question}</div>
                        <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {faq.answer}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{faq.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(faq.id)}
                        className="p-1"
                      >
                        {faq.is_active ? (
                          <ToggleRight className="h-5 w-5 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      {formatDate(faq.created_at)}
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
                            <Link href={`/cpanel/cms/faq/edit/${faq.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(faq.id)}
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

            {faqs.data.length === 0 && (
              <div className="text-center py-8">
                <MessageCircleQuestion className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Tidak ada FAQ</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Mulai dengan membuat FAQ baru.
                </p>
                <div className="mt-6">
                  <Link href="/cpanel/cms/faq/create">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah FAQ
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {faqs.last_page > 1 && (
              <Pagination
                currentPage={faqs.current_page}
                totalPages={faqs.last_page}
                total={faqs.total}
                perPage={faqs.per_page}
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
