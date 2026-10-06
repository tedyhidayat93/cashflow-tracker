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
import type { Option, Paginator, WalletRow, WorkspaceInfo } from '../_lib';
import { cfUrl, formatMoney } from '../_lib';
import FlashBanner from '../_components/flash-banner';
import PageHeader from '../_components/page-header';
import PaginationLinks from '../_components/pagination-links';

type FormState = {
    name: string;
    type: string;
    opening_balance: string;
    currency: string;
    account_number: string;
    bank_name: string;
    description: string;
    is_active: boolean;
};

type Props = {
    workspace: WorkspaceInfo;
    wallets: Paginator<WalletRow>;
    types: Option[];
    filters: { search?: string };
};

export default function AccountsIndex({ workspace, wallets, types, filters }: Props) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<WalletRow | null>(null);
    const filterForm = useForm({ search: filters.search ?? '' });
    const form = useForm<FormState>({
        name: '',
        type: types[0]?.value ?? 'cash',
        opening_balance: '0',
        currency: workspace.currency || 'IDR',
        account_number: '',
        bank_name: '',
        description: '',
        is_active: true,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Overview', href: '/overview' },
        { title: workspace.name, href: cfUrl(workspace.slug) },
        { title: 'Dompet / Rekening', href: cfUrl(workspace.slug, 'accounts') },
    ];

    const openCreate = () => {
        setEditing(null);
        form.setData({
            name: '',
            type: types[0]?.value ?? 'cash',
            opening_balance: '0',
            currency: workspace.currency || 'IDR',
            account_number: '',
            bank_name: '',
            description: '',
            is_active: true,
        });
        form.clearErrors();
        setOpen(true);
    };

    const openEdit = (wallet: WalletRow) => {
        setEditing(wallet);
        form.setData({
            name: wallet.name,
            type: wallet.type,
            opening_balance: String(wallet.opening_balance ?? 0),
            currency: wallet.currency || workspace.currency,
            account_number: wallet.account_number ?? '',
            bank_name: wallet.bank_name ?? '',
            description: wallet.description ?? '',
            is_active: Boolean(wallet.is_active),
        });
        form.clearErrors();
        setOpen(true);
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        const url = editing
            ? cfUrl(workspace.slug, `accounts/${editing.id}`)
            : cfUrl(workspace.slug, 'accounts');

        form[editing ? 'put' : 'post'](url, {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Dompet / Rekening - ${workspace.name}`} />
            <div className="flex-1 space-y-6 p-6">
                <PageHeader
                    title="Dompet / Rekening"
                    description="Kelola kas, rekening bank, dan e-wallet workspace."
                    actions={<Button onClick={openCreate}>+ Tambah Dompet</Button>}
                />
                <FlashBanner />
                <form
                    className="flex gap-3 rounded-2xl border border-border bg-card p-4"
                    onSubmit={(event) => {
                        event.preventDefault();
                        filterForm.get(cfUrl(workspace.slug, 'accounts'), { preserveState: true });
                    }}
                >
                    <Input
                        placeholder="Cari nama dompet"
                        value={filterForm.data.search}
                        onChange={(e) => filterForm.setData('search', e.target.value)}
                    />
                    <Button type="submit" variant="default">
                        Cari
                    </Button>
                </form>

                <div className="overflow-x-auto rounded-2xl border border-border bg-card">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3">Nama</th>
                                <th className="px-4 py-3">Tipe</th>
                                <th className="px-4 py-3">Nomor</th>
                                <th className="px-4 py-3 text-right">Saldo</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {wallets.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                                        Belum ada dompet. Tambahkan rekening atau kas terlebih dahulu.
                                    </td>
                                </tr>
                            ) : (
                                wallets.data.map((wallet) => (
                                    <tr key={wallet.id} className="hover:bg-muted/30">
                                        <td className="px-4 py-3.5">
                                            <div className="font-medium">{wallet.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {wallet.bank_name || wallet.currency}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 capitalize">
                                            {wallet.type.replace('_', ' ')}
                                        </td>
                                        <td className="px-4 py-3.5 text-muted-foreground">
                                            {wallet.account_number ?? '-'}
                                        </td>
                                        <td className="px-4 py-3.5 text-right font-semibold">
                                            {formatMoney(Number(wallet.current_balance), wallet.currency)}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            {wallet.is_active ? 'Aktif' : 'Arsip'}
                                        </td>
                                        <td className="px-4 py-3.5 text-right text-xs">
                                            <button
                                                type="button"
                                                className="mr-3 text-emerald-400"
                                                onClick={() => openEdit(wallet)}
                                            >
                                                Ubah
                                            </button>
                                            <button
                                                type="button"
                                                className="text-rose-400"
                                                onClick={() => {
                                                    if (confirm('Hapus dompet ini?')) {
                                                        router.delete(
                                                            cfUrl(workspace.slug, `accounts/${wallet.id}`),
                                                        );
                                                    }
                                                }}
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <PaginationLinks paginator={wallets} />
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Ubah Dompet' : 'Tambah Dompet'}</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-3" onSubmit={submit}>
                        <div className="space-y-1.5">
                            <Label htmlFor="name">Nama</Label>
                            <Input
                                id="name"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                            />
                            {form.errors.name && <p className="text-xs text-rose-400">{form.errors.name}</p>}
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="type">Tipe</Label>
                                <select
                                    id="type"
                                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                                    value={form.data.type}
                                    onChange={(e) => form.setData('type', e.target.value)}
                                >
                                    {types.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {!editing ? (
                                <div className="space-y-1.5">
                                    <Label htmlFor="opening_balance">Saldo awal</Label>
                                    <Input
                                        id="opening_balance"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.data.opening_balance}
                                        onChange={(e) => form.setData('opening_balance', e.target.value)}
                                    />
                                </div>
                            ) : null}
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="account_number">No. rekening</Label>
                                <Input
                                    id="account_number"
                                    value={form.data.account_number}
                                    onChange={(e) => form.setData('account_number', e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="bank_name">Bank / penyedia</Label>
                                <Input
                                    id="bank_name"
                                    value={form.data.bank_name}
                                    onChange={(e) => form.setData('bank_name', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Input
                                id="description"
                                value={form.data.description}
                                onChange={(e) => form.setData('description', e.target.value)}
                            />
                        </div>
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={form.data.is_active}
                                onChange={(e) => form.setData('is_active', e.target.checked)}
                            />
                            Aktif
                        </label>
                        <DialogFooter>
                            <Button type="submit" disabled={form.processing}>
                                Simpan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
