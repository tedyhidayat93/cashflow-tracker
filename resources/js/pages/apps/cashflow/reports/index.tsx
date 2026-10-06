import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BreadcrumbItem } from '@/types';
import type { WorkspaceInfo } from '../_lib';
import { cfUrl, formatMoney } from '../_lib';
import PageHeader from '../_components/page-header';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';

type ReportTransaction = {
    id: number;
    title: string;
    type: 'income' | 'expense';
    amount: number;
    date: string;
    category?: string | null;
    wallet?: string | null;
};

type Props = {
    workspace: WorkspaceInfo;
    filters: { date_from: string; date_to: string };
    summary: {
        total_income: number;
        total_expense: number;
        net: number;
        transaction_count: number;
        top_expense?: {
            title: string;
            amount: number;
            category?: string;
            date?: string;
        } | null;
    };
    by_category: {
        category: string;
        type?: string;
        total: number;
        count: number;
    }[];
    charts: {
        expense_by_category: { name: string; value: number }[];
        monthly_trends: { month: string; income: number; expense: number }[];
    };
    transactions: ReportTransaction[];
};

const CHART_COLORS = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];

export default function ReportsIndex({
    workspace,
    filters,
    summary,
    by_category,
    charts,
    transactions,
}: Props) {
    const form = useForm({
        date_from: filters.date_from,
        date_to: filters.date_to,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Overview', href: '/overview' },
        { title: workspace.name, href: cfUrl(workspace.slug) },
        { title: 'Laporan Finansial', href: cfUrl(workspace.slug, 'reports') },
    ];

    const exportUrl = `${cfUrl(workspace.slug, 'reports/export')}?date_from=${form.data.date_from}&date_to=${form.data.date_to}`;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Laporan - ${workspace.name}`} />
            <div className="flex-1 space-y-6 p-6">
                <PageHeader
                    title="Laporan Finansial"
                    description="Ringkasan pemasukan, pengeluaran, dan rincian per kategori."
                    actions={
                        <Button variant="outline" asChild>
                            <a href={exportUrl}>Export CSV</a>
                        </Button>
                    }
                />

                {/* Filter Form */}
                <form
                    className="grid gap-4 rounded-2xl border border-border bg-card p-4 sm:grid-cols-3"
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.get(cfUrl(workspace.slug, 'reports'), { preserveState: true });
                    }}
                >
                    <div className="space-y-1.5">
                        <Label htmlFor="date_from" className="text-xs text-muted-foreground">Dari Tanggal</Label>
                        <Input
                            id="date_from"
                            type="date"
                            value={form.data.date_from}
                            onChange={(e) => form.setData('date_from', e.target.value)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="date_to" className="text-xs text-muted-foreground">Sampai Tanggal</Label>
                        <Input
                            id="date_to"
                            type="date"
                            value={form.data.date_to}
                            onChange={(e) => form.setData('date_to', e.target.value)}
                        />
                    </div>
                    <div className="flex items-end">
                        <Button type="submit" variant="default" className="w-full">
                            Terapkan Periode
                        </Button>
                    </div>
                </form>

                {/* Stat Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <Stat label="Pemasukan" value={formatMoney(summary.total_income, workspace.currency)} tone="text-emerald-400" />
                    <Stat label="Pengeluaran" value={formatMoney(summary.total_expense, workspace.currency)} tone="text-rose-400" />
                    <Stat label="Net" value={formatMoney(summary.net, workspace.currency)} tone="text-teal-300" />
                    <Stat label="Jumlah Transaksi" value={String(summary.transaction_count)} />
                    <Stat
                        label="Pengeluaran Terbesar"
                        value={summary.top_expense ? formatMoney(summary.top_expense.amount, workspace.currency) : '-'}
                        subtitle={summary.top_expense ? summary.top_expense.title : 'Belum ada data'}
                        tone="text-rose-400"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Chart Tren Bulanan */}
                    <section className="rounded-2xl border border-border bg-card p-5">
                        <h3 className="mb-4 text-base font-bold">Pemasukan vs Pengeluaran</h3>
                        <div className="h-72 w-full">
                            {charts.monthly_trends.length === 0 ? (
                                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                    Tidak ada data untuk grafik.
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={charts.monthly_trends}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                        <XAxis dataKey="month" fontSize={12} />
                                        <YAxis fontSize={12} tickFormatter={(val) => `${val / 1000}k`} />
                                        <Tooltip
                                            formatter={(value) =>
                                                typeof value === 'number'
                                                    ? formatMoney(value, workspace.currency)
                                                    : value
                                            }
                                            contentStyle={{
                                                backgroundColor: 'var(--card)',
                                                borderColor: 'var(--border)',
                                                borderRadius: '8px',
                                            }}
                                        />
                                        <Legend />
                                        <Bar dataKey="income" name="Pemasukan" fill="#10b981" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="expense" name="Pengeluaran" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </section>

                    {/* Chart Pengeluaran Per Kategori */}
                    <section className="rounded-2xl border border-border bg-card p-5">
                        <h3 className="mb-4 text-base font-bold">Pengeluaran per Kategori</h3>
                        <div className="h-72 w-full">
                            {charts.expense_by_category.length === 0 ? (
                                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                    Tidak ada pengeluaran pada periode ini.
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={charts.expense_by_category}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} (${(percent ? percent * 100 : 0).toFixed(0)}%)`}
                                        >
                                            {charts.expense_by_category.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) =>
                                                typeof value === 'number'
                                                    ? formatMoney(value, workspace.currency)
                                                    : value
                                            }
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </section>
                </div>

                {/* Details Section */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <section className="rounded-2xl border border-border bg-card p-5">
                        <h3 className="mb-4 text-base font-bold">Per Kategori</h3>
                        {by_category.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Tidak ada data pada periode ini.</p>
                        ) : (
                            <div className="space-y-2">
                                {by_category.map((row) => (
                                    <div
                                        key={row.category}
                                        className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-sm"
                                    >
                                        <div>
                                            <div className="font-medium">{row.category}</div>
                                            <div className="text-xs text-muted-foreground">{row.count} transaksi</div>
                                        </div>
                                        <div className={row.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}>
                                            {formatMoney(row.total, workspace.currency)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="rounded-2xl border border-border bg-card p-5">
                        <h3 className="mb-4 text-base font-bold">Rincian Transaksi</h3>
                        <div className="max-h-96 space-y-2 overflow-y-auto">
                            {transactions.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Tidak ada transaksi.</p>
                            ) : (
                                transactions.map((row) => (
                                    <div
                                        key={row.id}
                                        className="flex items-center justify-between gap-3 border-b border-border py-2 text-sm last:border-0"
                                    >
                                        <div>
                                            <div className="font-medium">{row.title}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {row.date} · {row.category ?? '-'}
                                            </div>
                                        </div>
                                        <div className={row.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}>
                                            {formatMoney(row.amount, workspace.currency)}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}

function Stat({ label, value, subtitle, tone }: { label: string; value: string; subtitle?: string; tone?: string }) {
    return (
        <div className="rounded-2xl border border-border bg-card p-5">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className={`mt-2 text-2xl font-extrabold ${tone ?? ''}`}>{value}</div>
            {subtitle && <div className="mt-1 text-xs font-medium text-muted-foreground truncate">{subtitle}</div>}
        </div>
    );
}