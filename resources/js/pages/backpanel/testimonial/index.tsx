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
  ToggleLeft,
  ToggleRight,
  Star,
  User,
  MessageSquare
} from 'lucide-react';

interface Testimonial {
  id: number;
  nama: string;
  keterangan?: string;
  perusahaan?: string;
  foto_avatar?: string;
  rate_star: number;
  testimoni: string;
  is_show_public: boolean;
  sequence: number;
  created_at: string;
  updated_at: string;
}

interface PaginatedTestimonials {
  data: Testimonial[];
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

interface Metrics {
  total: number;
  star_5: number;
  star_4: number;
  star_3: number;
  star_2: number;
  star_1: number;
}

interface Props {
  testimonials: PaginatedTestimonials;
  metrics: Metrics;
  filters: {
    search?: string;
    public?: string;
    rating?: string;
    date_from?: string;
    date_to?: string;
    sort?: string;
  };
}

export default function TestimonialIndex({ testimonials, metrics, filters }: Props) {

  const [search, setSearch] = React.useState(filters.search || '');
  const [publicFilter, setPublicFilter] = React.useState(filters.public || 'all');
  const [ratingFilter, setRatingFilter] = React.useState(filters.rating || 'all');
  const [sortFilter, setSortFilter] = React.useState(filters.sort || 'sequence');
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: filters?.date_from ? new Date(filters.date_from) : undefined,
    to: filters?.date_to ? new Date(filters.date_to) : undefined,
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    const params = new URLSearchParams();
    if (value) params.set('search', value);
    if (publicFilter !== 'all') params.set('public', publicFilter);
    if (ratingFilter !== 'all') params.set('rating', ratingFilter);
    if (sortFilter !== 'sequence') params.set('sort', sortFilter);
    setDateParam(params, 'date_from', dateRange.from);
    setDateParam(params, 'date_to', dateRange.to);
    
    router.get('/cpanel/cms/testimonial', Object.fromEntries(params.entries()), { preserveState: true });
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range || { from: undefined, to: undefined });
    
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (publicFilter !== 'all') params.set('public', publicFilter);
    if (ratingFilter !== 'all') params.set('rating', ratingFilter);
    if (sortFilter !== 'sequence') params.set('sort', sortFilter);
    setDateParam(params, 'date_from', range?.from);
    setDateParam(params, 'date_to', range?.to);
    
