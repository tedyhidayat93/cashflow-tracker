import React from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
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
import { Product, type BreadcrumbItem } from '@/types';
import { formatPrice } from '@/utils/currency';
import DateRangePicker from '@/components/ui/date-range-picker';
import { type DateRange } from 'react-day-picker';
import { setDateParam } from '@/utils/date';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; 
import { 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Package,
  Rows3,
  Table2,
  Search,
  RefreshCw,
  SlidersHorizontal,
  Star,
  StarIcon,
  PinIcon
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { formatDate } from '@/lib/utils';
import { getProductTypeText } from '@/utils/product';


interface PaginatedProducts {
  data: Product[];
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
  products: PaginatedProducts;
  brands: Array<{ id: number; name: string }>;
  categories: Array<{ id: number; name: string }>;
  filters: {
    search?: string;
    type_sell?: string;
    brand?: string;
    category?: string;
    status?: string;
    featured?: string;
    bestseller?: string;
    sort?: string;
    per_page?: string;
    date_from?: string;
    date_to?: string;
  };
}

export default function ProductIndex({ products, brands, categories, filters }: Props) {
 
  const [search, setSearch] = React.useState(filters?.search ?? '');
  const [typeFilter, setTypeFilter] = React.useState(filters?.type_sell ?? 'all');
  const [brandFilter, setBrandFilter] = React.useState(filters?.brand ?? 'all');
  const [categoryFilter, setCategoryFilter] = React.useState(filters?.category ?? 'all');
  const [statusFilter, setStatusFilter] = React.useState(filters?.status ?? 'all');
  const [featuredFilter, setFeaturedFilter] = React.useState(filters?.featured ?? 'all');
  const [bestsellerFilter, setBestsellerFilter] = React.useState(filters?.bestseller ?? 'all');
  const [sortFilter, setSortFilter] = React.useState(filters?.sort ?? 'newest');
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: filters?.date_from ? new Date(filters.date_from) : undefined,
    to: filters?.date_to ? new Date(filters.date_to) : undefined,
  });
  const [perPageFilter, setPerPageFilter] = React.useState(
    products.per_page.toString()
  );
  const [showAdvancedFilter, setShowAdvancedFilter] = React.useState(false);
  // const [viewMode, setViewMode] = React.useState<'simple' | 'detail'>('simple');
  const [viewMode, setViewMode] =
    React.useState<'simple' | 'detail'>(() => {
      if (typeof window === 'undefined') {
        return 'simple';
      }

      return (
        localStorage.getItem('product-view-mode') as
          | 'simple'
          | 'detail'
      ) || 'simple';
    });

  const handleSearch = (value: string) => {
    setSearch(value);
    const params: Record<string, any> = {};
    if (value) params.search = value;
    if (typeFilter !== 'all') params.type_sell = typeFilter;
    if (brandFilter !== 'all') params.brand = brandFilter;
    if (categoryFilter !== 'all') params.category = categoryFilter;
    if (statusFilter !== 'all') params.status = statusFilter;
    if (featuredFilter !== 'all') params.featured = featuredFilter;
    if (bestsellerFilter !== 'all') params.bestseller = bestsellerFilter;
    if (sortFilter !== 'newest') params.sort = sortFilter;
    if (dateRange.from) params.date_from = dateRange.from.toISOString().split('T')[0];
    if (dateRange.to) params.date_to = dateRange.to.toISOString().split('T')[0];
    if (perPageFilter !== '10') params.per_page = perPageFilter;
    
    router.get('/cpanel/cms/product', params, { preserveState: true });
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range || { from: undefined, to: undefined });
    
    const params: Record<string, any> = {};
    if (search) params.search = search;
    if (typeFilter !== 'all') params.type_sell = typeFilter;
    if (brandFilter !== 'all') params.brand = brandFilter;
    if (categoryFilter !== 'all') params.category = categoryFilter;
    if (statusFilter !== 'all') params.status = statusFilter;
    if (featuredFilter !== 'all') params.featured = featuredFilter;
    if (bestsellerFilter !== 'all') params.bestseller = bestsellerFilter;
    if (sortFilter !== 'newest') params.sort = sortFilter;
    if (range?.from) params.date_from = range.from.toISOString().split('T')[0];
    if (range?.to) params.date_to = range.to.toISOString().split('T')[0];
    if (perPageFilter !== '10') params.per_page = perPageFilter;
    
    router.get('/cpanel/cms/product', params, { preserveState: true });
  };

  const handleTypeFilter = (value: string) => {
    setTypeFilter(value);
    const params: Record<string, any> = {};
    if (search) params.search = search;
    if (value !== 'all') params.type_sell = value;
    if (brandFilter !== 'all') params.brand = brandFilter;
    if (categoryFilter !== 'all') params.category = categoryFilter;
    if (statusFilter !== 'all') params.status = statusFilter;
    if (featuredFilter !== 'all') params.featured = featuredFilter;
    if (bestsellerFilter !== 'all') params.bestseller = bestsellerFilter;
    if (sortFilter !== 'newest') params.sort = sortFilter;
    if (dateRange.from) params.date_from = dateRange.from.toISOString().split('T')[0];
    if (dateRange.to) params.date_to = dateRange.to.toISOString().split('T')[0];
    if (perPageFilter !== '10') params.per_page = perPageFilter;
    
    router.get('/cpanel/cms/product', params, { preserveState: true });
  };

  const handleBrandFilter = (value: string) => {
    setBrandFilter(value);
    const params: { 
      search?: string; 
      type_sell?: string; 
      brand?: string; 
      category?: string; 
      status?: string; 
      featured?: string; 
      bestseller?: string;
      sort?: string;
      per_page?: string;
    } = { search: search };
    
    if (typeFilter !== 'all') params.type_sell = typeFilter;
    if (value !== 'all') params.brand = value;
    if (categoryFilter !== 'all') params.category = categoryFilter;
    if (statusFilter !== 'all') params.status = statusFilter;
    if (featuredFilter !== 'all') params.featured = featuredFilter;
    if (bestsellerFilter !== 'all') params.bestseller = bestsellerFilter;
    if (sortFilter !== 'newest') params.sort = sortFilter;
    if (perPageFilter !== '10') params.per_page = perPageFilter;
    
    router.get('/cpanel/cms/product', params, { preserveState: true });
  };

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value);
    const params: { 
      search?: string; 
      type_sell?: string; 
      brand?: string; 
      category?: string; 
      status?: string; 
      featured?: string; 
      bestseller?: string;
      sort?: string;
      per_page?: string;
    } = { search: search };
    
    if (typeFilter !== 'all') params.type_sell = typeFilter;
    if (brandFilter !== 'all') params.brand = brandFilter;
    if (value !== 'all') params.category = value;
    if (statusFilter !== 'all') params.status = statusFilter;
    if (featuredFilter !== 'all') params.featured = featuredFilter;
    if (bestsellerFilter !== 'all') params.bestseller = bestsellerFilter;
    if (sortFilter !== 'newest') params.sort = sortFilter;
    if (perPageFilter !== '10') params.per_page = perPageFilter;
    
    router.get('/cpanel/cms/product', params, { preserveState: true });
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    const params: { 
      search?: string; 
      type_sell?: string; 
      brand?: string; 
      category?: string; 
      status?: string; 
      featured?: string; 
      bestseller?: string;
      sort?: string;
      per_page?: string;
    } = { search: search };
    
    if (typeFilter !== 'all') params.type_sell = typeFilter;
    if (brandFilter !== 'all') params.brand = brandFilter;
    if (categoryFilter !== 'all') params.category = categoryFilter;
    if (value !== 'all') params.status = value;
    if (featuredFilter !== 'all') params.featured = featuredFilter;
    if (bestsellerFilter !== 'all') params.bestseller = bestsellerFilter;
    if (sortFilter !== 'newest') params.sort = sortFilter;
    if (perPageFilter !== '10') params.per_page = perPageFilter;
    
    router.get('/cpanel/cms/product', params, { preserveState: true });
  };

  const handlePerPageFilter = (value: string) => {
    setPerPageFilter(value);
    
    const params: { 
      search?: string; 
      type_sell?: string; 
      brand?: string; 
      category?: string; 
      status?: string; 
      featured?: string; 
      bestseller?: string;
      sort?: string;
      per_page?: string;
    } = {
      search: search || undefined,
      type_sell: typeFilter !== 'all' ? typeFilter : undefined,
      brand: brandFilter !== 'all' ? brandFilter : undefined,
      category: categoryFilter !== 'all' ? categoryFilter : undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      featured: featuredFilter !== 'all' ? featuredFilter : undefined,
      bestseller: bestsellerFilter !== 'all' ? bestsellerFilter : undefined,
      sort: sortFilter !== 'newest' ? sortFilter : undefined,
      per_page: value !== '10' ? value : '10'
    };
    
    router.get('/cpanel/cms/product', params, { preserveState: true });
  };

  const handleSortFilter = (value: string) => {
    setSortFilter(value);
    
    const params: { 
      search?: string; 
      type_sell?: string; 
      brand?: string; 
      category?: string; 
      status?: string; 
      featured?: string; 
      bestseller?: string;
      sort?: string;
      per_page?: string;
    } = {
      search: search || undefined,
      type_sell: typeFilter !== 'all' ? typeFilter : undefined,
      brand: brandFilter !== 'all' ? brandFilter : undefined,
      category: categoryFilter !== 'all' ? categoryFilter : undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      featured: featuredFilter !== 'all' ? featuredFilter : undefined,
      bestseller: bestsellerFilter !== 'all' ? bestsellerFilter : undefined,
      sort: value !== 'newest' ? value : 'newest',
      per_page: perPageFilter !== '10' ? perPageFilter : undefined
    };
    
    router.get('/cpanel/cms/product', params, { preserveState: true });
  };

  const handleResetFilters = () => {
    setSearch('');
    setTypeFilter('all');
    setBrandFilter('all');
    setCategoryFilter('all');
    setStatusFilter('all');
    setFeaturedFilter('all');
    setBestsellerFilter('all');
    setSortFilter('newest');
    setDateRange({ from: undefined, to: undefined });
    setPerPageFilter('10');
    
    router.get('/cpanel/cms/product', {}, { preserveState: true });
  };

  // Check if any filter is active
  const hasActiveFilters = search || 
    typeFilter !== 'all' || 
    brandFilter !== 'all' || 
    categoryFilter !== 'all' || 
    statusFilter !== 'all' || 
    featuredFilter !== 'all' || 
    bestsellerFilter !== 'all' ||
    sortFilter !== 'newest' ||
    dateRange.from ||
    dateRange.to;

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      router.delete(`/cpanel/cms/product/${id}`);
    }
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'CMS',
      href: '/cpanel/cms',
    },
    {
      title: 'Produk',
      href: '/cpanel/cms/product',
    },
  ];

  React.useEffect(() => {
    localStorage.setItem(
      'product-view-mode',
      viewMode
    );
  }, [viewMode]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Produk" />
      
      <div className="space-y-6 p-6">
        <HeaderTitle
          title="Data Produk"
          description="Data produk yang ada di website"
        >
          <Link href="/cpanel/cms/product/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Produk
            </Button>
          </Link>
        </HeaderTitle>

        <Card>
          <CardContent>

            <div className="mb-4 rounded-2xl border text-inverse shadow-sm">

              {/* MAIN TOOLBAR */}
              <div className="p-3">

                <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">

                  {/* LEFT */}
                  <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">

                    {/* SEARCH */}
                    <div className="space-y-1  w-full col-span-1 xl:col-span-2">
                      <Label className="text-xs font-medium text-muted-foreground">
                        Cari Produk
                      </Label>

                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                          placeholder="Cari produk..."
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
                        onValueChange={handleStatusFilter}
                      >
                        <SelectTrigger className="h-10 rounded-xl">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="all">
                            Semua
                          </SelectItem>

                          <SelectItem value="published">
                            Tayang
                          </SelectItem>

                          <SelectItem value="draft">
                            Draft
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* PER PAGE */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-muted-foreground">
                        Tampilan per Halaman
                      </Label>

                      <Select
                        value={perPageFilter}
                        onValueChange={handlePerPageFilter}
                      >
                        <SelectTrigger className="h-10 rounded-xl">
                          <SelectValue placeholder="Tampilkan" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* VIEW MODE */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-muted-foreground">
                        Mode Tampilan
                      </Label>

                      <div className="flex h-10 items-center rounded-xl border bg-muted/40 p-1">

                        <Button
                          type="button"
                          size="sm"
                          variant={viewMode === 'simple' ? 'default' : 'ghost'}
                          onClick={() => setViewMode('simple')}
                          className="h-8 flex-1 rounded-lg"
                        >
                          <Rows3 className="h-4 w-4" />

                          <span className="hidden text-xs sm:inline">
                            Simple
                          </span>
                        </Button>

                        <Button
                          type="button"
                          size="sm"
                          variant={viewMode === 'detail' ? 'default' : 'ghost'}
                          onClick={() => setViewMode('detail')}
                          className="h-8 flex-1 rounded-lg"
                        >
                          <Table2 className="h-4 w-4" />

                          <span className="hidden text-xs sm:inline">
                            Detail
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center justify-between gap-2">
                    {/* TOGGLE FILTER */}
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => setShowAdvancedFilter((prev) => !prev)}
                    >
                      <SlidersHorizontal className="h-2 w-2" />

                      {showAdvancedFilter
                        ? 'Sembunyikan Filter'
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
                        <RefreshCw className="h-2 w-2" />
                        Reset
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* ADVANCED FILTER */}
              {showAdvancedFilter && (
                <div className="border-t bg-muted/20 p-3">

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">

                    {/* DATE */}
                    <div className="space-y-1">
                      <DateRangePicker
                        value={dateRange}
                        onChange={handleDateRangeChange}
                      />
                    </div>

                    {/* SORT */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-muted-foreground">
                        Urutkan
                      </Label>

                      <Select
                        value={sortFilter}
                        onValueChange={handleSortFilter}
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Urutkan" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="newest">
                            Terbaru
                          </SelectItem>

                          <SelectItem value="oldest">
                            Terlama
                          </SelectItem>

                          <SelectItem value="name_asc">
                            Nama A-Z
                          </SelectItem>

                          <SelectItem value="name_desc">
                            Nama Z-A
                          </SelectItem>

                          <SelectItem value="price_low">
                            Harga Terendah
                          </SelectItem>

                          <SelectItem value="price_high">
                            Harga Tertinggi
                          </SelectItem>

                          <SelectItem value="stock_low">
                            Stok Terendah
                          </SelectItem>

                          <SelectItem value="stock_high">
                            Stok Tertinggi
                          </SelectItem>

                          <SelectItem value="most_viewed">
                            Paling Banyak Dilihat
                          </SelectItem>
                          <SelectItem value="least_viewed">
                            Paling Sedikit Dilihat
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {/* TIPE */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-muted-foreground">
                        Tipe Jual
                      </Label>

                      <Select
                        value={typeFilter}
                        onValueChange={handleTypeFilter}
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Tipe Jual" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="all">
                            Semua
                          </SelectItem>

                          <SelectItem value="sell">
                            Jual
                          </SelectItem>

                          <SelectItem value="rent">
                            Sewa
                          </SelectItem>

                          <SelectItem value="rent-and-sell">
                            Jual & Sewa
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* BRAND */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-muted-foreground">
                        Merek
                      </Label>

                      <Select
                        value={brandFilter}
                        onValueChange={handleBrandFilter}
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Merek" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="all">
                            Semua
                          </SelectItem>

                          {brands.map((brand) => (
                            <SelectItem
                              key={brand.id}
                              value={brand.id.toString()}
                            >
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* KATEGORI */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-muted-foreground">
                        Kategori
                      </Label>

                      <Select
                        value={categoryFilter}
                        onValueChange={handleCategoryFilter}
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Kategori" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="all">
                            Semua
                          </SelectItem>

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
                  </div>
                </div>
              )}
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produk</TableHead>

                  {viewMode === 'detail' && (
                    <TableHead>Informasi</TableHead>
                  )}

                  {viewMode === 'simple' && (
                    <>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Status</TableHead>
                    </>
                  )}

                  <TableHead>Tanggal Dibuat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.data.map((product) => (
                  <TableRow key={product.id}>
                    
                    {/* PRODUK */}
                    <TableCell>
                      <div className="flex items-center pl-4 gap-3 relative">
                        {product.image_path ? (
                          <img
                            src={product.image_path}
                            alt={product.name}
                            className="h-12 w-12 rounded-xl object-cover border"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}

                        {product.is_featured && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <PinIcon className="absolute -left-1 my-auto h-4 w-4 text-yellow-500 cursor-help" />
                              </TooltipTrigger>

                              <TooltipContent>
                                <p className='text-black font-bold'>Produk akan diprioritaskan tampil di halaman utama
                                dan muncul paling atas pada katalog produk.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}

                        <div className="space-y-1 flex-1 max-w-96 text-wrap">
                            <div className="font-semibold tetxt-sm line-clamp-2">
                              {product.name}
                            </div>

                            <a href={`/catalog/${product.slug}`} className='text-xs text-blue-400 truncate line-clamp-1 max-w-72 hover:text-blue-500' target='_blank' rel='noopener noreferrer'>
                              { window.location.origin + '/catalog/' + product.slug }
                            </a>

                            <div className="flex flex-wrap gap-1 pt-1">
                              {viewMode === 'detail' && (
                                <div className="flex gap-1">
                                {product.is_new && (
                                    <span className="rounded-full bg-emerald-100 border border-emerald-200 px-2 py-1 text-[10px] font-bold text-emerald-800">
                                    Baru
                                    </span>
                                )}
                                {product.is_bestseller && (
                                    <span className="rounded-full bg-orange-100 border border-orange-200 px-2 py-1 text-[10px] font-bold text-orange-800">
                                    Terlaris
                                    </span>
                                )}
                                </div>
                              )}
                            </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* DETAIL MODE */}
                    {viewMode === 'detail' && (
                      <TableCell>
                        <div className="space-y-1 divide-y text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Kategori
                            </span>
                            :
                            <span className="font-medium">
                              {product.category?.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              SKU
                            </span>
                            :
                            <span>
                              {product.sku}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Harga
                            </span>
                            :
                            <span className="font-semibold text-orange-500">
                              {formatPrice(product.price)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Stok
                            </span>
                            :
                            <span>{product.quantity || 0}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Tipe
                            </span>
                            :
                            <span>
                              {getProductTypeText({
                                is_for_sell: product.is_for_sell || false,
                                is_rent: product.is_rent || false
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Merek
                            </span>
                            :
                            <span>
                              {product.brand?.name}
                            </span>
                          </div>

                          <div className="pt-1 gap-2 flex items-center">
                            Status :
                            <Badge
                              variant={
                                product.status === "published"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {product.status === "published"
                                ? "Tayang di Katalog"
                                : "Draft"}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                    )}

                    {/* SIMPLE MODE */}
                    {viewMode === 'simple' && (
                      <>
                        <TableCell>
                          {product.category?.name || '-'}
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant={
                              product.status === "published"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {product.status === "published"
                              ? "Tayang"
                              : "Draft"}
                          </Badge>
                        </TableCell>
                      </>
                    )}

                    {/* TANGGAL */}
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatDate(product.created_at)}
                    </TableCell>

                    {/* AKSI */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/cpanel/cms/product/${product.id}`}>
                              <Package className="mr-2 h-4 w-4" />
                              Lihat
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <Link href={`/cpanel/cms/product/edit/${product.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Ubah
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleDelete(product.id)}
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

            {products.data.length === 0 && (
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Tidak ada produk</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Mulai dengan membuat produk baru.
                </p>
                <div className="mt-6">
                  <Link href="/cpanel/cms/product/create">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Produk
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {products.last_page > 1 && (
              <Pagination
                currentPage={products.current_page}
                totalPages={products.last_page}
                total={products.total}
                perPage={products.per_page}
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