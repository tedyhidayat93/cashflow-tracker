import React from 'react';
import { Link, Head } from '@inertiajs/react';
import { PageProps } from '@/types/home';
import { HomeIcon } from 'lucide-react';

export default function Home({ auth, workspaces }: PageProps) {
    return (
        <>
            <Head title="Selamat Datang di AturDuit" />

            <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between font-sans">
                {/* Navbar */}
                <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-xl text-emerald-400">
                            <span className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                <HomeIcon className="h-5 w-5" />
                            </span>
                        </div>

                        <div>
                            {auth.user ? (
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-slate-400">
                                        Halo, <strong className="text-slate-200">{auth.user.name}</strong>
                                    </span>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="text-xs text-rose-400 hover:text-rose-300 font-medium"
                                    >
                                        Logout
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link
                                        href="/login"
                                        className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                                    >
                                        Masuk
                                    </Link>
                                    {/* <Link
                                        href="/register"
                                        className="px-4 py-2 text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg transition-all shadow-lg shadow-emerald-500/20"
                                    >
                                        Daftar Gratis
                                    </Link> */}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Hero Section */}
                <main className="max-w-5xl mx-auto px-6 py-20 text-center flex-1 flex flex-col items-center justify-center">
                    
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
                        Selamat Datang <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                            Silakan Login
                        </span>
                    </h1>

                    <p className="text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed">
                        -
                    </p>

                    {/* Section: Dynamic Action / Initial App Selection */}
                    <div className="w-full max-w-xl">
                        {auth.user ? (
                            <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-2xl text-left shadow-xl">
                                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
                                    Pilih Initial App / Workspace Anda
                                </h2>

                                {workspaces.length > 0 ? (
                                    <div className="grid gap-3">
                                        {workspaces.map((ws) => (
                                            <div
                                                key={ws.id}
                                                className="p-4 bg-slate-900/80 hover:bg-slate-900 border border-slate-700/50 hover:border-emerald-500/50 rounded-xl transition-all flex items-center justify-between group"
                                            >
                                                <div>
                                                    <div className="font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">
                                                        {ws.name}
                                                    </div>
                                                    <div className="flex gap-2 mt-1">
                                                        {ws.apps.map((app, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-emerald-400 rounded border border-slate-700"
                                                            >
                                                                {app.app_prefix.toUpperCase()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <Link
                                                    href={`/w/${ws.slug}/cashflow`}
                                                    className="px-3 py-1.5 text-xs font-semibold bg-emerald-500 text-slate-950 rounded-lg hover:bg-emerald-400 transition-all"
                                                >
                                                    Buka Cashflow &rarr;
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-slate-400 text-sm">
                                        Belum ada workspace aktif. <br />
                                        <Link href="/workspaces/create" className="text-emerald-400 underline mt-2 inline-block">
                                            + Buat Workspace Baru
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    href="/login"
                                    className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition-all shadow-lg shadow-emerald-500/25"
                                >
                                    Masuk ke Akun
                                </Link>
                                {/* <a
                                    href="#features"
                                    className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all"
                                >
                                    Pelajari Fitur
                                </a> */}
                            </div>
                        )}
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
                    &copy; {new Date().getFullYear()} all rights reserved. Made with love.<br />
                </footer>
            </div>
        </>
    );
}