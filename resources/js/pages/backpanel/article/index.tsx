import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateBlogUrl } from '@/utils/app';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination } from '@/components/ui/pagination-custom';
import AppLayout from '@/layouts/app-layout';
import HeaderTitle from '@/components/header-title';
import FlashMessage from '@/components/flash-message';
import { type BreadcrumbItem } from '@/types';
import { formatDate } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import TreeSelect from '@/components/tree-select';
import DateRangePicker from '@/components/ui/date-range-picker';
import { type DateRange } from 'react-day-picker';
import { setDateParam } from '@/utils/date';
import { 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Search, 
  Filter,
  FileText,
  User,
  Calendar,
  Eye,
  GripVertical,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  status: string;
  published_at?: string;
  author_id: number;
  category_id?: number;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  views_count: number;
  tags?: string[];
  position?: number;
  is_headline?: boolean;
  author?: {
    id: number;
    name: string;
  };
  category?: {
    id: number;
    name: string;
    slug: string;
    type: string;
    is_active: boolean;
  };
  created_at: string;
  updated_at: string;
}

interface PaginatedArticles {
  data: Article[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
}

interface Props {
  articles: PaginatedArticles;
  authors: Array<{ id: number; name: string }>;
  blogCategories: Array<{ id: number; name: string; slug: string; type: string; is_active: boolean; }>;
  filters?: {
    search?: string;
    status?: string;
    author?: string;
    date_from?: string;
    date_to?: string;
    headline?: string;
    category?: string;
    sort?: string;
    per_page?: string;
  };
}

export default function ArticleIndex({ articles, authors, blogCategories, filters = {} }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'CMS',
      href: '/cpanel/cms',
    },
    {
      title: 'Artikel',
      href: '/cpanel/cms/article',
    },
  ];

  const [search, setSearch] = useState(filters?.search ?? '');
  const [statusFilter, setStatusFilter] = useState(filters?.status ?? 'all');
  const [authorFilter, setAuthorFilter] = useState(filters?.author ?? 'all');
  const [headlineFilter, setHeadlineFilter] = useState(filters?.headline ?? 'all');
  const [categoryFilter, setCategoryFilter] = useState(filters?.category ?? 'all');
  const [sortFilter, setSortFilter] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: filters?.date_from ? new Date(filters.date_from) : undefined,
    to: filters?.date_to ? new Date(filters.date_to) : undefined,
  });
  const [perPageFilter, setPerPageFilter] = useState(filters?.per_page ?? '15');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range || { from: undefined, to: undefined });
    
    const params = new URLSearchParams(window.location.search);
    if (search) params.set('search', search);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (authorFilter !== 'all') params.set('author', authorFilter);
    if (headlineFilter !== 'all') params.set('headline', headlineFilter);
    if (categoryFilter !== 'all') params.set('category', categoryFilter);
    if (sortFilter !== 'all') params.set('sort', sortFilter);
    if (perPageFilter !== '15') params.set('per_page', perPageFilter);
    
    setDateParam(params, 'date_from', range?.from);
    setDateParam(params, 'date_to', range?.to);
    
    router.get(
      `/cpanel/cms/article?${params.toString()}`,
      {},
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (authorFilter !== 'all') params.set('author', authorFilter);
    if (headlineFilter !== 'all') params.set('headline', headlineFilter);
    if (categoryFilter !== 'all') params.set('category', categoryFilter);
    if (sortFilter !== 'all') params.set('sort', sortFilter);
    setDateParam(params, 'date_from', dateRange.from);
    setDateParam(params, 'date_to', dateRange.to);
    if (perPageFilter !== '15') params.set('per_page', perPageFilter);
    
    router.get(
      `/cpanel/cms/article?${params.toString()}`,
      {},
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleFilterChange = (
    filterType: string,
    value: string
  ) => {

    // next state values
    const nextFilters = {
      status: statusFilter,
      author: authorFilter,
      headline: headlineFilter,
      category: categoryFilter,
      sort: sortFilter,
      per_page: perPageFilter,
    };

    // update current changed filter
    nextFilters[
      filterType as keyof typeof nextFilters
    ] = value;

    // update state
    switch (filterType) {
      case 'status':
        setStatusFilter(value);
        break;

      case 'author':
        setAuthorFilter(value);
        break;

      case 'headline':
        setHeadlineFilter(value);
        break;

      case 'category':
        setCategoryFilter(value);
        break;

      case 'sort':
        setSortFilter(value);
        break;

      case 'per_page':
        setPerPageFilter(value);
        break;
    }

    // build params
    const params: Record<string, string> = {};

    if (search) {
      params.search = search;
    }

    if (nextFilters.status !== 'all') {
      params.status = nextFilters.status;
    }

    if (nextFilters.author !== 'all') {
      params.author = nextFilters.author;
    }

    if (nextFilters.headline !== 'all') {
      params.headline = nextFilters.headline;
    }

    if (nextFilters.category !== 'all') {
      params.category = nextFilters.category;
    }

    if (nextFilters.sort !== 'all') {
      params.sort = nextFilters.sort;
    }

    if (nextFilters.per_page !== '15') {
      params.per_page = nextFilters.per_page;
    }

    if (dateRange.from) {
      params.date_from =
        dateRange.from.toISOString().split('T')[0];
    }

    if (dateRange.to) {
      params.date_to =
        dateRange.to.toISOString().split('T')[0];
    }

    router.get('/cpanel/cms/article', params, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setAuthorFilter('all');
    setHeadlineFilter('all');
    setCategoryFilter('all');
    setSortFilter('all');
    setDateRange({ from: undefined, to: undefined });
    setPerPageFilter('15');
    
    router.get('/cpanel/cms/article', {}, { preserveState: true });
  };

  // Check if any filter is active
  const hasActiveFilters = search || 
    statusFilter !== 'all' || 
    authorFilter !== 'all' || 
    headlineFilter !== 'all' || 
    categoryFilter !== 'all' ||
    sortFilter !== 'all' ||
    dateRange.from ||
    dateRange.to ||
    perPageFilter !== '15';

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      router.delete(`/cpanel/cms/article/${id}`);
    }
  };

  const handleToggleStatus = (id: number) => {
    router.patch(`/cpanel/cms/article/${id}/toggle-status`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="default">Diterbitkan</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'archived':
        return <Badge variant="destructive">Diarsipkan</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Artikel" />
      <FlashMessage />
      
      <div className="space-y-6 p-6">
        <HeaderTitle
          title="Data Artikel"
          description="Data artikel yang tersedia di website"
        >
          <Link href="/cpanel/cms/article/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Artikel
            </Button>
          </Link>
        </HeaderTitle>

        <Card>
          <CardContent className='space-y-3'>

            <div className="mb-4 rounded-2xl border bg-background shadow-sm">
              {/* MAIN TOOLBAR */}
              <div className="p-3">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">

                  {/* LEFT */}
                  <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">

                    {/* SEARCH */}
                    <div className="space-y-1 xl:col-span-2">
                      <Label className="text-xs font-medium text-muted-foreground">
                        Cari Artikel
                      </Label>

                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                          placeholder="Cari artikel..."
                          value={search}
                          onChange={(e) => handleSearch(e.target.value)}
                          className="h-10 rounded-xl pl-10"
                        />
                      </div>
                    </div>

                    {/* STATUS */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-muted-foreground">
                        Status
                      </Label>

                      <Select
                        value={statusFilter}
                        onValueChange={(value) =>
                          handleFilterChange('status', value)
                        }
                      >
                        <SelectTrigger className="h-10 rounded-xl">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="all">Semua</SelectItem>
                          <SelectItem value="published">
                            Diterbitkan
                          </SelectItem>
                          <SelectItem value="draft">
                            Draft
                          </SelectItem>
                          <SelectItem value="archived">
                            Diarsipkan
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* PER PAGE */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-muted-foreground">
                        Tampilkan
                      </Label>

                      <Select
                        value={perPageFilter}
                        onValueChange={(value) =>
                          handleFilterChange('per_page', value)
                        }
                      >
                        <SelectTrigger className="h-10 rounded-xl">
                          <SelectValue placeholder="Tampilkan" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="15">15</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center justify-between gap-2">

                    {/* TOGGLE FILTER */}
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl"
                      onClick={() =>
                        setShowAdvancedFilter((prev) => !prev)
                      }
                    >
                      <SlidersHorizontal className="h-4 w-4 mr-2" />

                      {showAdvancedFilter
                        ? 'Sembunyikan'
                        : 'Filter Lanjutan'}
                    </Button>

                    {/* RESET */}
                    {hasActiveFilters && (
                      <Button
                        type="button"
                        variant="destructive"
                        className="rounded-xl"
                        onClick={handleResetFilters}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* ADVANCED FILTER */}
              {showAdvancedFilter && (
                <div className="border-t bg-muted/20 p-3">

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">

                    {/* DATE */}
                    <div className="space-y-1">
                      <DateRangePicker
                        value={dateRange}
                        onChange={handleDateRangeChange}
                      />
                    </div>

                    {/* AUTHOR */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-muted-foreground">
                        Penulis
                      </Label>

                      <Select
                        value={authorFilter}
                        onValueChange={(value) =>
                          handleFilterChange('author', value)
                        }
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Penulis" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="all">
                            Semua Penulis
                          </SelectItem>

                          {authors.map((author) => (
                            <SelectItem
                              key={author.id}
                              value={author.id.toString()}
                            >
                              {author.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* CATEGORY */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-muted-foreground">
                        Kategori
                      </Label>

                      <TreeSelect
                        data={blogCategories}
                        value={categoryFilter?.toString() || null}
                        onChange={(val) =>
                          handleFilterChange(
                            'category',
                            val || 'all'
                          )
                        }
                      />
                    </div>

                    {/* HEADLINE */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-muted-foreground">
                        Headline
                      </Label>

                      <Select
                        value={headlineFilter}
                        onValueChange={(value) =>
                          handleFilterChange('headline', value)
                        }
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Headline" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="all">Semua</SelectItem>
                          <SelectItem value="true">
                            Headline
                          </SelectItem>
                          <SelectItem value="false">
                            Tidak
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* SORT */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-muted-foreground">
                        Urutkan
                      </Label>

                      <Select
                        value={sortFilter}
                        onValueChange={(value) =>
                          handleFilterChange('sort', value)
                        }
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Urutkan" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="all">Semua</SelectItem>
                          <SelectItem value="newest">
                            Terbaru
                          </SelectItem>
                          <SelectItem value="oldest">
                            Terlama
                          </SelectItem>
                          <SelectItem value="most_read">
                            Terbanyak Dibaca
                          </SelectItem>
                          <SelectItem value="least_read">
                            Tersedikit Dibaca
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Thumbnail</TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead>Penulis</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]">Headline</TableHead>
                  <TableHead>Dibaca</TableHead>
                  <TableHead>Diterbitkan</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.data.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div className="flex items-center">
                        {article.featured_image ? (
                          <img 
                            src={`/storage/${article.featured_image}`}
                            alt={article.title}
                            className="h-14 w-14 object-cover rounded-md"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/placeholder.png';
                            }}
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-52 text-wrap">
                        <div className="font-medium text-sm line-clamp-1 truncate">{article.title}</div>
                        <a target="_blank" href={generateBlogUrl(article.slug)} className="text-xs truncate line-clamp-1 max-w-72 text-blue-600 mt-1">
                          {generateBlogUrl(article.slug)}
                        </a>
                        {/* {article.tags && article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {article.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                            {article.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{article.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )} */}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{article.author?.name || '-'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {article.category?.name || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(article.status)}
                    </TableCell>
                    <TableCell>
                      {article.is_headline && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          ⭐ Headline
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{article.views_count}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {article.published_at ? (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {formatDate(article.published_at)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
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
                            <Link href={`/cpanel/cms/article/edit/${article.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(article.id)}
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

            {articles.data.length === 0 && (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Tidak ada artikel</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Mulai dengan menambah artikel baru.
                </p>
                <div className="mt-6">
                  <Link href="/cpanel/cms/article/create">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Artikel
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {articles.last_page > 1 && (
              <Pagination
                currentPage={articles.current_page}
                totalPages={articles.last_page}
                total={articles.total}
                perPage={articles.per_page}
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
