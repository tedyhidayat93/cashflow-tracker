import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { BreadcrumbItem } from '@/types';
import type { Paginator, WorkspaceInfo } from '../_lib';
import { cfUrl, formatMoney } from '../_lib';
import FlashBanner from '../_components/flash-banner';
import PageHeader from '../_components/page-header';
import PaginationLinks from '../_components/pagination-links';

type WalletOption = {
    id: number;
    name: string;
    currency: string;
    bank_name?: string | null;
    current_balance: number | string;
};

type TransferRow = {
    id: number;
    title: string | null;
    reference_number: string | null;
    description: string | null;
    amount: number | string;
    fee: number | string;
    transfer_date: string;
    from_wallet?: { id: number; name: string; currency: string } | null;
    to_wallet?: { id: number; name: string; currency: string } | null;
};

type FormState = {
    from_wallet_id: string;
    to_wallet_id: string;
    amount: string;
    fee: string;
    transfer_date: string;
    title: string;
    reference_number: string;
    description: string;
};

type Props = {
    workspace: WorkspaceInfo;
    transfers: Paginator<TransferRow>;
    wallets: WalletOption[];
    filters: {
        search?: string;
        wallet_id?: string;
        date_from?: string;
        date_to?: string;
    };
};

const today = () => new Date().toISOString().slice(0, 10);

const emptyForm = (): FormState => ({
    from_wallet_id: '',
    to_wallet_id: '',
    amount: '',
    fee: '0',
    transfer_date: today(),
    title: '',
    reference_number: '',
    description: '',
});

