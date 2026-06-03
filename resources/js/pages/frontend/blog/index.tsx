import { Head, Link, useForm, router } from '@inertiajs/react';
import FrontendLayout from '@/layouts/frontend-layout';
import { Calendar, Eye, User, Search, Filter, Tag, TagIcon, Folder, Hash, SearchIcon } from 'lucide-react';
import { handleImageError } from '@/utils/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SeoHead from '@/components/seo-head';
import { useConfig } from '@/utils/config';

type BlogPost = {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    featured_image: string;
    author: {
        name: string;
    };
    published_at: string;
    views_count: number;
    category?: {
        id: number;
        name: string;
        slug: string;
    };
};

type Props = {
    headline_posts: BlogPost[];
    most_read_posts: BlogPost[];
    recent_posts: BlogPost[];
    all_posts: {
        data: BlogPost[];
        links: any;
    };
    categories: Array<{ id: number; name: string; slug: string; type: string; }>;
    popular_tags: string[];
    filters?: {
        search?: string;
        category?: string;
        tag?: string;
    };
};

export default function BlogIndex({ 
    headline_posts, 
    most_read_posts, 
    recent_posts, 
    all_posts, 
    categories, 
    popular_tags,
    filters = {} 
}: Props) {
    const { getConfig } = useConfig();
    const { data, setData, get } = useForm({
        search: filters.search || '',
        category: filters.category || '',
        tag: filters.tag || '',
    });

    const isLoading =
        !headline_posts ||
        !most_read_posts ||
        !recent_posts;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        get('/articles', {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleCategoryChange = (categoryId: string) => {
        setData('category', categoryId);
        setData('tag', ''); // Clear tag when category changes
        get('/articles', {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleTagClick = (tag: string) => {
        setData('tag', tag);
        setData('category', ''); // Clear category when tag changes
        get('/articles', {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });

    // 🔹 Skeleton
    const SkeletonItem = () => (
        <div className="flex gap-4 animate-pulse">
            <div className="w-28 h-20 bg-gray-200 rounded" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
        </div>
    );

    // 🔹 Item list ala kompas
    const PostItem = ({ post, headline }: { post: BlogPost; headline?: boolean }) => (
        <div className={`flex flex-col ${headline ? 'md:flex-col' : 'md:flex-row'} gap-4 py-4`}>
            
            <img
                src={`/storage/${post.featured_image}`}
                className={headline 
                    ? "w-full h-52 object-cover rounded-md" 
                    : "w-full md:w-32 md:h-32 object-cover rounded-md"
                }
                onError={(e) => handleImageError(e, undefined, post.title)}
                loading="lazy"
            />

            <div className="flex-1">
                <Link href={`/articles/${post.slug}`}>
                    <h3 className={`font-bold text-gray-900 dark:text-white leading-snug hover:text-orange-600 ${
                        headline ? 'text-base' : 'text-lg md:text-xl'
                    }`}>
                        {post.title}
                    </h3>
                </Link>

                {!headline && (
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {post.excerpt}
                    </p>
                )}

                <div className="text-xs text-gray-400 mt-2 flex gap-3 flex-wrap">
                    {/* <span className="flex items-center gap-1">
                        <User size={12} /> {post.author.name}
                    </span> */}
                    {post.category && (
                        <span className="flex items-center gap-1">
                            <TagIcon size={12} /> { post.category?.name ?? 'Artikel'}
                        </span>
                    )}
                    {post.category && <span>•</span>}
                    <span className="flex items-center gap-1">
                        <Calendar size={12} /> {formatDate(post.published_at)}
                    </span>
                    {post.views_count > 0 && (<span>•</span>)}
                    <span className="flex items-center gap-1">
                        <Eye size={12} /> {post.views_count}
                    </span>
                </div>
            </div>
        </div>
    );

    const Section = ({
        title,
        data,
        grid = false,
        gridColumns = 1,
        isHeadline = false,
    }: {
        title: string;
        data: BlogPost[];
        grid?: boolean;
        gridColumns?: number;
        isHeadline?: boolean;
    }) => (
        <div className="mb-10">
            <h2 className="text-lg border-l-4 border-l-orange-400 px-4 font-black border-b pb-2 mb-4">
                {title}
            </h2>

            <div className={grid ? `grid grid-cols-1 md:grid-cols-${gridColumns} gap-4` : "space-y-1"}>
                {isLoading
                    ? Array.from({ length: 3 }).map((_, i) => (
                          <SkeletonItem key={i} />
                      ))
                    : data.map((post) => (
                          <PostItem key={post.id} post={post} headline={isHeadline} />
                      ))}
            </div>
        </div>
    );

    return (
        <FrontendLayout>
            <SeoHead title={'Artikel'} />

            <div className="max-w-6xl mx-auto px-4 py-8 space-y-7">

                {/* 🔍 FILTER + TAGS */}
                <div className="rounded-2xl border border-border bg-background shadow-sm p-4 md:p-5 space-y-5">

                    {/* HEADER */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-2">

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-foreground">
                                    Filter Berita
                                </h3>

                                <p className="text-xs text-muted-foreground">
                                    Cari berita berdasarkan keyword, kategori, atau tag
                                </p>
                            </div>

                        </div>

                        {/* RESET */}
                        {(data.search || data.category || data.tag) && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setData({
                                        search: '',
                                        category: '',
                                        tag: '',
                                    });

                                    router.get(
                                        '/articles',
                                        {},
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                        }
                                    );
                                }}
                                className="w-full sm:w-auto text-destructive hover:text-destructive"
                            >
                                Reset Filter
                            </Button>
                        )}

                    </div>

                    {/* SEARCH */}
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-col gap-3 md:flex-row"
                    >

                        {/* INPUT */}
                        <div className="relative flex-1">

                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                            <Input
                                type="text"
                                placeholder="Cari berita..."
                                value={data.search}
                                onChange={(e) => setData('search', e.target.value)}
                                className="pl-10 h-11"
                            />

                        </div>

                        {/* CATEGORY */}
                        <select
                            value={data.category}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="
                                h-11 w-full md:w-60
                                rounded-lg border border-input
                                bg-background px-3 text-sm
                                text-foreground
                                focus:outline-none
                                focus:ring-2 focus:ring-ring
                            "
                        >

                            <option value="">
                                Semua kategori
                            </option>

                            {categories
                                .filter(cat => cat.type === 'blog')
                                .map((category) => (

                                <option
                                    key={category.id}
                                    value={category.slug}
                                >
                                    {category.name}
                                </option>

                            ))}

                        </select>

                        {/* BUTTON */}
                        <Button
                            type="submit"
                            className="h-11 w-full md:w-auto"
                        >
                            <SearchIcon className="w-3 h-3 inline-block" />
                            Cari Berita
                        </Button>

                    </form>

                    {/* ACTIVE FILTER */}
                    {(data.search || data.category || data.tag) && (

                        <div className="flex flex-wrap gap-2 border-t border-border pt-4">

                            {data.search && (
                                <div className="
                                    inline-flex items-center gap-1.5
                                    rounded-full border border-border
                                    bg-muted px-3 py-1.5
                                    text-xs text-foreground
                                ">
                                    <Search className="h-3 w-3" />
                                    {data.search}
                                </div>
                            )}

                            {data.category && (
                                <div className="
                                    inline-flex items-center gap-1.5
                                    rounded-full
                                    bg-blue-500/10
                                    px-3 py-1.5
                                    text-xs text-blue-600
                                    dark:text-blue-400
                                ">
                                    <Folder className="h-3 w-3" />

                                    {
                                        categories.find(
                                            c => c.id.toString() === data.category
                                        )?.name
                                    }

                                </div>
                            )}

                            {data.tag && (
                                <div className="
                                    inline-flex items-center gap-1.5
                                    rounded-full
                                    bg-purple-500/10
                                    px-3 py-1.5
                                    text-xs text-purple-600
                                    dark:text-purple-400
                                ">
                                    <Hash className="h-3 w-3" />
                                    {data.tag}
                                </div>
                            )}

                        </div>

                    )}

                    {/* TAGS */}
                    {popular_tags.length > 0 && (

                        <div className="space-y-3 border-t border-border pt-4">

                            <div className="flex items-center gap-2 text-sm font-medium text-foreground">

                                <Tag className="h-4 w-4 text-muted-foreground" />

                                <span>
                                    Tags Populer
                                </span>

                            </div>

                            <div className="flex flex-wrap gap-2">

                                {popular_tags.map((tag, index) => {

                                    const isActive = data.tag === tag;

                                    return (

                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handleTagClick(tag)}
                                            className={`
                                                rounded-full px-3 py-1.5
                                                text-xs font-medium
                                                transition-all duration-200

                                                ${isActive
                                                    ? `
                                                        bg-primary text-primary-foreground
                                                        shadow-sm
                                                    `
                                                    : `
                                                        border border-border
                                                        bg-muted/60
                                                        text-muted-foreground
                                                        hover:bg-muted
                                                        hover:text-foreground
                                                    `
                                                }
                                            `}
                                        >
                                            #{tag}
                                        </button>

                                    );
                                })}

                            </div>

                        </div>

                    )}

                </div>


                {/* 🔥 HEADLINE BESAR */}
                {!isLoading && headline_posts[0] && (
                    <div className="mb-10">
                        <Link href={`/articles/${headline_posts[0].slug}`}>
                            <div className="relative rounded-xl overflow-hidden">
                                <img
                                    src={
                                        `/storage/${headline_posts[0].featured_image}` ||
                                        '/images/placeholder.png'
                                    }
                                    onError={handleImageError}
                                    className="w-full h-[420px] object-cover"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end">
                                    <span className="text-xs text-white bg-orange-600 px-2 py-1 w-fit mb-2">
                                        HEADLINE
                                    </span>

                                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                                        {headline_posts[0].title}
                                    </h1>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                {/* 🔹 Headline lainnya */}
                <Section
                    title="Headline Lainnya"
                    grid={true}
                    gridColumns={3}
                    isHeadline={true}
                    data={headline_posts.slice(1)}
                />

                {/* 🔹 Most Read */}
                <Section
                    title="Terpopuler"
                    grid={true}
                    gridColumns={2}
                    data={most_read_posts}
                />

                {/* 🔹 Recent */}
                <Section
                    title="Terbaru"
                    grid={true}
                    gridColumns={2}
                    data={recent_posts}
                />

                {/* 🔹 Semua berita */}
                <div className="mb-10">
                    <h2 className="text-lg border-l-4 border-l-orange-400 px-4 font-bold border-b pb-2 mb-4">
                        Berita Lainnya
                    </h2>

                    <div className="space-y-1">
                        {isLoading
                            ? Array.from({ length: 5 }).map((_, i) => (
                                  <SkeletonItem key={i} />
                              ))
                            : all_posts.data.map((post) => (
                                  <PostItem key={post.id} post={post} />
                              ))}
                    </div>
                </div>

                {/* Pagination */}
                <div className="mt-8 flex justify-center flex-wrap gap-2">
                   {all_posts.links.map((link: any, i: number) => {

                        /*
                        |--------------------------------------------------------------------------
                        | Translate Pagination Label
                        |--------------------------------------------------------------------------
                        */
                        let label = link.label;

                        switch (label) {
                            case 'pagination.previous':
                                label = '← Sebelumnya';
                                break;

                            case 'pagination.next':
                                label = 'Berikutnya →';
                                break;

                            default:
                                label = label
                                    .replace('&laquo;', '')
                                    .replace('&raquo;', '')
                                    .trim();
                                break;
                        }

                        return (

                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`
                                    inline-flex items-center justify-center
                                    min-w-[40px] px-3 py-2
                                    text-sm font-medium
                                    rounded-lg transition-all duration-200

                                    ${link.active
                                        ? `
                                            bg-orange-600 text-white
                                            shadow-sm
                                        `
                                        : `
                                            bg-muted text-muted-foreground
                                            hover:bg-muted/80
                                        `
                                    }

                                    ${!link.url
                                        ? 'pointer-events-none opacity-50'
                                        : ''
                                    }
                                `}
                            >

                                {label}

                            </Link>

                        );
                    })}

                </div>

            </div>
        </FrontendLayout>
    );
}