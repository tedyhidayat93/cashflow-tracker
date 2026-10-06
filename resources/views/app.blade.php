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


</head>

<body class="font-sans antialiased">

    @inertia

</body>

</html>