import { Link, router } from '@inertiajs/react';
import type { TransactionRow, WorkspaceInfo } from '../_lib';
import { formatMoney } from '../_lib';

type Props = {
    workspace: WorkspaceInfo;
    rows: TransactionRow[];
    editUrl?: (row: TransactionRow) => string;
    showUrl?: (row: TransactionRow) => string;
    deleteUrl?: (row: TransactionRow) => string;
};

export default function TransactionTable({
    workspace,
    rows,
    editUrl,
    showUrl,
    deleteUrl,
}: Props) {
    if (rows.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
                Belum ada transaksi pada filter ini.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
                    <tr>
                        <th className="px-4 py-3">Judul</th>
                        <th className="px-4 py-3">Kategori</th>
                        <th className="px-4 py-3">Dompet</th>
                        <th className="px-4 py-3">Tanggal</th>
                        <th className="px-4 py-3 text-right">Jumlah</th>
                        <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {rows.map((row) => (
                        <tr key={row.id} className="hover:bg-muted/30">
                            <td className="px-4 py-3.5 font-medium">{row.title}</td>
                            <td className="px-4 py-3.5">
                                <span className="rounded-lg border border-border bg-secondary px-2.5 py-1 text-xs">
                                    {row.category?.name ?? '-'}
                                </span>
                            </td>
                            <td className="px-4 py-3.5 text-muted-foreground">
                                {row.wallet?.name ?? '-'}
                            </td>
                            <td className="px-4 py-3.5 text-xs text-muted-foreground">
                                {row.transaction_date}
                            </td>
                            <td
                                className={`px-4 py-3.5 text-right font-semibold ${
                                    row.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                                }`}
                            >
                                {row.type === 'income' ? '+' : '-'}{' '}
                                {formatMoney(row.amount, workspace.currency)}
                            </td>
                            <td className="px-4 py-3.5 text-right text-xs">
                                <div className="flex justify-end gap-2">
                                    {showUrl ? (
                                        <Link href={showUrl(row)} className="text-muted-foreground hover:text-foreground">
                                            Detail
                                        </Link>
                                    ) : null}
                                    {editUrl ? (
                                        <Link href={editUrl(row)} className="text-emerald-400 hover:text-emerald-300">
                                            Ubah
                                        </Link>
                                    ) : null}
                                    {deleteUrl ? (
                                        <button
                                            type="button"
                                            className="text-rose-400 hover:text-rose-300"
                                            onClick={() => {
                                                if (confirm('Hapus transaksi ini?')) {
                                                    router.delete(deleteUrl(row));
                                                }
                                            }}
                                        >
                                            Hapus
                                        </button>
                                    ) : null}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
