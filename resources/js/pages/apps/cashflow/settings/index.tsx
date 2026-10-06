import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BreadcrumbItem } from '@/types';
import type { WorkspaceInfo } from '../_lib';
import { cfUrl } from '../_lib';
import FlashBanner from '../_components/flash-banner';
import PageHeader from '../_components/page-header';

type Props = {
    workspace: WorkspaceInfo;
};

export default function SettingsIndex({ workspace }: Props) {
    const form = useForm({
        name: workspace.name,
        currency: workspace.currency || 'IDR',
        timezone: workspace.timezone || 'Asia/Jakarta',
        description: workspace.description ?? '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Overview', href: '/overview' },
        { title: workspace.name, href: cfUrl(workspace.slug) },
        { title: 'Pengaturan', href: cfUrl(workspace.slug, 'settings') },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Pengaturan - ${workspace.name}`} />
            <div className="flex-1 space-y-6 p-6">
                <PageHeader
                    title="Pengaturan Modul"
                    description="Nama workspace, mata uang, dan zona waktu untuk modul cashflow."
                />
                <FlashBanner />
                <form
                    className="max-w-xl space-y-4 rounded-2xl border border-border bg-card p-6"
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.put(cfUrl(workspace.slug, 'settings'));
                    }}
                >
                    <div className="space-y-1.5">
                        <Label htmlFor="name">Nama workspace</Label>
                        <Input
                            id="name"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                        />
                        {form.errors.name && <p className="text-xs text-rose-400">{form.errors.name}</p>}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="currency">Mata uang</Label>
                            <Input
                                id="currency"
                                maxLength={3}
                                value={form.data.currency}
                                onChange={(e) => form.setData('currency', e.target.value.toUpperCase())}
                            />
                            {form.errors.currency && (
                                <p className="text-xs text-rose-400">{form.errors.currency}</p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="timezone">Zona waktu</Label>
                            <Input
                                id="timezone"
                                value={form.data.timezone}
                                onChange={(e) => form.setData('timezone', e.target.value)}
                            />
                            {form.errors.timezone && (
                                <p className="text-xs text-rose-400">{form.errors.timezone}</p>
                            )}
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="description">Deskripsi</Label>
                        <textarea
                            id="description"
                            className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                            value={form.data.description}
                            onChange={(e) => form.setData('description', e.target.value)}
                        />
                    </div>
                    <Button type="submit" disabled={form.processing}>
                        Simpan Pengaturan
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
