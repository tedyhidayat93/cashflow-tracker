import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ArrowDownRight, ArrowUpRight, ArrowLeftRight, Wallet as WalletIcon } from 'lucide-react';

interface WorkspaceInfo {
    id: number;
    name: string;
    slug: string;
    currency: string;
    timezone: string;
}

interface WalletItem {
    id: number;
    name: string;
    type: string;
    currency: string;
    bank_name: string | null;
    current_balance: number;
}

interface WalletTransferItem {
    id: number;
    title: string;
    reference_number: string;
    amount: number;
    fee: number;
    transfer_date: string;
    from_wallet?: { id: number; name: string; currency: string };
    to_wallet?: { id: number; name: string; currency: string };
}

interface Transaction {
    id: number;
    title: string;
    category: string;
    amount: number;
    type: 'income' | 'expense';
    date: string;
}

interface SummaryData {
    total_balance: number;
    total_income: number;
    total_expense: number;
    monthly_growth: number;
}

interface CashflowDashboardProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    workspace: WorkspaceInfo;
    userRole: string;
    summary: SummaryData;
    wallets: WalletItem[];
    recentTransfers: WalletTransferItem[];
    recentTransactions: Transaction[];
    [key: string]: unknown;
}

export default function CashflowDashboard() {
    const { workspace, userRole, summary, wallets, recentTransfers, recentTransactions } =
        usePage<CashflowDashboardProps>().props;
        
    const [isModalOpen, setIsModalOpen] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Overview',
            href: '/overview',
        },
        {
            title: workspace.name,
            href: `/w/${workspace.slug}/cf`,
        },
        {
            title: 'Cashflow Dashboard',
            href: `/w/${workspace.slug}/cf`,
        },
    ];

    const formatCurrency = (amount: number, currencyCode?: string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: currencyCode || workspace.currency || 'IDR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Cashflow Dashboard - ${workspace.name}`} />

            <div className="flex-1 p-6 space-y-6">
                {/* Header Banner */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-2xl font-bold tracking-tight">
                                Dashboard
                            </h2>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Ringkasan arus kas dan performa finansial workspace{' '}
                            <strong className="text-foreground">{workspace.name}</strong>.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/overview"
                            className="px-3 py-2 text-xs font-semibold bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl transition-all border border-border"
                        >
                            &larr; Ke Overview
                        </Link>
                        {/* Shadcn Dialog Trigger */}
                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                            <DialogTrigger asChild>
                                <button
                                    type="button"
                                    className="px-4 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center gap-2 cursor-pointer"
                                >
                                    <span>+</span> Catat Transaksi
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Pilih Tipe Transaksi</DialogTitle>
                                    <DialogDescription>
                                        Silakan pilih jenis pencatatan keuangan yang ingin kamu tambahkan.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="grid grid-cols-1 gap-3 pt-2">
                                    <Link
                                        href={`/w/${workspace.slug}/cf/income/create`}
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex items-center gap-3 p-3.5 bg-emerald-950 border border-emerald-500 hover:border-emerald-500 rounded-xl transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-emerald-300 text-emerald-700 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                                            <ArrowDownRight className="size-4" />
                                        </div>
                                        <div>
                                            <div className="text-base font-bold text-emerald-400">
                                                Pemasukan (Income)
                                            </div>
                                            <div className="text-[11px] text-muted-foreground">
                                                Catat uang masuk, penjualan, atau modal
                                            </div>
                                        </div>
                                    </Link>

                                    <Link
                                        href={`/w/${workspace.slug}/cf/expense/create`}
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex items-center gap-3 p-3.5 bg-rose-950 border border-rose-500 hover:border-rose-500 rounded-xl transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-rose-300 text-rose-700 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                                            <ArrowUpRight className="size-4" />
                                        </div>
                                        <div>
                                            <div className="text-base font-bold text-rose-400">
                                                Pengeluaran (Expense)
                                            </div>
                                            <div className="text-[11px] text-muted-foreground">
                                                Catat operasional, pembelian, atau biaya
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 bg-card border border-border rounded-2xl relative overflow-hidden">
                        <span className="text-xs font-medium text-muted-foreground">
                            Total Saldo
                        </span>
                        <div className="text-2xl font-extrabold text-foreground mt-2">
                            {formatCurrency(summary.total_balance)}
                        </div>
                        <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-medium">
                            <span>↑ {summary.monthly_growth}%</span>
                            <span className="text-muted-foreground">vs bulan lalu</span>
                        </div>
                    </div>

                    <div className="p-5 bg-card border border-border rounded-2xl">
                        <span className="text-xs font-medium text-muted-foreground">
                            Pemasukan Bulan Ini
                        </span>
                        <div className="text-2xl font-extrabold text-emerald-400 mt-2">
                            {formatCurrency(summary.total_income)}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-2">
                            Arus kas masuk terverifikasi
                        </div>
                    </div>

                    <div className="p-5 bg-card border border-border rounded-2xl">
                        <span className="text-xs font-medium text-muted-foreground">
                            Pengeluaran Bulan Ini
                        </span>
                        <div className="text-2xl font-extrabold text-rose-400 mt-2">
                            {formatCurrency(summary.total_expense)}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-2">
                            Operasional & biaya rutin
                        </div>
                    </div>

                    <div className="p-5 bg-card border border-border rounded-2xl">
                        <span className="text-xs font-medium text-muted-foreground">
                            Net Cashflow
                        </span>
                        <div className="text-2xl font-extrabold text-teal-300 mt-2">
                            {formatCurrency(summary.total_income - summary.total_expense)}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-2">
                            Selisih pemasukan vs pengeluaran
                        </div>
                    </div>
                </div>

                {/* SECTION 1: Daftar Dompet / Wallet Grid */}
                <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                                <WalletIcon className="size-4 text-emerald-400" />
                                Daftar Dompet / Akun Bank
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Saldo aktif di setiap dompet workspace {workspace.name}
                            </p>
                        </div>
                        <Link
                            href={`/w/${workspace.slug}/cf/accounts`}
                            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                        >
                            Kelola Dompet &rarr;
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {(wallets ?? []).length === 0 ? (
                            <div className="col-span-full py-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                                Belum ada dompet terdaftar.
                            </div>
                        ) : (
                            wallets.map((wallet) => (
                                <div
                                    key={wallet.id}
                                    className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col justify-between hover:bg-muted/40 transition-all"
                                >
                                    <div>
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-xs font-bold text-foreground">
                                                {wallet.name}
                                            </span>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground uppercase font-mono">
                                                {wallet.type}
                                            </span>
                                        </div>
                                        {wallet.bank_name && (
                                            <span className="text-[11px] text-muted-foreground block mt-1">
                                                {wallet.bank_name}
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-border/50">
                                        <span className="text-[10px] text-muted-foreground block">
                                            Saldo Saat Ini
                                        </span>
                                        <span className="text-base font-extrabold text-emerald-400">
                                            {formatCurrency(wallet.current_balance, wallet.currency)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* GRID DUA KOLOM: Transaksi Terakhir & Riwayat Transfer */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* SECTION 2: Transaksi Terakhir */}
                    <div className="bg-card border border-border rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-base font-bold text-foreground">
                                    Transaksi Terakhir
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Pemasukan & Pengeluaran terbaru
                                </p>
                            </div>
                            <Link
                                href={`/w/${workspace.slug}/cf/transactions`}
                                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                            >
                                Lihat Semua &rarr;
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-foreground">
                                <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b border-border">
                                    <tr>
                                        <th className="py-2.5 px-3">Deskripsi</th>
                                        <th className="py-2.5 px-3">Kategori</th>
                                        <th className="py-2.5 px-3 text-right">Jumlah</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {(recentTransactions ?? []).length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="py-8 px-3 text-center text-xs text-muted-foreground"
                                            >
                                                Belum ada transaksi.
                                            </td>
                                        </tr>
                                    ) : (
                                        recentTransactions.map((tx) => (
                                            <tr
                                                key={tx.id}
                                                className="hover:bg-muted/30 transition-colors"
                                            >
                                                <td className="py-3 px-3">
                                                    <div className="font-medium text-xs">{tx.title}</div>
                                                    <div className="text-[10px] text-muted-foreground">{tx.date}</div>
                                                </td>
                                                <td className="py-3 px-3">
                                                    <span className="text-[10px] px-2 py-0.5 bg-secondary text-secondary-foreground rounded-md border border-border">
                                                        {tx.category}
                                                    </span>
                                                </td>
                                                <td
                                                    className={`py-3 px-3 text-right font-semibold text-xs ${
                                                        tx.type === 'income'
                                                            ? 'text-emerald-400'
                                                            : 'text-rose-400'
                                                    }`}
                                                >
                                                    {tx.type === 'income' ? '+' : '-'}{' '}
                                                    {formatCurrency(tx.amount)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* SECTION 3: Riwayat Transfer */}
                    <div className="bg-card border border-border rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                                    <ArrowLeftRight className="size-4 text-cyan-400" />
                                    Riwayat Transfer Dompet
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Pindahan dana antar dompet
                                </p>
                            </div>
                            <Link
                                href={`/w/${workspace.slug}/cf/transfers`}
                                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                            >
                                Lihat Semua &rarr;
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-foreground">
                                <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b border-border">
                                    <tr>
                                        <th className="py-2.5 px-3">Transfer</th>
                                        <th className="py-2.5 px-3">Tanggal</th>
                                        <th className="py-2.5 px-3 text-right">Jumlah</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {(recentTransfers ?? []).length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="py-8 px-3 text-center text-xs text-muted-foreground"
                                            >
                                                Belum ada riwayat transfer antar dompet.
                                            </td>
                                        </tr>
                                    ) : (
                                        recentTransfers.map((trf) => (
                                            <tr
                                                key={trf.id}
                                                className="hover:bg-muted/30 transition-colors"
                                            >
                                                <td className="py-3 px-3">
                                                    <div className="font-medium text-xs">
                                                        {trf.from_wallet?.name ?? '—'} &rarr; {trf.to_wallet?.name ?? '—'}
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground">
                                                        {trf.title}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-3 text-xs text-muted-foreground">
                                                    {trf.transfer_date}
                                                </td>
                                                <td className="py-3 px-3 text-right">
                                                    <div className="font-semibold text-xs text-cyan-400">
                                                        {formatCurrency(trf.amount, trf.from_wallet?.currency)}
                                                    </div>
                                                    {trf.fee > 0 && (
                                                        <div className="text-[10px] text-rose-400">
                                                            Biaya: {formatCurrency(trf.fee, trf.from_wallet?.currency)}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}