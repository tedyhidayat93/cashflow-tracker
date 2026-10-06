import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';
import type { TransactionRow, WorkspaceInfo } from '../_lib';
import { cfUrl, formatMoney } from '../_lib';
import PageHeader from '../_components/page-header';

type Props = {
    workspace: WorkspaceInfo;
    transaction: TransactionRow;
};

export default function TransactionShow({ workspace, transaction }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Overview', href: '/overview' },
        { title: workspace.name, href: cfUrl(workspace.slug) },
        { title: 'Semua Transaksi', href: cfUrl(workspace.slug, 'transactions') },
        { title: transaction.title, href: cfUrl(workspace.slug, `transactions/${transaction.id}`) },
    ];

    const editUrl = cfUrl(
        workspace.slug,
        `${transaction.type === 'income' ? 'income' : 'expense'}/${transaction.id}/edit`,
    );

    const rows = [
        ['Judul', transaction.title],
        ['Tipe', transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'],
        ['Jumlah', formatMoney(transaction.amount, workspace.currency)],
        ['Tanggal', transaction.transaction_date],
        ['Kategori', transaction.category?.name ?? '-'],
        ['Dompet', transaction.wallet?.name ?? '-'],
        ['No. Referensi', transaction.reference_number ?? '-'],
        ['Catatan', transaction.description ?? '-'],
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${transaction.title} - ${workspace.name}`} />
            <div className="flex-1 space-y-6 p-6">
                <PageHeader
                    title="Detail Transaksi"
                    description="Informasi lengkap transaksi yang dipilih."
                    actions={
                        <Button asChild>
                            <Link href={editUrl}>Ubah Transaksi</Link>
                        </Button>
                    }
                />
                <div className="max-w-2xl divide-y divide-border rounded-2xl border border-border bg-card">
                    {rows.map(([label, value]) => (
                        <div key={label} className="grid gap-1 px-5 py-4 sm:grid-cols-3">
                            <div className="text-xs uppercase tracking-wide text-muted-foreground">
                                {label}
                            </div>
                            <div className="sm:col-span-2 text-sm font-medium">{value}</div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