export default function TransfersIndex({ workspace, transfers, wallets, filters }: Props) {
    const [open, setOpen] = useState(false);
    const filterForm = useForm({
        search: filters.search ?? '',
        wallet_id: filters.wallet_id ?? '',
        date_from: filters.date_from ?? '',
        date_to: filters.date_to ?? '',
    });
    const form = useForm<FormState>(emptyForm());

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Overview', href: '/overview' },
        { title: workspace.name, href: cfUrl(workspace.slug) },
        { title: 'Dompet / Rekening', href: cfUrl(workspace.slug, 'accounts') },
        { title: 'Transfer', href: cfUrl(workspace.slug, 'transfers') },
    ];

    const fromWallet = wallets.find((w) => String(w.id) === form.data.from_wallet_id);

    const openCreate = () => {
        form.setData(emptyForm());
        form.clearErrors();
        setOpen(true);
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        form.post(cfUrl(workspace.slug, 'transfers'), {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                form.reset();
            },
        });
    };

    const walletSelect = (id: string, value: string, field: 'from_wallet_id' | 'to_wallet_id') => (
        <select
            id={id}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            value={value}
            onChange={(e) => form.setData(field, e.target.value)}
        >
            <option value="">Pilih dompet</option>
            {wallets.map((wallet) => (
                <option
                    key={wallet.id}
                    value={wallet.id}
                    disabled={field === 'to_wallet_id' && String(wallet.id) === form.data.from_wallet_id}
                >
                    {wallet.name}
                    {wallet.bank_name ? ` (${wallet.bank_name})` : ''}
                </option>
            ))}
        </select>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Transfer Dompet - ${workspace.name}`} />
            <div className="flex-1 space-y-6 p-6">
                <PageHeader
                    title="Transfer Dompet"
                    description="Pindahkan saldo antar kas, rekening bank, dan e-wallet."
                    actions={
                        <Button onClick={openCreate} disabled={wallets.length < 2}>
                            + Transfer Baru
                        </Button>
                    }
                />
                <FlashBanner />

                {wallets.length < 2 && (
                    <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
                        Dibutuhkan minimal dua dompet aktif untuk melakukan transfer.
                    </div>
                )}

                <form
                    className="grid gap-3 rounded-2xl border border-border bg-card p-4 md:grid-cols-5"
                    onSubmit={(event) => {
                        event.preventDefault();
                        filterForm.get(cfUrl(workspace.slug, 'transfers'), { preserveState: true });
                    }}
                >
                    <Input
                        placeholder="Cari judul / referensi"
                        value={filterForm.data.search}
                        onChange={(e) => filterForm.setData('search', e.target.value)}
                    />
                    <select
                        className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                        value={filterForm.data.wallet_id}
                        onChange={(e) => filterForm.setData('wallet_id', e.target.value)}
                    >
                        <option value="">Semua dompet</option>
                        {wallets.map((wallet) => (
                            <option key={wallet.id} value={wallet.id}>
                                {wallet.name}
                            </option>
                        ))}
                    </select>
                    <Input
                        type="date"
                        value={filterForm.data.date_from}
                        onChange={(e) => filterForm.setData('date_from', e.target.value)}
                    />
                    <Input
                        type="date"
                        value={filterForm.data.date_to}
                        onChange={(e) => filterForm.setData('date_to', e.target.value)}
                    />
                    <Button type="submit" variant="default">
                        Filter
                    </Button>
                </form>

                <div className="overflow-x-auto rounded-2xl border border-border bg-card">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3">Tanggal</th>
                                <th className="px-4 py-3">Transfer</th>
                                <th className="px-4 py-3">Dari → Ke</th>
                                <th className="px-4 py-3 text-right">Jumlah</th>
                                <th className="px-4 py-3 text-right">Biaya</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {transfers.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                                        Belum ada transfer.
                                    </td>
                                </tr>
                            ) : (
                                transfers.data.map((transfer) => {
                                    const currency = transfer.from_wallet?.currency ?? workspace.currency ?? 'IDR';

                                    return (
                                        <tr key={transfer.id} className="hover:bg-muted/30">
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                {transfer.transfer_date?.slice(0, 10)}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="font-medium">{transfer.title || '-'}</div>
                                                {transfer.reference_number && (
                                                    <div className="text-xs text-muted-foreground">
                                                        Ref: {transfer.reference_number}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                {transfer.from_wallet?.name ?? '-'}
                                                <span className="mx-1.5 text-muted-foreground">→</span>
                                                {transfer.to_wallet?.name ?? '-'}
                                            </td>
                                            <td className="px-4 py-3.5 text-right font-semibold">
                                                {formatMoney(Number(transfer.amount), currency)}
                                            </td>
                                            <td className="px-4 py-3.5 text-right text-muted-foreground">
                                                {Number(transfer.fee) > 0
                                                    ? formatMoney(Number(transfer.fee), currency)
                                                    : '-'}
                                            </td>
                                            <td className="px-4 py-3.5 text-right text-xs">
                                                <button
                                                    type="button"
                                                    className="text-rose-400 hover:underline"
                                                    onClick={() => {
                                                        if (confirm('Hapus transfer ini? Saldo kedua dompet akan dikembalikan.')) {
                                                            router.delete(
                                                                cfUrl(workspace.slug, `transfers/${transfer.id}`),
                                                                { preserveScroll: true },
                                                            );
                                                        }
                                                    }}
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                <PaginationLinks paginator={transfers} />
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Transfer Baru</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-3" onSubmit={submit}>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="from_wallet_id">Dari dompet</Label>
                                {walletSelect('from_wallet_id', form.data.from_wallet_id, 'from_wallet_id')}
                                {fromWallet && (
                                    <p className="text-xs text-muted-foreground">
                                        Saldo: {formatMoney(Number(fromWallet.current_balance), fromWallet.currency)}
                                    </p>
                                )}
                                {form.errors.from_wallet_id && (
                                    <p className="text-xs text-rose-400">{form.errors.from_wallet_id}</p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="to_wallet_id">Ke dompet</Label>
                                {walletSelect('to_wallet_id', form.data.to_wallet_id, 'to_wallet_id')}
                                {form.errors.to_wallet_id && (
                                    <p className="text-xs text-rose-400">{form.errors.to_wallet_id}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="amount">Jumlah</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.data.amount}
                                    onChange={(e) => form.setData('amount', e.target.value)}
                                />
                                {form.errors.amount && <p className="text-xs text-rose-400">{form.errors.amount}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="fee">Biaya admin</Label>
                                <Input
                                    id="fee"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.data.fee}
                                    onChange={(e) => form.setData('fee', e.target.value)}
                                />
                                {form.errors.fee && <p className="text-xs text-rose-400">{form.errors.fee}</p>}
                            </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="transfer_date">Tanggal</Label>
                                <Input
                                    id="transfer_date"
                                    type="date"
                                    value={form.data.transfer_date}
                                    onChange={(e) => form.setData('transfer_date', e.target.value)}
                                />
                                {form.errors.transfer_date && (
                                    <p className="text-xs text-rose-400">{form.errors.transfer_date}</p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="reference_number">No. referensi</Label>
                                <Input
                                    id="reference_number"
                                    placeholder="Otomatis jika kosong"
                                    value={form.data.reference_number}
                                    onChange={(e) => form.setData('reference_number', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="title">Judul</Label>
                            <Input
                                id="title"
                                placeholder="Opsional"
                                value={form.data.title}
                                onChange={(e) => form.setData('title', e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Input
                                id="description"
                                value={form.data.description}
                                onChange={(e) => form.setData('description', e.target.value)}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={form.processing}>
                                Transfer
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}