import { Link } from '@inertiajs/react';
import type { Paginator } from '../_lib';
import { paginatorMeta } from '../_lib';

type Props<T> = {
    paginator: Paginator<T>;
};

export default function PaginationLinks<T>({ paginator }: Props<T>) {
    const meta = paginatorMeta(paginator);
    const links = paginator.links ?? [];

    if (meta.last_page <= 1) {
        return null;
    }

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
                Menampilkan {meta.from ?? 0}–{meta.to ?? 0} dari {meta.total} data
            </p>
            <div className="flex flex-wrap gap-1">
                {links.map((link, index) => {
                    const label = link.label.replace(/&laquo;|&raquo;/g, '').trim();

                    if (!link.url) {
                        return (
                            <span
                                key={`${label}-${index}`}
                                className="rounded-lg border border-border px-2.5 py-1 text-xs text-muted-foreground opacity-50"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    }

                    return (
                        <Link
                            key={`${label}-${index}`}
                            href={link.url}
                            preserveScroll
                            preserveState
                            className={`rounded-lg border px-2.5 py-1 text-xs ${
                                link.active
                                    ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                                    : 'border-border text-muted-foreground hover:bg-muted/50'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                })}
            </div>
        </div>
    );
}
