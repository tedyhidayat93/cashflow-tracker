import { Head } from '@inertiajs/react';
import { useConfig } from '@/utils/config';

interface SeoHeadProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
}

export default function SeoHead({
    title,
    description,
    keywords,
    image,
    url,
}: SeoHeadProps) {

    /*
    |--------------------------------------------------------------------------
    | CONFIG
    |--------------------------------------------------------------------------
    */

    const { getConfig } = useConfig();

    /*
    |--------------------------------------------------------------------------
    | BASIC CONFIG
    |--------------------------------------------------------------------------
    */

    const siteName = getConfig(
        'site_name',
        import.meta.env.VITE_APP_NAME || 'Your Site'
    );

    const siteTagline = getConfig(
        'site_tagline',
        'Your Site Tagline'
    );

    const metaDescription =
        description ||
        getConfig(
            'meta_description',
            `${siteName} | ${siteTagline}`
        );

    const metaKeywords =
        keywords ||
        getConfig(
            'meta_keywords',
            siteName
        );

    /*
    |--------------------------------------------------------------------------
    | STORAGE FILES
    |--------------------------------------------------------------------------
    */

    const siteLogo = getConfig('site_logo', '');
    const siteFavicon = getConfig('site_favicon', '');

    /*
    |--------------------------------------------------------------------------
    | URL
    |--------------------------------------------------------------------------
    */

    const baseUrl =
        typeof window !== 'undefined'
            ? window.location.origin
            : import.meta.env.VITE_APP_URL || 'http://localhost';

    const currentUrl =
        url ||
        (
            typeof window !== 'undefined'
                ? window.location.href
                : baseUrl
        );

    /*
    |--------------------------------------------------------------------------
    | FILE URL HELPER
    |--------------------------------------------------------------------------
    */

    const getFileUrl = (
        path?: string,
        fallback = '/favicon.png'
    ) => {

        if (!path) {
            return `${baseUrl}${fallback}`;
        }

        if (
            path.startsWith('http://') ||
            path.startsWith('https://')
        ) {
            return path;
        }

        return path.startsWith('configurations/')
            ? `${baseUrl}/storage/${path}`
            : `${baseUrl}/${path}`;
    };

    /*
    |--------------------------------------------------------------------------
    | IMAGE
    |--------------------------------------------------------------------------
    */

    const defaultLogo =
        getFileUrl(siteLogo);

    const faviconUrl =
        getFileUrl(siteFavicon);

    const imageUrl =
        image || defaultLogo;

    /*
    |--------------------------------------------------------------------------
    | SEO TITLE
    |--------------------------------------------------------------------------
    */

    const fullTitle = title
        ? `${title} | ${siteName}`
        : `${siteName} | ${siteTagline}`;

    /*
    |--------------------------------------------------------------------------
    | SOCIAL MEDIA
    |--------------------------------------------------------------------------
    */

    const socialLinks = [

        getConfig('social_facebook', ''),
        getConfig('social_twitter', ''),
        getConfig('social_instagram', ''),
        getConfig('social_youtube', ''),
        getConfig('social_tiktok', ''),

    ].filter(Boolean);

    return (

        <Head title={fullTitle}>

            {/* BASIC SEO */}
            <meta
                head-key="description"
                name="description"
                content={metaDescription}
            />

            <meta
                head-key="title"
                content={fullTitle}
            />

            <meta
                head-key="og:description"
                property="og:description"
                content={metaDescription}
            />

            <meta
                head-key="og:image"
                property="og:image"
                content={imageUrl}
            />

            <meta
                head-key="twitter:image"
                name="twitter:image"
                content={imageUrl}
            />

            <link
                head-key="canonical"
                rel="canonical"
                href={currentUrl}
            />

            {/* OPEN GRAPH */}
            <meta property="og:type" content="website" />

            <meta
                property="og:site_name"
                content={siteName}
            />

            <meta
                property="og:title"
                content={fullTitle}
            />

            <meta
                property="og:description"
                content={metaDescription}
            />

            <meta
                property="og:url"
                content={currentUrl}
            />

            <meta
                property="og:image"
                content={imageUrl}
            />

            <meta
                property="og:image:secure_url"
                content={imageUrl}
            />

            <meta
                property="og:image:type"
                content="image/png"
            />

            <meta
                property="og:image:width"
                content="1200"
            />

            <meta
                property="og:image:height"
                content="630"
            />

            <meta
                property="og:locale"
                content="id_ID"
            />

            {/* TWITTER */}
            <meta
                name="twitter:card"
                content="summary_large_image"
            />

            <meta
                name="twitter:title"
                content={fullTitle}
            />

            <meta
                name="twitter:description"
                content={metaDescription}
            />

            <meta
                name="twitter:image"
                content={imageUrl}
            />

            <meta
                name="twitter:url"
                content={currentUrl}
            />

            {/* FAVICON */}
            <link
                rel="icon"
                type="image/png"
                href={faviconUrl}
            />

            <link
                rel="apple-touch-icon"
                href={faviconUrl}
            />

            {/* THEME */}
            <meta
                name="theme-color"
                content="#f59e0b"
            />

            {/* STRUCTURED DATA */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',

                        '@type': 'Organization',

                        name: siteName,

                        url: baseUrl,

                        logo: imageUrl,

                        image: imageUrl,

                        description: metaDescription,

                        keywords: metaKeywords,

                        sameAs: socialLinks,
                    }),
                }}
            />

        </Head>
    );
}