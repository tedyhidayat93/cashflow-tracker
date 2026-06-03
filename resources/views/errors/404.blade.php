<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>404 - Halaman Tidak Ditemukan</title>

    @if(isset($siteconfig))
        @php
            $siteFavicon = collect($siteconfig)->where('key', 'site_favicon')->first()['value'] ?? '/favicon.ico';
            $faviconPath = str_starts_with($siteFavicon, 'configurations/') ? '/storage/' . $siteFavicon : $siteFavicon;
        @endphp
        <link rel="icon" href="{{ asset($faviconPath) }}" sizes="any">
        <link rel="icon" href="{{ asset($faviconPath) }}" type="image/svg+xml">
        <link rel="apple-touch-icon" href="{{ asset($faviconPath) }}">
    @else
        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    @endif

    <script src="https://cdn.tailwindcss.com"></script>

    <style>
        @keyframes float {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-20px);
            }
        }

        .float-animation {
            animation: float 3s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
        }

        .pulse-animation {
            animation: pulse 2s ease-in-out infinite;
        }
    </style>
</head>

<body class="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center px-4">

    <div class="max-w-2xl w-full text-center">

        <!-- Logo -->
        <div class="mb-8 float-animation">
            @php
                $siteLogo = \App\Models\Configuration::getValue('site_logo', '/images/logo-main.png');

                if ($siteLogo && !str_starts_with($siteLogo, 'http')) {
                    if (!str_starts_with($siteLogo, '/')) {
                        $siteLogo = '/' . $siteLogo;
                    }

                    if (!str_starts_with($siteLogo, '/storage/')) {
                        $siteLogo = '/storage' . $siteLogo;
                    }
                }
            @endphp

            <img
                src="{{ $siteLogo }}"
                alt="Logo Website"
                class="h-20 mx-auto object-contain"
                onerror="this.src='/images/logo-main.png'"
            >
        </div>

        <!-- 404 Text -->
        <div class="mb-8">
            <h1 class="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500 mb-4">
                404
            </h1>

            <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                Oops! Halaman Tidak Ditemukan
            </h2>

            <p class="text-base md:text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
                Halaman yang Anda cari tidak ditemukan atau mungkin telah dipindahkan.
                Tenang, bahkan penjelajah terbaik pun terkadang tersesat.
            </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">

            <!-- Home -->
            <a
                href="{{ url('/') }}"
                class="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold rounded-xl hover:from-orange-500 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    ></path>
                </svg>

                Kembali ke Beranda
            </a>

            <!-- Back -->
            <button
                onclick="history.back()"
                class="inline-flex items-center justify-center px-6 py-3 bg-white border border-orange-200 text-gray-700 font-semibold rounded-xl hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 shadow-sm hover:shadow"
            >
                <svg class="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    ></path>
                </svg>

                Kembali
            </button>
        </div>

        <!-- Helpful Links -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100">

            <h3 class="text-lg font-bold text-gray-800 mb-5">
                Mungkin Anda mencari ini?
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">

                <!-- Produk -->
                <a
                    href="{{ url('/catalog') }}"
                    class="flex items-center p-4 rounded-xl hover:bg-orange-50 transition-all duration-200 group"
                >
                    <div class="w-11 h-11 bg-orange-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-orange-200 transition-colors">
                        <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            ></path>
                        </svg>
                    </div>

                    <div>
                        <div class="font-semibold text-gray-800">
                            Produk
                        </div>

                        <div class="text-sm text-gray-600">
                            Jelajahi katalog produk kami
                        </div>
                    </div>
                </a>

                <!-- Contact -->
                <a
                    href="{{ url('/#contact') }}"
                    class="flex items-center p-4 rounded-xl hover:bg-orange-50 transition-all duration-200 group"
                >
                    <div class="w-11 h-11 bg-orange-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-orange-200 transition-colors">
                        <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            ></path>
                        </svg>
                    </div>

                    <div>
                        <div class="font-semibold text-gray-800">
                            Kontak
                        </div>

                        <div class="text-sm text-gray-600">
                            Hubungi tim kami
                        </div>
                    </div>
                </a>

            </div>
        </div>

        <!-- Footer -->
        <div class="mt-8 text-sm text-gray-500 pulse-animation">
            <p>
                Jika Anda merasa ini adalah kesalahan, silakan hubungi tim support kami.
            </p>
        </div>

    </div>

</body>
</html>