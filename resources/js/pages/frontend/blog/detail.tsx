import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/layouts/frontend-layout';
import { Button } from '@/components/ui/button';
import { getConfig } from '@/hooks/use-configuration';
import { ArrowLeft, Calendar, Clock, User, Share2, Facebook, Twitter, Linkedin, Link2, Eye, MessageCircle, Instagram, Music, Copy } from 'lucide-react';
import { useConfig } from '@/utils/config';
import { generateBlogUrl } from '@/utils/app';
import { handleImageError } from '@/utils/image';
import SeoHead from '@/components/seo-head';

interface Article {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featured_image?: string;
    published_at: string;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    author: {
        name: string;
    };
    views_count: number;
    reading_time?: number;
    tags?: string[];
    is_headline?: boolean;
    category?: {
        id: number;
        name: string;
        slug: string;
    };
}

interface BlogDetailProps {
    post: Article;
    related_posts?: Article[];
}

export default function BlogDetail({ post, related_posts = [] }: BlogDetailProps) {

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

    const readingTime = post.reading_time || Math.ceil(post.content.split(' ').length / 200);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <FrontendLayout>
            <SeoHead
                title={post.meta_title || post.title}
                description={
                    post.meta_description
                    || post.excerpt
                }
                image={post.featured_image}
                keywords={post.meta_keywords || post.tags?.join(', ') || ''}
            />

            <div className="max-w-4xl mx-auto px-4 py-10">

                {/* Breadcrumb */}
                <nav
                    className="mb-6 flex max-w-full overflow-x-auto"
                    aria-label="Breadcrumb"
                >

                    <ol className="
                        inline-flex min-w-max items-center
                        space-x-1 md:space-x-2
                        text-sm text-nowrap
                    ">

                        {/* HOME */}
                        <li className="inline-flex items-center">

                            <Link
                                href="/"
                                className="
                                    text-muted-foreground
                                    transition-colors
                                    hover:text-primary
                                "
                            >
                                Beranda
                            </Link>

                        </li>

                        {/* ARTICLES */}
                        <li>

                            <div className="flex items-center">

                                <span className="mx-2 text-muted-foreground/60">
                                    /
                                </span>

                                <Link
                                    href="/articles"
                                    className="
                                        text-muted-foreground
                                        transition-colors
                                        hover:text-primary
                                    "
                                >
                                    Artikel
                                </Link>

                            </div>

                        </li>

                        {/* CATEGORY */}
                        {post.category && (

                            <li>

                                <div className="flex items-center">

                                    <span className="mx-2 text-muted-foreground/60">
                                        /
                                    </span>

                                    <Link
                                        href={`/articles?category=${post.category.id}`}
                                        className="
                                            text-muted-foreground
                                            transition-colors
                                            hover:text-primary
                                        "
                                    >
                                        {post.category.name}
                                    </Link>

                                </div>

                            </li>

                        )}

                        {/* TITLE */}
                        <li aria-current="page">

                            <div className="flex items-center">

                                <span className="mx-2 text-muted-foreground/60">
                                    /
                                </span>

                                <span className="
                                    max-w-[180px]
                                    font-medium text-foreground
                                    sm:max-w-xs md:max-w-md
                                ">
                                    {post.title}
                                </span>

                            </div>

                        </li>

                    </ol>

                </nav>



                {/* 🔥 HEADER */}
                <div className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900 dark:text-white">
                        {post.title}
                    </h1>

                    {/* META */}
                    <div className="mt-4 flex flex-wrap gap-2 md:gap-4 text-sm text-gray-500 dark:text-slate-300">
                        <span>
                            Oleh <strong>{post.author.name}</strong>
                        </span>

                        <span>•</span>

                        <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDate(post.published_at)}
                        </span>

                        <span>•</span>

                        <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {readingTime} menit baca
                        </span>

                        <span>•</span>

                        <span className="flex items-center gap-1">
                            <Eye size={14} />
                            {post.views_count} Dilihat
                        </span>

                        {/* CATEGORY */}
                        {post.category && (
                            <>
                                <span>•</span>
                                <Link href={`/articles?category=${post.category.id}`} className="text-blue-600 hover:text-blue-800">
                                    {post.category.name}
                                </Link>
                            </>
                        )}

                        {/* HEADLINE BADGE */}
                        {post.is_headline && (
                            <>
                                <span>•</span>
                                <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded">
                                    HEADLINE
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* 🔥 FEATURED IMAGE */}
                {post.featured_image && (
                    <div className="mb-6">
                        <img
                            src={`${post.featured_image}`}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => handleImageError(e, '/images/placeholder.png', post.title)}
                            alt={post.title}
                        />
                    </div>
                )}

                {/* 🔥 CONTENT */}
                <div className="prose prose-lg max-w-none leading-relaxed prose-headings:text-black prose-p:text-black text-gray-800 dark:text-gray-100 prose-strong:text-black prose-li:text-black prose-p:mb-4 prose-headings:mb-4 prose-headings:mt-6 prose-ul:mb-4 prose-ol:mb-4 prose-blockquote:mb-4 prose-table:mb-4 [&_*]:!text-black [&_*]:!text-gray-800 dark:[&_*]:!text-gray-100 [&_*]:!border-black [&_*]:!border-gray-300 dark:[&_*]:!border-gray-600 [&_*]:!bg-transparent [&_*]:!bg-white dark:[&_*]:!bg-gray-800 [&_*]:!shadow-none [&_a]:!text-blue-600 [&_a]:!no-underline hover:[&_a]:!underline [&_img]:!max-w-full [&_img]:!h-auto [&_table]:!w-full [&_table]:!border-collapse [&_td]:!border [&_th]:!border [&_td]:!p-2 [&_th]:!p-2 [&_blockquote]:!border-l-4 [&_blockquote]:!border-gray-300 [&_blockquote]:!pl-4 [&_blockquote]:!italic [&_ul]:!list-disc [&_ol]:!list-decimal [&_ul]:!pl-5 [&_ol]:!pl-5 [&_ul_li]:!mb-2 [&_ol_li]:!mb-2 [&_code]:!bg-gray-100 [&_code]:!px-1 [&_code]:!rounded [&_pre]:!bg-gray-100 [&_pre]:!p-4 [&_pre]:!rounded [&_pre]:!overflow-x-auto [&_h1]:!text-3xl [&_h1]:!font-bold [&_h1]:!mb-4 [&_h1]:!mt-8 [&_h2]:!text-2xl [&_h2]:!font-bold [&_h2]:!mb-4 [&_h2]:!mt-6 [&_h3]:!text-xl [&_h3]:!font-bold [&_h3]:!mb-4 [&_h3]:!mt-6 [&_h4]:!text-lg [&_h4]:!font-bold [&_h4]:!mb-3 [&_h4]:!mt-4 [&_h5]:!text-base [&_h5]:!font-semibold [&_h5]:!mb-3 [&_h5]:!mt-4 [&_h6]:!text-sm [&_h6]:!font-semibold [&_h6]:!mb-3 [&_h6]:!mt-4 [&_p]:!text-base [&_p]:!leading-relaxed [&_p]:!mb-4 [&_p]:!mt-0 [&_div]:!mb-4 [&_div]:!mt-0">
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>

                {/* 🔥 TAGS */}
                {post.tags && post.tags.length > 0 && (
                    <div className="mt-10 pt-6 border-t">
                        <h3 className="font-semibold mb-3 text-lg">Kata Kunci</h3>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag, i) => (
                                <span
                                    key={i}
                                    className="text-xs bg-gray-100 dark:bg-orange-300 dark:text-slate-900 px-2 py-1 rounded"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* 🔥 SHARE */}
                <div className="mt-10 pt-6 border-t">
                    <h3 className="font-semibold mb-3 text-lg">Bagikan</h3>
                    <div className="flex gap-2 flex-wrap">
                        <Button
                            size="sm"
                            className="bg-blue-600 text-white hover:bg-blue-700"
                            onClick={() =>
                                window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`)
                            }
                        >
                            <Facebook className="w-4 h-4 mr-2" />
                            Facebook
                        </Button>

                        <Button
                            size="sm"
                            className="bg-sky-500 text-white hover:bg-sky-600"
                            onClick={() =>
                                window.open(`https://twitter.com/intent/tweet?url=${shareUrl}`)
                            }
                        >
                            <Twitter className="w-4 h-4 mr-2" />
                            Twitter
                        </Button>

                        <Button
                            size="sm"
                            className="bg-blue-700 text-white hover:bg-blue-800"
                            onClick={() =>
                                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`)
                            }
                        >
                            <Linkedin className="w-4 h-4 mr-2" />
                            LinkedIn
                        </Button>

                        <Button
                            size="sm"
                            className="bg-green-500 text-white hover:bg-green-600"
                            onClick={() =>
                                window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this article: ${post.title} - ${shareUrl}`)}`)
                            }
                        >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            WhatsApp
                        </Button>

                        <Button
                            size="sm"
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                            onClick={() =>
                                window.open(`https://www.instagram.com/`)
                            }
                        >
                            <Instagram className="w-4 h-4 mr-2" />
                            Instagram
                        </Button>

                        <Button
                            size="sm"
                            className="bg-black text-white hover:bg-gray-800"
                            onClick={() =>
                                window.open(`https://www.tiktok.com/`)
                            }
                        >
                            <Music className="w-4 h-4 mr-2" />
                            TikTok
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            className="bg-orange-400 text-black dark:bg-white/30 dark:text-slate-200"
                            onClick={() => {
                                navigator.clipboard.writeText(shareUrl);
                                alert('Link berhasil disalin!');
                            }}
                        >
                            <Copy className="w-4 h-4 mr-2" />
                            Salin Link
                        </Button>
                    </div>
                </div>

                {/* 🔥 RELATED */}
                {related_posts.length > 0 && (
                    <div className="mt-12 pt-8 border-t">
                        <h3 className="text-xl font-bold mb-6 dark:text-orange-400">
                            Artikel Terkait
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            {related_posts.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/articles/${item.slug}`}
                                    className="group"
                                >
                                    <div className="flex gap-4">
                                        <img
                                            src={`${item.featured_image}`}
                                            className="w-28 h-24 object-cover rounded"
                                            onError={(e) => handleImageError(e, '/images/placeholder.png', item.title)}
                                            alt={item.title}
                                        />

                                        <div>
                                            <h4 className="font-semibold text-sm group-hover:text-blue-600">
                                                {item.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                {item.excerpt}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </FrontendLayout>
    );
}