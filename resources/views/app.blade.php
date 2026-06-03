<!DOCTYPE html>
<html
    lang="{{ str_replace('_', '-', app()->getLocale()) }}"
    @class([
        'dark' => ($appearance ?? 'light') === 'dark',
    ])
>

<head>

    {{-- BASIC --}}
    <meta charset="utf-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
    >

    {{-- APP URL --}}
    @php

        /*
        |--------------------------------------------------------------------------
        | DEFAULT CONFIG
        |--------------------------------------------------------------------------
        */

        $defaults = [

            'site_name'        => config('app.name', 'Laravel'),

            'site_tagline'     => 'Atur flow keuanganmu dalam genggaman',

            'meta_description' => null,

            'site_logo'        => null,

            'site_favicon'     => '/favicon.ico',
        ];

        /*
        |--------------------------------------------------------------------------
        | SITE CONFIG
        |--------------------------------------------------------------------------
        */

        $configs = collect($siteconfig ?? [])
            ->pluck('value', 'key');

        $siteName = $configs->get(
            'site_name',
            $defaults['site_name']
        );

        $siteTagline = $configs->get(
            'site_tagline',
            $defaults['site_tagline']
        );

        $siteDescription = $configs->get(
            'meta_description',
            "{$siteName} | {$siteTagline}"
        );

        /*
        |--------------------------------------------------------------------------
        | SITE TITLE
        |--------------------------------------------------------------------------
        */

        $siteTitle =
            "{$siteName} | {$siteTagline}";

        /*
        |--------------------------------------------------------------------------
        | CURRENT URL
        |--------------------------------------------------------------------------
        */

        $currentUrl =
            url()->current();

        /*
        |--------------------------------------------------------------------------
        | SITE LOGO
        |--------------------------------------------------------------------------
        */

        $siteLogo =
            $configs->get('site_logo');

        $siteImage =
            asset('images/logo-main.png');

        if ($siteLogo) {

            $siteImage =
                str_starts_with(
                    $siteLogo,
                    'configurations/'
                )
                    ? asset(
                        "storage/{$siteLogo}"
                    )
                    : asset($siteLogo);
        }

        /*
        |--------------------------------------------------------------------------
        | FAVICON
        |--------------------------------------------------------------------------
        */

        $siteFavicon = $configs->get(
            'site_favicon',
            $defaults['site_favicon']
        );

        $faviconPath =
            str_starts_with(
                $siteFavicon,
                'configurations/'
            )
                ? asset(
                    "storage/{$siteFavicon}"
                )
                : asset($siteFavicon);

        /*
        |--------------------------------------------------------------------------
        | SEO DATA
        |--------------------------------------------------------------------------
        */

        $seo =
            $page['props']['seo']
            ?? [];

        $seoTitle =
            $seo['title'] ? $seo['title'] . ' | ' . $siteName : $siteTitle;

        $seoDescription =
            $seo['description']
            ?? $siteDescription;

        $seoKeywords =
            $seo['keywords']
            ?? '';

        $seoImage =
            $seo['image']
            ?? $siteImage;

        $seoType =
            $seo['type']
            ?? 'website';

    @endphp

    {{-- DARK MODE --}}
    <script>
        (() => {

            const appearance =
                '{{ $appearance ?? "system" }}';

            if (appearance !== 'system') {
                return;
            }

            const prefersDark =
                window.matchMedia(
                    '(prefers-color-scheme: dark)'
                ).matches;

            if (prefersDark) {

                document.documentElement
                    .classList
                    .add('dark');
            }

        })();
    </script>

    {{-- BACKGROUND --}}
    <style>
        html {
            background-color:
                oklch(1 0 0);
        }

        html.dark {
            background-color:
                oklch(0.145 0 0);
        }
    </style>

    {{-- TITLE --}}
    <title inertia>
        {{ $seoTitle }}
    </title>

    {{-- BASIC SEO --}}
    <meta
        name="description"
        content="{{ $seoDescription }}"
    >

    <meta
        name="keywords"
        content="{{ $seoKeywords }}"
    >

    <meta
        name="robots"
        content="index, follow"
    >

    <meta
        name="author"
        content="{{ $siteName }}"
    >

    {{-- CANONICAL --}}
    <link
        rel="canonical"
        href="{{ $currentUrl }}"
    >

    {{-- OPEN GRAPH --}}
    <meta
        property="og:type"
        content="{{ $seoType }}"
    >

    <meta
        property="og:site_name"
        content="{{ $siteName }}"
    >

    <meta
        property="og:title"
        content="{{ $seoTitle }}"
    >

    <meta
        property="og:description"
        content="{{ $seoDescription }}"
    >

    <meta
        property="og:url"
        content="{{ $currentUrl }}"
    >

    <meta
        property="og:image"
        content="{{ $seoImage }}"
    >

    <meta
        property="og:image:secure_url"
        content="{{ $seoImage }}"
    >

    <meta
        property="og:image:type"
        content="image/jpeg"
    >

    <meta
        property="og:image:width"
        content="1200"
    >

    <meta
        property="og:image:height"
        content="630"
    >

    <meta
        property="og:locale"
        content="id_ID"
    >

    {{-- TWITTER --}}
    <meta
        name="twitter:card"
        content="summary_large_image"
    >

    <meta
        name="twitter:title"
        content="{{ $seoTitle }}"
    >

    <meta
        name="twitter:description"
        content="{{ $seoDescription }}"
    >

    <meta
        name="twitter:image"
        content="{{ $seoImage }}"
    >

    <meta
        name="twitter:url"
        content="{{ $currentUrl }}"
    >

    {{-- THEME --}}
    <meta
        name="theme-color"
        content="#f59e0b"
    >

    {{-- FAVICON --}}
    <link
        rel="icon"
        href="{{ $faviconPath }}"
        sizes="any"
    >

    <link
        rel="apple-touch-icon"
        href="{{ $faviconPath }}"
    >

    {{-- FONTS --}}
    <link
        rel="preconnect"
        href="https://fonts.bunny.net"
    >

    <link
        href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
        rel="stylesheet"
    >

    {{-- CSRF --}}
    @csrf

    {{-- VITE --}}
    @viteReactRefresh

    @vite([
        'resources/js/app.tsx',
        "resources/js/pages/{$page['component']}.tsx"
    ])

    {{-- INERTIA --}}
    @inertiaHead

    {{-- RECAPTCHA --}}
    <script
        src="https://www.google.com/recaptcha/api.js?render={{ env('RECAPTCHA_SITE_KEY') }}"
    ></script>

</head>

<body class="font-sans antialiased">

    @inertia

</body>

</html>