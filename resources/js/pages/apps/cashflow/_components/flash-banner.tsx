import { usePage } from '@inertiajs/react';

type FlashProps = {
    flash?: {
        success?: string | null;
        error?: string | null;
    };
    [key: string]: unknown;
};

export default function FlashBanner() {
    const { flash } = usePage<FlashProps>().props;

    if (!flash?.success && !flash?.error) {
        return null;
    }

    return (
        <div
            className={`rounded-xl border px-4 py-3 text-sm ${
                flash.error
                    ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                    : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
            }`}
        >
            {flash.error || flash.success}
        </div>
    );
}
