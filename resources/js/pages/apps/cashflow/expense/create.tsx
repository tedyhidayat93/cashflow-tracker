import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { CategoryOption, WalletOption, WorkspaceInfo } from '../_lib';
import { cfUrl } from '../_lib';
import PageHeader from '../_components/page-header';
import TransactionForm from '../_components/transaction-form';

type Props = {
    workspace: WorkspaceInfo;
    wallets: WalletOption[];
    categories: CategoryOption[];
};

export default function ExpenseCreate({ workspace, wallets, categories }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Overview', href: '/overview' },
        { title: workspace.name, href: cfUrl(workspace.slug) },
        { title: 'Pengeluaran', href: cfUrl(workspace.slug, 'expense') },
        { title: 'Tambah', href: cfUrl(workspace.slug, 'expense/create') },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Catat Pengeluaran - ${workspace.name}`} />
            <div className="flex-1 space-y-6 p-6">
                <PageHeader
                    title="Catat Pengeluaran"
                    description="Tambahkan transaksi pengeluaran dari salah satu dompet."
                />
                <div className="rounded-2xl border border-border bg-card p-6">
                    <TransactionForm
                        workspace={workspace}
                        wallets={wallets}
                        categories={categories}
                        submitUrl={cfUrl(workspace.slug, 'expense')}
                        method="post"
                        cancelUrl={cfUrl(workspace.slug, 'expense')}
                        submitLabel="Simpan Pengeluaran"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
