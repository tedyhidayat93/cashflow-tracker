import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { CategoryOption, TransactionRow, WalletOption, WorkspaceInfo } from '../_lib';
import { cfUrl } from '../_lib';
import PageHeader from '../_components/page-header';
import TransactionForm from '../_components/transaction-form';

type Props = {
    workspace: WorkspaceInfo;
    wallets: WalletOption[];
    categories: CategoryOption[];
    transaction: TransactionRow;
};

export default function IncomeEdit({ workspace, wallets, categories, transaction }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Overview', href: '/overview' },
        { title: workspace.name, href: cfUrl(workspace.slug) },
        { title: 'Pemasukan', href: cfUrl(workspace.slug, 'income') },
        { title: 'Ubah', href: cfUrl(workspace.slug, `income/${transaction.id}/edit`) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Ubah Pemasukan - ${workspace.name}`} />
            <div className="flex-1 space-y-6 p-6">
                <PageHeader
                    title="Ubah Pemasukan"
                    description="Perbarui detail transaksi pemasukan."
                />
                <div className="rounded-2xl border border-border bg-card p-6">
                    <TransactionForm
                        workspace={workspace}
                        wallets={wallets}
                        categories={categories}
                        transaction={transaction}
                        submitUrl={cfUrl(workspace.slug, `income/${transaction.id}`)}
                        method="put"
                        cancelUrl={cfUrl(workspace.slug, 'income')}
                        submitLabel="Simpan Perubahan"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
