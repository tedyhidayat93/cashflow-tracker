import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

interface WorkspaceApp {
    id: number;
    app_prefix: string;
    is_active: boolean;
}

interface Workspace {
    id: number;
    name: string;
    slug: string;
    logo?: string | null;
    description?: string | null;
    apps: WorkspaceApp[];
}

interface OverviewPageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    workspaces: Workspace[];
    [key: string]: unknown; 
}

// Daftar metadata modul pendukung
const MODULE_METADATA: Record<string, { title: string; desc: string; icon: string; color: string }> = {
    cf: {
        title: 'Cashflow Tracker',
        desc: 'Kelola arus kas, pemasukan, pengeluaran, dan transaksi keuangan real-time.',
        icon: '💳',
        color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    },
    inventory: {
        title: 'Inventory System',
        desc: 'Pantau stok barang, manajemen gudang, dan riwayat pesanan.',
        icon: '📦',
        color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400',
    },
    hrm: {
        title: 'HRM & Payroll',
        desc: 'Manajemen karyawan, kehadiran, serta pemrosesan gaji.',
        icon: '👥',
        color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400',
    },
};

export default function Overview() {
    const { auth, workspaces } = usePage<OverviewPageProps>().props;

    return (
        <>
            <Head title="Overview Workspaces & Modul" />

            <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
                {/* Header Section */}
                <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-xl">
                                📊
                            </span>
                            <div>
                                <h1 className="text-base font-bold text-white leading-tight">AturDuit Overview</h1>
                                <p className="text-xs text-slate-400">Pilih workspace & modul untuk memulai</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-slate-200">{auth.user.name}</p>
                                <p className="text-xs text-slate-400">{auth.user.email}</p>
                            </div>
                            {/* Diubah dari href={route('logout')} menjadi URL langsung href="/logout" */}
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-lg border border-slate-700/60 transition-all"
                            >
                                Keluar
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="max-w-7xl mx-auto px-6 py-10">
                    <div className="mb-8">
                        <h2 className="text-2xl font-extrabold text-white">Selamat Datang, {auth.user.name} 👋</h2>
                        <p className="text-slate-400 text-sm mt-1">
                            Berikut adalah daftar workspace yang Anda kelola beserta modul aplikasi yang aktif.
                        </p>
                    </div>

                    {workspaces.length === 0 ? (
                        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center max-w-lg mx-auto mt-10">
                            <span className="text-4xl">🏢</span>
                            <h3 className="text-lg font-semibold text-white mt-4">Belum Terhubung ke Workspace</h3>
                            <p className="text-sm text-slate-400 mt-2">
                                Anda belum terdaftar di workspace manapun. Silakan hubungi administrator atau buat workspace baru.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {workspaces.map((ws) => (
                                <div
                                    key={ws.id}
                                    className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 transition-all hover:border-slate-700/80"
                                >
                                    {/* Workspace Title & Info */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-800/60 gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-xl font-bold text-emerald-400">
                                                {ws.logo ? (
                                                    <img src={ws.logo} alt={ws.name} className="w-full h-full object-cover rounded-xl" />
                                                ) : (
                                                    ws.name.substring(0, 2).toUpperCase()
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{ws.name}</h3>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    {ws.description || 'Tidak ada deskripsi workspace'}
                                                </p>
                                            </div>
                                        </div>

                                        <span className="self-start sm:self-center font-mono text-xs px-3 py-1 bg-slate-800 text-slate-400 border border-slate-700/60 rounded-full">
                                            slug: {ws.slug}
                                        </span>
                                    </div>

                                    {/* Modules Grid */}
                                    <div>
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                                            Modul Aplikasi Tersedia
                                        </h4>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {ws.apps.map((app) => {
                                                const meta = MODULE_METADATA[app.app_prefix] || {
                                                    title: app.app_prefix.toUpperCase(),
                                                    desc: 'Modul khusus aplikasi.',
                                                    icon: '⚙️',
                                                    color: 'from-slate-800 to-slate-900 border-slate-700 text-slate-300',
                                                };

                                                return (
                                                    <div
                                                        key={app.id}
                                                        className={`p-5 rounded-xl border bg-gradient-to-br ${meta.color} flex flex-col justify-between transition-all hover:scale-[1.01]`}
                                                    >
                                                        <div>
                                                            <div className="flex items-center justify-between mb-3">
                                                                <span className="text-2xl">{meta.icon}</span>
                                                                <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-950/60 text-slate-300 rounded border border-slate-700/40">
                                                                    Aktif
                                                                </span>
                                                            </div>
                                                            <h5 className="font-bold text-slate-100 text-base">{meta.title}</h5>
                                                            <p className="text-xs text-slate-300/80 mt-1.5 leading-relaxed">
                                                                {meta.desc}
                                                            </p>
                                                        </div>

                                                        <div className="mt-6 pt-4 border-t border-slate-700/40">
                                                            <Link
                                                                href={`/w/${ws.slug}/${app.app_prefix}`}
                                                                className="w-full py-2 px-4 inline-flex items-center justify-center text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/10"
                                                            >
                                                                Buka Modul &rarr;
                                                            </Link>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {/* Placeholder Module / Coming Soon */}
                                            <div className="p-5 rounded-xl border border-dashed border-slate-800 bg-slate-900/20 flex flex-col justify-between opacity-60">
                                                <div>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-2xl">🚀</span>
                                                        <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-slate-400 rounded">
                                                            Segera Hadir
                                                        </span>
                                                    </div>
                                                    <h5 className="font-bold text-slate-300 text-base">Modul Tambahan</h5>
                                                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                                                        Integrasi aplikasi inventaris dan laporan bisnis lainnya akan tersedia di workspace ini.
                                                    </p>
                                                </div>
                                                <div className="mt-6 pt-4 border-t border-slate-800/40">
                                                    <button
                                                        disabled
                                                        className="w-full py-2 px-4 text-xs font-semibold rounded-lg bg-slate-800 text-slate-500 cursor-not-allowed"
                                                    >
                                                        Belum Diaktifkan
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}