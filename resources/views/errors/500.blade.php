<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>500 - Terjadi Kesalahan</title>

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
        @keyframes shake {
            0%, 100% {
                transform: translateX(0);
            }

            10%, 30%, 50%, 70%, 90% {
                transform: translateX(-2px);
            }

            20%, 40%, 60%, 80% {
                transform: translateX(2px);
            }
        }

        .shake-animation {
            animation: shake 0.5s ease-in-out;
        }

        @keyframes pulse-slow {
            0%, 100% {
                opacity: 1;
            }

            50% {
                opacity: 0.3;
            }
        }

        .pulse-slow {
            animation: pulse-slow 3s ease-in-out infinite;
        }

        @keyframes rotate {
            from {
                transform: rotate(0deg);
            }

            to {
                transform: rotate(360deg);
            }
        }

        .rotate-animation {
            animation: rotate 2s linear infinite;
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
                class="h-20 mx-auto object-contain shake-animation"
                onerror="this.src='/images/logo-default.png'"
            >
        </div>

        <!-- Error Icon -->
        <div class="mb-6">
            <div class="w-20 h-20 mx-auto bg-orange-100 rounded-full flex items-center justify-center shadow-lg">
                <svg class="w-10 h-10 text-orange-500 rotate-animation" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z"
                    ></path>
                </svg>
            </div>
        </div>

        <!-- Text -->
        <div class="mb-8">
            <h1 class="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500 mb-4">
                500
            </h1>

            <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                Terjadi Kesalahan
            </h2>

            <p class="text-base md:text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
                Saat ini sistem sedang mengalami gangguan teknis.
                Tim kami telah menerima notifikasi dan sedang melakukan perbaikan.
            </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">

            <!-- Refresh -->
            <button
                onclick="location.reload()"
                class="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold rounded-xl hover:from-orange-500 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    ></path>
                </svg>

                Coba Lagi
            </button>

            <!-- Home -->
            <a
                href="{{ url('/') }}"
                class="inline-flex items-center justify-center px-6 py-3 bg-white border border-orange-200 text-gray-700 font-semibold rounded-xl hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 shadow-sm hover:shadow"
            >
                <svg class="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    ></path>
                </svg>

                Kembali ke Beranda
            </a>
        </div>

        <!-- Error Details -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100">

            <h3 class="text-lg font-bold text-gray-800 mb-5">
                Kemungkinan penyebabnya?
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
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg>
                    </div>

                    <div>
                        <div class="font-semibold text-gray-800">
                            Maintenance Server
                        </div>

                        <div class="text-sm text-gray-600">
                            Sistem sedang dalam proses pembaruan.
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
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg>
                    </div>

                    <div>
                        <div class="font-semibold text-gray-800">
                            Traffic Tinggi
                        </div>

                        <div class="text-sm text-gray-600">
                            Terlalu banyak pengguna mengakses sistem.
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
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg>
                    </div>

                    <div>
                        <div class="font-semibold text-gray-800">
                            Masalah Database
                        </div>

                        <div class="text-sm text-gray-600">
                            Terjadi gangguan koneksi sementara.
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
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            ></path>

                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            ></path>
                        </svg>
                    </div>

                    <div>
                        <div class="font-semibold text-gray-800">
                            Konfigurasi Bermasalah
                        </div>

                        <div class="text-sm text-gray-600">
                            Terdapat kesalahan konfigurasi sistem.
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <!-- Contact -->
        <div class="mt-8 bg-orange-50 rounded-2xl p-6 border border-orange-100">

            <h3 class="text-lg font-bold text-gray-800 mb-2">
                Masih mengalami error?
            </h3>

            <p class="text-gray-600 mb-5">
                Tim teknis kami sudah menerima notifikasi otomatis.
                Jika masalah terus berlanjut, silakan hubungi kami secara langsung.
            </p>

            <div class="flex flex-col sm:flex-row gap-3 justify-center">

                <!-- Email -->
                <a
                    href="mailto:support@example.com"
                    class="inline-flex items-center justify-center px-5 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors"
                >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        ></path>
                    </svg>

                    Email Support
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

                    Hubungi Kami
                </a>

            </div>
        </div>

        <!-- Footer -->
        <div class="mt-8 text-sm text-gray-500 pulse-slow">
            <p>
                Mohon maaf atas ketidaknyamanannya
            </p>
        </div>

    </div>

</body>
</html>