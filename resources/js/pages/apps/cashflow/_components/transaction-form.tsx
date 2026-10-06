import { Link, useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { CategoryOption, TransactionRow, WalletOption, WorkspaceInfo } from '../_lib';

type Props = {
    workspace: WorkspaceInfo;
    wallets: WalletOption[];
    categories: CategoryOption[];
    transaction?: TransactionRow;
    submitUrl: string;
    method: 'post' | 'put';
    cancelUrl: string;
    submitLabel: string;
};

export default function TransactionForm({
    workspace,
    wallets,
    categories,
    transaction,
    submitUrl,
    method,
    cancelUrl,
    submitLabel,
}: Props) {
    const form = useForm({
        title: transaction?.title ?? '',
        amount: transaction?.amount?.toString() ?? '',
        wallet_id: transaction?.wallet_id?.toString() ?? '',
        category_id: transaction?.category_id?.toString() ?? '',
        transaction_date: transaction?.transaction_date ?? new Date().toISOString().slice(0, 10),
        reference_number: transaction?.reference_number ?? '',
        description: transaction?.description ?? '',
    });

    return (
        <form
            className="max-w-2xl space-y-4"
            onSubmit={(event) => {
                event.preventDefault();
                form[method](submitUrl);
            }}
        >
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="title">Judul</Label>
                    <Input
                        id="title"
                        value={form.data.title}
                        onChange={(e) => form.setData('title', e.target.value)}
                    />
                    {form.errors.title && <p className="text-xs text-rose-400">{form.errors.title}</p>}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="amount">Jumlah ({workspace.currency})</Label>
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
                    <Label htmlFor="transaction_date">Tanggal</Label>
                    <Input
                        id="transaction_date"
                        type="date"
                        value={form.data.transaction_date}
                        onChange={(e) => form.setData('transaction_date', e.target.value)}
                    />
                    {form.errors.transaction_date && (
                        <p className="text-xs text-rose-400">{form.errors.transaction_date}</p>
                    )}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="wallet_id">Dompet</Label>
                    <select
                        id="wallet_id"
                        className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                        value={form.data.wallet_id}
                        onChange={(e) => form.setData('wallet_id', e.target.value)}
                    >
                        <option value="">Pilih dompet</option>
                        {wallets.map((wallet) => (
                            <option key={wallet.id} value={wallet.id}>
                                {wallet.name}
                            </option>
                        ))}
                    </select>
                    {form.errors.wallet_id && <p className="text-xs text-rose-400">{form.errors.wallet_id}</p>}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="category_id">Kategori</Label>
                    <select
                        id="category_id"
                        className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                        value={form.data.category_id}
                        onChange={(e) => form.setData('category_id', e.target.value)}
                    >
                        <option value="">Pilih kategori</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {form.errors.category_id && (
                        <p className="text-xs text-rose-400">{form.errors.category_id}</p>
                    )}
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="reference_number">No. Referensi</Label>
                    <Input
                        id="reference_number"
                        value={form.data.reference_number}
                        onChange={(e) => form.setData('reference_number', e.target.value)}
                    />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="description">Catatan</Label>
                    <textarea
                        id="description"
                        className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                        value={form.data.description}
                        onChange={(e) => form.setData('description', e.target.value)}
                    />
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button type="submit" disabled={form.processing}>
                    {submitLabel}
                </Button>
                <Button type="button" variant="outline" asChild>
                    <Link href={cancelUrl}>Batal</Link>
                </Button>
            </div>
        </form>
    );
}
