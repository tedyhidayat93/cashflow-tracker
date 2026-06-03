<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>403 - Akses Ditolak</title>

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
        @keyframes lock-pulse {
            0%, 100% {
                transform: scale(1);
                opacity: 1;
            }
            50% {
                transform: scale(1.1);
                opacity: 0.8;
            }
        }

        .lock-pulse {
            animation: lock-pulse 2s ease-in-out infinite;
        }

        @keyframes shake {
            0%, 100% {
                transform: translateX(0);
            }
            25% {
                transform: translateX(-5px);
            }
            75% {
                transform: translateX(5px);
            }
        }

        .shake {
            animation: shake 0.5s ease-in-out;
        }
    </style>
</head>

<body class="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center px-4">

    <div class="max-w-2xl w-full text-center">

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
            <div class="w-20 h-20 mx-auto bg-orange-100 rounded-full flex items-center justify-center lock-pulse shadow-lg">
                <svg class="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    ></path>
                </svg>
            </div>
        </div>

        <!-- Text -->
        <div class="mb-8">
            <h1 class="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500 mb-4">
                403
            </h1>

            <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                Akses Ditolak
            </h2>

            <p class="text-base md:text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
                Anda tidak memiliki izin untuk mengakses halaman ini.
                Silakan hubungi administrator apabila ini merupakan kesalahan.
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

        <!-- Information -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100">

            <h3 class="text-lg font-bold text-gray-800 mb-5">
                Kenapa saya melihat halaman ini?
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
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            ></path>
                        </svg>
                    </div>

                    <div>
                        <div class="font-semibold text-gray-800">
                            Akses Tidak Memadai
                        </div>

                        <div class="text-sm text-gray-600">
                            Akun Anda tidak memiliki izin akses.
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
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            ></path>
                        </svg>
                    </div>

                    <div>
                        <div class="font-semibold text-gray-800">
                            Belum Login
                        </div>

                        <div class="text-sm text-gray-600">
                            Silakan login terlebih dahulu.
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
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z"
                            ></path>
                        </svg>
                    </div>

                    <div>
                        <div class="font-semibold text-gray-800">
                            Sesi Berakhir
                        </div>

                        <div class="text-sm text-gray-600">
                            Silakan login kembali.
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
                                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                            ></path>
                        </svg>
                    </div>

                    <div>
                        <div class="font-semibold text-gray-800">
                            Area Terbatas
                        </div>

                        <div class="text-sm text-gray-600">
                            Halaman ini hanya dapat diakses administrator.
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <!-- Footer -->
        <div class="mt-8 text-sm text-gray-500">
            <p>
                Jika membutuhkan bantuan, silakan hubungi administrator sistem.
            </p>
        </div>

    </div>

</body>
</html>