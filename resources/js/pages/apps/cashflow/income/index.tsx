import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';
import type { Paginator, TransactionRow, WorkspaceInfo } from '../_lib';
import { cfUrl } from '../_lib';
import FlashBanner from '../_components/flash-banner';
import PageHeader from '../_components/page-header';
import PaginationLinks from '../_components/pagination-links';
import TransactionTable from '../_components/transaction-table';

type Props = {
    workspace: WorkspaceInfo;
    transactions: Paginator<TransactionRow>;
    filters: {
        search?: string;
        date_from?: string;
        date_to?: string;
    };
};

export default function IncomeIndex({ workspace, transactions, filters }: Props) {
    const form = useForm({
        search: filters.search ?? '',
        date_from: filters.date_from ?? '',
        date_to: filters.date_to ?? '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Overview', href: '/overview' },
        { title: workspace.name, href: cfUrl(workspace.slug) },
        { title: 'Pemasukan', href: cfUrl(workspace.slug, 'income') },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Pemasukan - ${workspace.name}`} />
            <div className="flex-1 space-y-6 p-6">
                <PageHeader
                    title="Pemasukan"
                    description="Catat dan kelola arus kas masuk workspace."
                    actions={
                        <Button asChild>
                            <Link href={cfUrl(workspace.slug, 'income/create')}>+ Catat Pemasukan</Link>
                        </Button>
                    }
                />
                <FlashBanner />
                <form
                    className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-4"
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.get(cfUrl(workspace.slug, 'income'), { preserveState: true });
                    }}
                >
                    <Input
                        placeholder="Cari judul / referensi"
                        value={form.data.search}
                        onChange={(e) => form.setData('search', e.target.value)}
                    />
                    <Input
                        type="date"
                        value={form.data.date_from}
                        onChange={(e) => form.setData('date_from', e.target.value)}
                    />
                    <Input
                        type="date"
                        value={form.data.date_to}
                        onChange={(e) => form.setData('date_to', e.target.value)}
                    />
                    <Button type="submit" variant="default">
                        Filter
                    </Button>
                </form>
                <TransactionTable
                    workspace={workspace}
                    rows={transactions.data}
                    editUrl={(row) => cfUrl(workspace.slug, `income/${row.id}/edit`)}
                    deleteUrl={(row) => cfUrl(workspace.slug, `income/${row.id}`)}
                />
                <PaginationLinks paginator={transactions} />
            </div>
        </AppLayout>
    );
}
