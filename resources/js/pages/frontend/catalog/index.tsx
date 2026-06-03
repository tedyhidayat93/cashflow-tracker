import { Head, router, usePage } from '@inertiajs/react';
import { Filter, Search, ArrowUpDown, ChevronDown, X, ArrowRight, ArrowLeft, HandHeartIcon, LayoutDashboard, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';
import FrontendLayout from '@/layouts/frontend-layout';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import { useConfig } from '@/utils/config';
import type { Product } from '@/types';
import SeoHead from '@/components/seo-head';

interface CategoryOption {
    label: string;
    value: string;
    subcategories?: CategoryOption[];
}

export interface PaginationInfo {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from?: number;
    to?: number;
}

export interface LoadInfo {
    request_time: number;
    timestamp: number;
    formatted: string;
    timezone: string;
    microtime: number;
    load_time: number;
    memory_usage: string;
}

export interface ApiResponse<T> {
    status: string;
    data: T[];
    pagination: PaginationInfo;
    load_info: LoadInfo;
}

interface CatalogProps {
    products: ApiResponse<Product>;
    bestSellerProducts: Product[];
    categories: CategoryOption[];
    types: string[];
    filters: {
        search?: string;
        type?: string;
        category?: string;
        minPrice?: string;
        maxPrice?: string;
        sort?: string;
        perPage?: string | number;
    };
}

const FeaturedProductsBanner = ({
    products,
}: {
    products: Product[];
}) => {

    const featuredProducts = products.filter(
        (product) => product.is_featured
    );

    if (featuredProducts.length === 0) {
        return null;
    }

    return (
        <div className="group mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-white to-slate-500 transition-all duration-300">

            {/* HEADER */}
            <div className="flex flex-wrap gap-3 items-center justify-between px-5 py-4">
                <div className="flex flex-wrap items-center gap-3">
                    {/* Ikon dengan efek scale saat banner di-hover */}
                    <div className="rounded-2xl bg-gradient-to-tr animate-pulse from-orange-500 to-amber-400 p-2.5 text-white shadow-md shadow-orange-500/20 transition-transform duration-300 group-hover:scale-110">
                        <HandHeartIcon className="h-5 w-5" />
                    </div>

                    <div>
                        <h3 className="bg-gradient-to-r from-blue-50 via-slate-200 to-amber-500 bg-clip-text text-lg font-bold text-transparent">
                            Direkomendasikan Untukmu
                        </h3>
                        <p className="text-xs font-medium text-slate-300">
                            Produk terbaik yang dipilih khusus untuk Anda
                        </p>
                    </div>
                </div>

                {/* Badge Jumlah Produk yang Lebih Modern */}
                <div className="rounded-full bg-orange-50 border border-orange-200/60 px-3 py-1.5 text-xs font-semibold text-orange-600 backdrop-blur-sm">
                    {featuredProducts.length} Pilihan
                </div>
            </div>

            {/* CONTENT (Horizontal Scroll Section) */}
            {/* Ditambahkan 'scrollbar-none' (jika pakai plugin) atau standard utility untuk menyembunyikan scrollbar */}
            <div className="flex min-w-full max-w-3xl gap-4 overflow-x-auto px-5 pb-5 pt-2 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {featuredProducts.map((product) => (
                    <div
                        key={product.id}
                        className="w-60 flex-shrink-0 transition-all duration-300 hover:-translate-y-1.5 hover:drop-shadow-xl"
                    >
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
};



function Catalog({ products: initialProducts, bestSellerProducts, categories, types, filters: initialPropsFilters }: CatalogProps) {
    const { filters: initialFilters } = usePage().props as any;
    
    const [filters, setFilters] = useState({
        search: initialFilters?.search || '',
        type: initialFilters?.type || '',
        category: initialFilters?.category || '',
        perPage: initialFilters?.perPage || '12',
        minPrice: initialFilters?.minPrice || '',
        maxPrice: initialFilters?.maxPrice || '',
        sort: initialFilters?.sort?.toString() || 'price-asc',
    });
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isMobileFilterOpen, setIsMobileFilterOpen] =
    useState(false);
    
    // Product Skeleton Component
    const ProductSkeleton = () => (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm animate-pulse">
            <div className="aspect-square w-full rounded-md bg-gray-200 mb-4"></div>
            <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="flex space-x-2">
                    <div className="h-8 bg-gray-200 rounded flex-1"></div>
                    <div className="h-8 bg-gray-200 rounded flex-1"></div>
                </div>
            </div>
        </div>
    );
    
    // Extract products and pagination from the API response
    const { data: products, pagination } = initialProducts;
    
    // Update local state when filters from server change
    useEffect(() => {
        setFilters({
            search: initialFilters?.search || '',
            type: initialFilters?.type || '',
            category: initialFilters?.category || '',
            perPage: initialFilters?.perPage || '12',
            minPrice: initialFilters?.minPrice || '',
            maxPrice: initialFilters?.maxPrice || '',
            sort: initialFilters?.sort?.toString() || 'price-asc',
        });
    }, [initialFilters]);

    // Reset loading state when products are updated
    useEffect(() => {
        if (products && products.length >= 0) {
            setIsLoading(false);
        }
    }, [products]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        setHasChanges(true); // Mark that changes have been made
    };

    const applyFilters = () => {
        setIsLoading(true); // Show skeleton loading
        // Update URL with new filters
        const params = new URLSearchParams();
        
        // Only include valid filter values in the URL
        Object.entries(filters).forEach(([key, val]) => {
            // Skip functions and empty values
            if (typeof val === 'function' || val === null || val === undefined) return;
            // Convert to string and trim whitespace
            const stringValue = String(val).trim();
            if (stringValue) {
                params.set(key, stringValue);
            }
        });
        
        // Ensure sort has a valid value
        const validSortValues = ['price-asc', 'price-desc', 'name-asc', 'name-desc'];
        if (params.has('sort') && !validSortValues.includes(params.get('sort')!)) {
            params.set('sort', 'price-asc');
        }
        
        setHasChanges(false);
        router.get(`/catalog?${params.toString()}`, {}, {
            preserveState: true,
            only: ['products', 'filters']
        });
    };

    const resetFilters = () => {
        const resetFilters = {
            search: '',
            type: '',
            category: '',
            perPage: '12',
            minPrice: '',
            maxPrice: '',
            sort: 'price-asc',
        };
        
        setFilters(resetFilters);
        setHasChanges(false);
        router.get('/catalog');
    };

    const renderDesktopFilters = () => {

        return (
            <div className="mb-6 hidden rounded-2xl border border-slate-300 bg-white p-5 shadow-sm lg:block transition-all duration-300 hover:shadow-md sticky top-30 bg-white/80 backdrop-blur-sm border-b border-slate-200 z-40">

                {/* DEFAULT VIEW (TOP BAR) */}
                <div className="flex items-center gap-4">
                    
                    {/* SEARCH BAR (Mengambil space terbesar) */}
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-orange-500" />
                        <input
                            type="text"
                            placeholder="Cari produk di sini..."
                            value={filters.search}
                            onChange={(e) => {
                                setFilters(prev => ({ ...prev, search: e.target.value }));
                                setHasChanges(true);
                            }}
                            className="h-10 w-full rounded-xl border-[2px] border-slate-100/20! bg-slate-50/50 pl-11 pr-4 text-sm font-medium outline-none transition-all placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                        />
                    </div>

                    {/* DEFAULT CATEGORY FILTER (Sekarang muncul di depan) */}
                    <div className="w-64">
                        <CategoryFilter
                            categories={categories}
                            selectedCategory={filters.category}
                            onCategoryChange={(value) => {
                                setFilters(prev => ({ ...prev, category: value }));
                                setHasChanges(true);
                            }}
                            placeholder="Semua Kategori"
                        />
                    </div>

                    {/* CONTROLLER ACTION BUTTONS */}
                    <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
                        {/* Tombol Toggle Advance Filter */}
                        <button
                            type="button"
                            onClick={() => setIsFiltersOpen(prev => !prev)}
                            className={`inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-all duration-200 ${
                                isFiltersOpen 
                                    ? 'border-orange-200 bg-orange-50 text-orange-600' 
                                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            <span>Filter</span>
                            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isFiltersOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Tombol Terapkan */}
                        <button
                            onClick={applyFilters}
                            disabled={!hasChanges}
                            className={`inline-flex h-10 items-center rounded-xl px-6 text-sm font-bold transition-all duration-200 shadow-sm ${
                                hasChanges
                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:opacity-95 hover:shadow-md hover:shadow-orange-500/10'
                                    : 'cursor-not-allowed bg-slate-100 text-slate-400 shadow-none'
                            }`}
                        >
                            Terapkan
                        </button>
                    </div>
                </div>

                {/* ADVANCED FILTER PANEL (COLLAPSIBLE) */}
                {isFiltersOpen && (
                    <div className="mt-5 animate-fadeIn border-t border-slate-100 pt-5">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">

                            {/* ADVANCED: TYPE */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tipe</label>
                                <select
                                    value={filters.type || ''}
                                    onChange={(e) => {
                                        setFilters(prev => ({ ...prev, type: e.target.value }));
                                        setHasChanges(true);
                                    }}
                                    className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-50"
                                >
                                    <option value="">Semua Tipe</option>
                                    {types.map((type) => (
                                        <option key={type} value={type}>
                                            {type === 'rent' ? '🏢 Disewakan' : type === 'sell' ? '🏷️ Dijual' : '🔄 Disewakan & Dijual'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* ADVANCED: SORT */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Urutkan</label>
                                <div className="relative">
                                    <select
                                        value={filters.sort || 'price-asc'}
                                        onChange={(e) => {
                                            setFilters(prev => ({ ...prev, sort: e.target.value }));
                                            setHasChanges(true);
                                        }}
                                        className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-50"
                                    >
                                        <option value="price-asc">Harga Terendah</option>
                                        <option value="price-desc">Harga Tertinggi</option>
                                        <option value="name-asc">Nama A-Z</option>
                                        <option value="name-desc">Nama Z-A</option>
                                    </select>
                                    <ArrowUpDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                </div>
                            </div>

                            {/* ADVANCED: MIN PRICE */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Harga Minimum</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">Rp</span>
                                    <input
                                        type="number"
                                        value={filters.minPrice}
                                        onChange={(e) => {
                                            setFilters(prev => ({ ...prev, minPrice: e.target.value }));
                                            setHasChanges(true);
                                        }}
                                        placeholder="0"
                                        className="h-11 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm font-medium outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-50"
                                    />
                                </div>
                            </div>

                            {/* ADVANCED: MAX PRICE */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Harga Maksimum</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">Rp</span>
                                    <input
                                        type="number"
                                        value={filters.maxPrice}
                                        onChange={(e) => {
                                            setFilters(prev => ({ ...prev, maxPrice: e.target.value }));
                                            setHasChanges(true);
                                        }}
                                        placeholder="Tak terbatas"
                                        className="h-11 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm font-medium outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-50"
                                    />
                                </div>
                            </div>

                            {/* ADVANCED: PER PAGE & RESET (Digabung dalam satu kolom) */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tampilkan</label>
                                <div className="flex gap-2">
                                    <select
                                        value={String(filters.perPage || '12')}
                                        onChange={(e) => {
                                            setFilters(prev => ({ ...prev, perPage: e.target.value }));
                                            setHasChanges(true);
                                        }}
                                        className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 outline-none transition focus:border-orange-400"
                                    >
                                        <option value="12">12 Item</option>
                                        <option value="24">24 Item</option>
                                        <option value="48">48 Item</option>
                                        <option value="100">100 Item</option>
                                    </select>

                                    {/* RESET BUTTON */}
                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 transition-colors hover:bg-red-100 active:scale-95"
                                        title="Reset Filter"
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderMobileFilters = () => {
    return (
        <>
            {/* BUTTON TRIGGER MOBILE */}
            <div className="mb-4 flex items-center justify-between lg:hidden">
                <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="inline-flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm active:scale-95 transition-transform"
                >
                    <Filter className="h-4 w-4 text-orange-500" />
                    <span>Filter & Urutkan</span>
                </button>

                <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                    {pagination.total} Produk
                </span>
            </div>

            {/* DRAWER / SIDEBAR MOBILE */}
            <div
                className={`fixed inset-0 z-50 lg:hidden ${
                    isMobileFilterOpen ? 'pointer-events-auto' : 'pointer-events-none'
                }`}
            >
                {/* OVERLAY */}
                <div
                    onClick={() => setIsMobileFilterOpen(false)}
                    className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
                        isMobileFilterOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                />

                {/* CONTENT SIDEBAR */}
                <div
                    className={`absolute right-0 top-0 flex h-full w-[85%] max-w-[360px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
                        isMobileFilterOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    {/* HEADER (Fixed Top) */}
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <div>
                            <h2 className="text-base font-bold text-slate-900">Filter Produk</h2>
                            <p className="text-xs text-slate-500">Temukan produk yang sesuai</p>
                        </div>
                        <button
                            onClick={() => setIsMobileFilterOpen(false)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* SCROLLABLE FILTER FORM */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-24">
                        
                        {/* 1. SEARCH INPUT */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cari Kata Kunci</label>
                            <div className="relative">
                                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Nama produk, merk, dll..."
                                    value={filters.search}
                                    onChange={(e) => {
                                        setFilters(prev => ({ ...prev, search: e.target.value }));
                                        setHasChanges(true);
                                    }}
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-sm font-medium outline-none focus:border-orange-400 focus:bg-white"
                                />
                            </div>
                        </div>

                        {/* 2. CATEGORY FILTER */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori</label>
                            <CategoryFilter
                                categories={categories}
                                selectedCategory={filters.category}
                                onCategoryChange={(value) => {
                                    setFilters(prev => ({ ...prev, category: value }));
                                    setHasChanges(true);
                                }}
                                placeholder="Semua Kategori"
                            />
                        </div>

                        {/* 3. TYPE FILTER */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tipe Transaksi</label>
                            <select
                                value={filters.type || ''}
                                onChange={(e) => {
                                    setFilters(prev => ({ ...prev, type: e.target.value }));
                                    setHasChanges(true);
                                }}
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none"
                            >
                                <option value="">Semua Tipe</option>
                                {types.map((type) => (
                                    <option key={type} value={type}>
                                        {type === 'rent' ? '🏢 Disewakan' : type === 'sell' ? '🏷️ Dijual' : '🔄 Disewakan & Dijual'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 4. SORT FILTER */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Urutan Harga & Nama</label>
                            <div className="relative">
                                <select
                                    value={filters.sort || 'price-asc'}
                                    onChange={(e) => {
                                        setFilters(prev => ({ ...prev, sort: e.target.value }));
                                        setHasChanges(true);
                                    }}
                                    className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-10 text-sm font-medium text-slate-700 outline-none"
                                >
                                    <option value="price-asc">Harga Terendah</option>
                                    <option value="price-desc">Harga Tertinggi</option>
                                    <option value="name-asc">Nama A-Z</option>
                                    <option value="name-desc">Nama Z-A</option>
                                </select>
                                <ArrowUpDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>

                        {/* 5. PRICE RANGE (MIN - MAX) */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rentang Harga (Rp)</label>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="number"
                                    value={filters.minPrice}
                                    onChange={(e) => {
                                        setFilters(prev => ({ ...prev, minPrice: e.target.value }));
                                        setHasChanges(true);
                                    }}
                                    placeholder="Minimal"
                                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-medium outline-none focus:border-orange-400"
                                />
                                <input
                                    type="number"
                                    value={filters.maxPrice}
                                    onChange={(e) => {
                                        setFilters(prev => ({ ...prev, maxPrice: e.target.value }));
                                        setHasChanges(true);
                                    }}
                                    placeholder="Maksimal"
                                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-medium outline-none focus:border-orange-400"
                                />
                            </div>
                        </div>

                        {/* 6. PER PAGE */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Jumlah Tampilan</label>
                            <select
                                value={String(filters.perPage || '12')}
                                onChange={(e) => {
                                    setFilters(prev => ({ ...prev, perPage: e.target.value }));
                                    setHasChanges(true);
                                }}
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none"
                            >
                                <option value="12">Tampilkan 12 Produk</option>
                                <option value="24">Tampilkan 24 Produk</option>
                                <option value="48">Tampilkan 48 Produk</option>
                            </select>
                        </div>
                    </div>

                    {/* STICKY BOTTOM ACTIONS (Fixed di bawah Drawer agar gampang di-klik jempol) */}
                    <div className="absolute bottom-0 left-0 flex w-full gap-2 border-t border-slate-100 bg-white p-4">
                        {/* Reset Button */}
                        <button
                            type="button"
                            onClick={() => {
                                resetFilters();
                                setIsMobileFilterOpen(false); // Otomatis tutup setelah reset (opsional)
                            }}
                            className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 active:bg-red-100"
                            title="Reset Semua"
                        >
                            <RotateCcw className="h-4 w-4" />
                        </button>

                        {/* Apply Button */}
                        <button
                            onClick={() => {
                                applyFilters();
                                setIsMobileFilterOpen(false); // Tutup drawer setelah filter diterapkan
                            }}
                            disabled={!hasChanges}
                            className={`flex-1 h-12 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-[0.98] ${
                                hasChanges
                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                                    : 'cursor-not-allowed bg-slate-100 text-slate-400'
                            }`}
                        >
                            Terapkan Filter
                        </button>
                    </div>
                </div>
            </div>
        </>    
    )};

    return (
        <div className="container bg-white dark:bg-gray-800 mx-auto px-4 flex flex-col lg:flex-row gap-7 py-7">
    
            {renderMobileFilters()}
            
            {/* Product Grid */}
            <div className="flex-1">

                {renderDesktopFilters()}

                <div className="mb-6 flex flex-col md:flex-row gap-2 items-center justify-between">
                    <p className="text-gray-600 dark:text-gray-200 text-xs md:text-sm">
                        Menampilkan {products.length} dari {pagination.total} produk
                    </p>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-800">Tampilkan per halaman:</span>
                        <select 
                            className="rounded-lg border border-gray-300 p-1.5 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                            value={String(filters.perPage || '12')}
                            onChange={(e) => {
                                const newFilters = { ...filters, perPage: e.target.value };
                                setFilters(newFilters);
                                setIsLoading(true); // Show skeleton loading
                                
                                // Update URL with new filters immediately
                                const params = new URLSearchParams();
                                if (newFilters.search) params.append('search', newFilters.search);
                                if (newFilters.type) params.append('type', newFilters.type);
                                if (newFilters.category) params.append('category', newFilters.category);
                                params.append('perPage', newFilters.perPage);
                                if (newFilters.minPrice) params.append('minPrice', newFilters.minPrice);
                                if (newFilters.maxPrice) params.append('maxPrice', newFilters.maxPrice);
                                if (newFilters.sort) params.append('sort', newFilters.sort);
                                
                                router.get(`/catalog?${params.toString()}`, {}, {
                                    preserveState: true,
                                    only: ['products', 'filters']
                                });
                            }}
                        >
                            <option value="12">12</option>
                            <option value="24">24</option>
                            <option value="48">48</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                </div>

                {bestSellerProducts.length > 0 && (
                    <FeaturedProductsBanner
                        products={bestSellerProducts}
                    />
                )}

                {isLoading ? (
                    <div className="grid md:grid-cols-2 gap-3 md:gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
                        {Array.from({ length: parseInt(filters.perPage) || 12 }).map((_, index) => (
                            <ProductSkeleton key={index} />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="rounded-lg bg-white p-12 min-h-[60vh] flex items-center justify-center flex-col text-center shadow">
                        <LayoutDashboard className="mx-auto mb-4 h-24 w-24 text-orange-400" />
                        <label className="mb-2 text-2xl font-medium">Produk tidak ditemukan</label>
                        <p className="mb-4 text-gray-600">Coba ubah filter pencarian Anda</p>
                        <button
                            onClick={resetFilters}
                            className="rounded-lg bg-amber-500 px-4 py-2 font-medium text-white hover:bg-amber-600"
                        >
                            Reset Filter
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {products.map((product) => (
                                <ProductCard key={product.slug} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.total > 0 && (
                            <div className="mt-8 flex items-center justify-center">
                                <nav className="flex items-center space-x-1">
                                    <button
                                        onClick={() => {
                                            const prevPage = Math.max(1, pagination.current_page - 1);
                                            if (prevPage !== pagination.current_page) {
                                                router.get(`/catalog?page=${prevPage}`, {}, {
                                                    preserveState: true,
                                                    only: ['products', 'filters']
                                                });
                                            }
                                        }}
                                        disabled={pagination.current_page === 1}
                                        className={`flex h-10 w-10 items-center justify-center rounded-md border ${
                                            pagination.current_page === 1
                                                ? 'border-gray-200 bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                                : 'border-gray-300 bg-white dark:bg-gray-900 text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        <ArrowLeft />
                                    </button>
                                    
                                    <span className="px-4 text-sm text-gray-500">
                                        Halaman {pagination.current_page}
                                    </span>
                                    
                                    <button
                                        onClick={() => {
                                            const nextPage = pagination.current_page + 1;
                                            router.get(`/catalog?page=${nextPage}`, {}, {
                                                preserveState: true,
                                                only: ['products', 'filters']
                                            });
                                        }}
                                        disabled={products.length < pagination.per_page}
                                        className={`flex h-10 w-10 items-center justify-center rounded-md border ${
                                            products.length < pagination.per_page
                                                ? 'border-gray-200 bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                                : 'border-gray-300 bg-white dark:bg-gray-900 text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        <ArrowRight />
                                    </button>
                                </nav>
                            </div>
                        )}
                    </>
                )}
            </div> 
        </div>
    );
}

export default function CatalogPage({ products, bestSellerProducts, categories, types, filters }: CatalogProps) {
    const { getConfig } = useConfig();
    return (
        <FrontendLayout>
            <SeoHead title={'Katalog Produk'} />

            <Catalog products={products} bestSellerProducts={bestSellerProducts} categories={categories} types={types} filters={filters} />
        </FrontendLayout>
    );
}