    router.get('/cpanel/cms/testimonial', Object.fromEntries(params.entries()), { preserveState: true });
  };

  const handlePublicFilter = (value: string) => {
    setPublicFilter(value);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (value !== 'all') params.set('public', value);
    if (ratingFilter !== 'all') params.set('rating', ratingFilter);
    if (sortFilter !== 'sequence') params.set('sort', sortFilter);
    setDateParam(params, 'date_from', dateRange.from);
    setDateParam(params, 'date_to', dateRange.to);
    
    router.get('/cpanel/cms/testimonial', Object.fromEntries(params.entries()), { preserveState: true });
  };

  const handleRatingFilter = (value: string) => {
    setRatingFilter(value);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (publicFilter !== 'all') params.set('public', publicFilter);
    if (value !== 'all') params.set('rating', value);
    if (sortFilter !== 'sequence') params.set('sort', sortFilter);
    setDateParam(params, 'date_from', dateRange.from);
    setDateParam(params, 'date_to', dateRange.to);
    
    router.get('/cpanel/cms/testimonial', Object.fromEntries(params.entries()), { preserveState: true });
  };

  const handleSortFilter = (value: string) => {
    setSortFilter(value);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (publicFilter !== 'all') params.set('public', publicFilter);
    if (ratingFilter !== 'all') params.set('rating', ratingFilter);
    if (value !== 'sequence') params.set('sort', value);
    setDateParam(params, 'date_from', dateRange.from);
    setDateParam(params, 'date_to', dateRange.to);
    
    router.get('/cpanel/cms/testimonial', Object.fromEntries(params.entries()), { preserveState: true });
  };

  const handleToggleStatus = (id: number) => {
    router.patch(`/cpanel/cms/testimonial/${id}/toggle-status`);
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus testimonial ini?')) {
      router.delete(`/cpanel/cms/testimonial/${id}`);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'CMS',
      href: '/cpanel/cms',
    },
    {
      title: 'Testimonial',
      href: '/cpanel/cms/testimonial',
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Testimonials" />
      
      <div className="space-y-6 p-6">
        <HeaderTitle
          title="Data Ulasan"
          description="Data testimoni/ulasan dari pelanggan"
        >
          <Link href="/cpanel/cms/testimonial/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Buat Ulasan
            </Button>
          </Link>
        </HeaderTitle>
      
        {/* metric testimonial */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          {/* Total */}
          <Card className="border-0 shadow-sm bg-gradient-to-br from-slate-500 to-slate-800">
            <CardContent>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-100 uppercase tracking-wide">
                    Total
                  </p>

                  <h3 className="text-3xl font-black text-slate-50 mt-1">
                    {metrics.total}
                  </h3>

                  <p className="text-xs text-slate-100 mt-1">
                    Total Testimonial
                  </p>
                </div>

                <div className="h-11 w-11 rounded-2xl bg-slate-500/10 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-slate-50" />
                </div>
              </div>
            </CardContent>
          </Card>

          {[
            {
              label: "5 Bintang",
              value: metrics.star_5,
              stars: 5,
              bg: "from-orange-200 to-orange-100",
              text: "text-orange-800",
              icon: "text-orange-600",
            },
            {
              label: "4 Bintang",
              value: metrics.star_4,
              stars: 4,
              bg: "from-amber-200 to-amber-100",
              text: "text-amber-800",
              icon: "text-amber-500",
            },
            {
              label: "3 Bintang",
              value: metrics.star_3,
              stars: 3,
              bg: "from-yellow-200 to-yellow-100",
              text: "text-yellow-800",
              icon: "text-yellow-500",
            },
            {
              label: "2 Bintang",
              value: metrics.star_2,
              stars: 2,
              bg: "from-yellow-200 to-yellow-100",
              text: "text-yellow-800",
              icon: "text-yellow-500",
            },
            {
              label: "1 Bintang",
              value: metrics.star_1,
              stars: 1,
              bg: "from-gray-200 to-gray-100",
              text: "text-gray-700",
              icon: "text-gray-500",
            },
          ].map((item) => (
            <Card
              key={item.label}
              className={`border-0 shadow-sm bg-gradient-to-br ${item.bg}`}
            >
              <CardContent>
                <div className="flex items-start justify-between">

                  <div>
                    <div className="flex gap-0.5 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < item.stars
                              ? `${item.icon} fill-current`
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    <h3 className={`text-3xl font-black ${item.text}`}>
                      {item.value}
                    </h3>

                    <p className={`text-xs mt-1 ${item.text}`}>
                      {item.label}
                    </p>
                  </div>

                  <div
                    className={`h-10 w-10 rounded-2xl bg-white/60 flex items-center justify-center`}
                  >
                    <Star className={`h-4 w-4 ${item.icon} fill-current`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 items-end mb-4">
              {/* Search */}
              <div className="space-y-1 xl:col-span-5">
                <label className="text-xs font-medium text-gray-600">
                  Cari Testimonial
                </label>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />

                  <Input
                    placeholder="Cari testimonial..."
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
                  value={publicFilter}
                  onValueChange={handlePublicFilter}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="true">Ditampilkan</SelectItem>
                    <SelectItem value="false">Disembunyikan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Rating */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">
                  Rating
                </label>

                <Select
                  value={ratingFilter}
                  onValueChange={handleRatingFilter}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter Rating" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">Semua Rating</SelectItem>
                    <SelectItem value="5">5 Bintang</SelectItem>
                    <SelectItem value="4">4 Bintang</SelectItem>
                    <SelectItem value="3">3 Bintang</SelectItem>
                    <SelectItem value="2">2 Bintang</SelectItem>
                    <SelectItem value="1">1 Bintang</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">
                  Urutkan
                </label>

                <Select
                  value={sortFilter}
                  onValueChange={handleSortFilter}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Urutkan" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="sequence">Urutan Default</SelectItem>
                    <SelectItem value="newest">Terbaru</SelectItem>
                    <SelectItem value="oldest">Terlama</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="space-y-1 md:col-span-2 xl:col-span-2">
                <DateRangePicker
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  className="w-full"
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Perusahaan</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.data.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {testimonial.foto_avatar ? (
                          <img 
                            src={`/storage/${testimonial.foto_avatar}`} 
                            alt={testimonial.nama}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{testimonial.nama}</div>
                          {testimonial.keterangan && (
                            <div className="text-sm text-gray-500">{testimonial.keterangan}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {testimonial.perusahaan || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {renderStars(testimonial.rate_star)}
                        <span className="text-sm text-gray-500 ml-1">({testimonial.rate_star})</span>
                      </div>
                      {testimonial.testimoni || '-'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(testimonial.id)}
                        className="p-1"
                      >
                        {testimonial.is_show_public ? (
                          <>
                            <ToggleRight className="h-5 w-5 text-green-600" /> Ditampilkan
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="h-5 w-5 text-gray-400" /> Disembunyikan
                          </>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      {formatDate(testimonial.created_at)}
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
                            <Link href={`/cpanel/cms/testimonial/${testimonial.id}`}>
                              <User className="mr-2 h-4 w-4" />
                              Lihat
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/cpanel/cms/testimonial/edit/${testimonial.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Ubah
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(testimonial.id)}
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

            {testimonials.data.length === 0 && (
              <div className="text-center py-8">
                <User className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Tidak ada testimonial</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Mulai dengan membuat testimonial baru.
                </p>
                <div className="mt-6">
                  <Link href="/cpanel/cms/testimonial/create">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Testimonial
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {testimonials.last_page > 1 && (
              <Pagination
                currentPage={testimonials.current_page}
                totalPages={testimonials.last_page}
                total={testimonials.total}
                perPage={testimonials.per_page}
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
