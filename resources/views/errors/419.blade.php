<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>419 - Halaman Kedaluwarsa</title>

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
        @keyframes hourglass {
            0%, 100% {
                transform: rotate(0deg);
            }
            50% {
                transform: rotate(180deg);
            }
        }

        .hourglass-rotate {
            animation: hourglass 4s ease-in-out infinite;
        }

        @keyframes fade-in {
            from {
                opacity: 0;
                transform: translateY(20px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .fade-in {
            animation: fade-in 0.6s ease-out;
        }
    </style>
</head>

<body class="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center px-4">

    <div class="max-w-2xl w-full text-center fade-in">

        <!-- Logo -->
        <div class="mb-8">
            @php
                $siteLogo = \App\Models\Configuration::getValue('site_logo', '/images/logo-default.png');

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
                onerror="this.src='/images/logo-default.png'"
            >
        </div>

        <!-- Icon -->
        <div class="mb-6">
            <div class="w-20 h-20 mx-auto bg-orange-100 rounded-full flex items-center justify-center shadow-lg">
                <svg class="w-10 h-10 text-orange-500 hourglass-rotate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                </svg>
            </div>
        </div>

        <!-- 419 Text -->
        <div class="mb-8">
            <h1 class="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500 mb-4">
                419
            </h1>

            <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                Halaman Kedaluwarsa
            </h2>

            <p class="text-base md:text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
                Maaf, sesi Anda telah berakhir.
                Hal ini biasanya terjadi demi keamanan ketika halaman terlalu lama tidak digunakan.
            </p>
        </div>

        <!-- Buttons -->
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

            <!-- Refresh -->
            <button
                onclick="location.reload()"
                class="inline-flex items-center justify-center px-6 py-3 bg-white border border-orange-200 text-gray-700 font-semibold rounded-xl hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 shadow-sm hover:shadow"
            >
                <svg class="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    ></path>
                </svg>

                Muat Ulang Halaman
            </button>
        </div>

        <!-- Information Card -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100">

            <h3 class="text-lg font-bold text-gray-800 mb-5">
                Apa yang terjadi?
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">

                <!-- Item -->
                <div class="flex items-start gap-3">
                    <div class="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg>
                    </div>

                    <div>
                        <div class="font-semibold text-gray-800">
                            Sesi Berakhir
                        </div>

                        <div class="text-sm text-gray-600">
                            Sesi login Anda telah habis.
                        </div>
                    </div>
                </div>

                <!-- Item -->
                <div class="flex items-start gap-3">
                    <div class="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            ></path>
                        </svg>
                    </div>

                    <div>
                        <div class="font-semibold text-gray-800">
                            Token Keamanan Tidak Valid
                        </div>

                        <div class="text-sm text-gray-600">
                            Token CSRF sudah tidak berlaku.
                        </div>
                    </div>
                </div>

                <!-- Item -->
                <div class="flex items-start gap-3">
                    <div class="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            ></path>
                        </svg>
                    </div>

                    <div>
                        <div class="font-semibold text-gray-800">
                            Tab Tidak Aktif
                        </div>

                        <div class="text-sm text-gray-600">
                            Browser terlalu lama tidak aktif.
                        </div>
                    </div>
                </div>

                <!-- Item -->
                <div class="flex items-start gap-3">
                    <div class="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg>
                    </div>

                    <div>
                        <div class="font-semibold text-gray-800">
                            Cache Dibersihkan
                        </div>

                        <div class="text-sm text-gray-600">
                            Data browser telah dihapus.
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <!-- Help Section -->
        <div class="mt-8 bg-orange-50 rounded-2xl p-6 border border-orange-100">

            <h3 class="text-lg font-bold text-gray-800 mb-2">
                Butuh bantuan?
            </h3>

            <p class="text-gray-600 mb-5">
                Ini merupakan fitur keamanan normal. Silakan refresh halaman atau login kembali untuk melanjutkan.
            </p>

            <div class="flex flex-col sm:flex-row gap-3 justify-center">

                <!-- Login -->
                <a
                    href="{{ url('/login') }}"
                    class="inline-flex items-center justify-center px-5 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors"
                >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        ></path>
                    </svg>

                    Login Kembali
                </a>

                <!-- Contact -->
                <a
                    href="{{ url('/contact') }}"
                    class="inline-flex items-center justify-center px-5 py-3 bg-white border border-orange-200 text-gray-700 font-semibold rounded-xl hover:bg-orange-50 transition-colors"
                >
                    <svg class="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        ></path>
                    </svg>

                    Hubungi Support
                </a>

            </div>
        </div>

        <!-- Footer -->
        <div class="mt-8 text-sm text-gray-500">
            <p>
                Silakan coba kembali atau hubungi support jika masalah terus berlanjut.
            </p>
        </div>

    </div>

</body>
</html>