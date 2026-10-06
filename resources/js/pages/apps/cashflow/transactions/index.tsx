import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';
import type { CategoryOption, Paginator, TransactionRow, WalletOption, WorkspaceInfo } from '../_lib';
import { cfUrl } from '../_lib';
import FlashBanner from '../_components/flash-banner';
import PageHeader from '../_components/page-header';
import PaginationLinks from '../_components/pagination-links';
import TransactionTable from '../_components/transaction-table';
import { Label } from '@/components/ui/label';

type Props = {
    workspace: WorkspaceInfo;
    transactions: Paginator<TransactionRow>;
    wallets: WalletOption[];
    categories: CategoryOption[];
    filters: {
        search?: string;
        date_from?: string;
        date_to?: string;
        type?: string;
        wallet_id?: string | number;
        category_id?: string | number;
    };
};

export default function TransactionsIndex({
    workspace,
    transactions,
    wallets,
    categories,
    filters,
}: Props) {
    const form = useForm({
        search: filters.search ?? '',
        date_from: filters.date_from ?? '',
        date_to: filters.date_to ?? '',
        type: filters.type ?? '',
        wallet_id: filters.wallet_id?.toString() ?? '',
        category_id: filters.category_id?.toString() ?? '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Overview', href: '/overview' },
        { title: workspace.name, href: cfUrl(workspace.slug) },
        { title: 'Semua Transaksi', href: cfUrl(workspace.slug, 'transactions') },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Semua Transaksi - ${workspace.name}`} />
            <div className="flex-1 space-y-6 p-6">
                <PageHeader
                    title="Semua Transaksi"
                    description="Riwayat pemasukan dan pengeluaran di workspace ini."
                    actions={
                        <>
                            <Button variant="outline" asChild>
                                <Link href={cfUrl(workspace.slug, 'income/create')}>Pemasukan</Link>
                            </Button>
                            <Button asChild>
                                <Link href={cfUrl(workspace.slug, 'expense/create')}>Pengeluaran</Link>
                            </Button>
                        </>
                    }
                />
                <FlashBanner />
                <form
                    className="rounded-2xl border border-border bg-card p-4 shadow-sm"
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.get(cfUrl(workspace.slug, 'transactions'), { preserveState: true });
                    }}
                >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-6">
                        {/* Search */}
                        <div className="space-y-1.5">
                            <Label htmlFor="search" className="text-xs font-medium text-muted-foreground">
                                Pencarian
                            </Label>
                            <Input
                                id="search"
                                placeholder="Cari transaksi..."
                                value={form.data.search}
                                onChange={(e) => form.setData('search', e.target.value)}
                            />
                        </div>

                        {/* Tanggal Mulai */}
                        <div className="space-y-1.5">
                            <Label htmlFor="date_from" className="text-xs font-medium text-muted-foreground">
                                Dari Tanggal
                            </Label>
                            <Input
                                id="date_from"
                                type="date"
                                value={form.data.date_from}
                                onChange={(e) => form.setData('date_from', e.target.value)}
                            />
                        </div>

                        {/* Tanggal Selesai */}
                        <div className="space-y-1.5">
                            <Label htmlFor="date_to" className="text-xs font-medium text-muted-foreground">
                                Sampai Tanggal
                            </Label>
                            <Input
                                id="date_to"
                                type="date"
                                value={form.data.date_to}
                                onChange={(e) => form.setData('date_to', e.target.value)}
                            />
                        </div>

                        {/* Tipe Transaksi */}
                        <div className="space-y-1.5">
                            <Label htmlFor="type" className="text-xs font-medium text-muted-foreground">
                                Tipe
                            </Label>
                            <select
                                id="type"
                                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                value={form.data.type}
                                onChange={(e) => form.setData('type', e.target.value)}
                            >
                                <option value="">Semua tipe</option>
                                <option value="income">Pemasukan</option>
                                <option value="expense">Pengeluaran</option>
                            </select>
                        </div>

                        {/* Dompet */}
                        <div className="space-y-1.5">
                            <Label htmlFor="wallet_id" className="text-xs font-medium text-muted-foreground">
                                Dompet
                            </Label>
                            <select
                                id="wallet_id"
                                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                value={form.data.wallet_id}
                                onChange={(e) => form.setData('wallet_id', e.target.value)}
                            >
                                <option value="">Semua dompet</option>
                                {wallets.map((wallet) => (
                                    <option key={wallet.id} value={wallet.id}>
                                        {wallet.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Kategori & Action */}
                        <div className="space-y-1.5">
                            <Label htmlFor="category_id" className="text-xs font-medium text-muted-foreground">
                                Kategori
                            </Label>
                            <div className="flex gap-2">
                                <select
                                    id="category_id"
                                    className="h-9 flex-1 rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    value={form.data.category_id}
                                    onChange={(e) => form.setData('category_id', e.target.value)}
                                >
                                    <option value="">Semua kategori</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <Button type="submit" variant="default" className="shrink-0">
                                    Filter
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
                <TransactionTable
                    workspace={workspace}
                    rows={transactions.data}
                    showUrl={(row) => cfUrl(workspace.slug, `transactions/${row.id}`)}
                    editUrl={(row) =>
                        cfUrl(
                            workspace.slug,
                            `${row.type === 'income' ? 'income' : 'expense'}/${row.id}/edit`,
                        )
                    }
                />
                <PaginationLinks paginator={transactions} />
            </div>
        </AppLayout>
    );
}
