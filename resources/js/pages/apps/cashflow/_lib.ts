export type WorkspaceInfo = {
    id: number;
    name: string;
    slug: string;
    currency: string;
    timezone: string;
    description?: string | null;
};

export type WalletOption = {
    id: number;
    name: string;
    type?: string;
    current_balance?: number;
    currency?: string;
};

export type CategoryOption = {
    id: number;
    name: string;
    type: string;
    parent_id?: number | null;
};

export type TransactionRow = {
    id: number;
    title: string;
    description?: string | null;
    reference_number?: string | null;
    amount: number;
    type: 'income' | 'expense';
    transaction_date: string;
    wallet_id?: number;
    category_id?: number;
    wallet?: { id: number; name: string } | null;
    category?: { id: number; name: string; type?: string } | null;
};

export type Paginator<T> = {
    data: T[];
    links?: { url: string | null; label: string; active: boolean }[];
    current_page?: number;
    last_page?: number;
    from?: number | null;
    to?: number | null;
    total?: number;
    meta?: {
        current_page: number;
        last_page: number;
        from: number | null;
        to: number | null;
        total: number;
    };
};

export type Option = {
    value: string;
    label: string;
};

export type WalletRow = {
    id: number;
    name: string;
    type: string;
    opening_balance: number | string;
    current_balance: number | string;
    currency: string;
    account_number?: string | null;
    bank_name?: string | null;
    description?: string | null;
    is_active: boolean;
};

export type CategoryRow = {
    id: number;
    name: string;
    type: string;
    parent_id?: number | null;
    icon?: string | null;
    color?: string | null;
    description?: string | null;
    is_active: boolean;
    parent?: { id: number; name: string } | null;
};

export function cfUrl(slug: string, path = '') {
    const suffix = path ? `/${path.replace(/^\//, '')}` : '';
    return `/w/${slug}/cf${suffix}`;
}

export function formatMoney(amount: number, currency = 'IDR') {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(amount);
}

export function paginatorMeta(paginator: Paginator<unknown>) {
    return {
        current_page: paginator.meta?.current_page ?? paginator.current_page ?? 1,
        last_page: paginator.meta?.last_page ?? paginator.last_page ?? 1,
        from: paginator.meta?.from ?? paginator.from ?? null,
        to: paginator.meta?.to ?? paginator.to ?? null,
        total: paginator.meta?.total ?? paginator.total ?? 0,
    };
}
