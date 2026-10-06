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
import type { CategoryOption, CategoryRow, Option, Paginator, WorkspaceInfo } from '../_lib';
import { cfUrl } from '../_lib';
import FlashBanner from '../_components/flash-banner';
import PageHeader from '../_components/page-header';
import PaginationLinks from '../_components/pagination-links';

type FormState = {
    name: string;
    type: string;
    parent_id: string;
    icon: string;
    color: string;
    description: string;
    is_active: boolean;
};

const emptyForm: FormState = {
    name: '',
    type: 'expense',
    parent_id: '',
    icon: '',
    color: '',
    description: '',
    is_active: true,
};

type Props = {
    workspace: WorkspaceInfo;
    categories: Paginator<CategoryRow>;
    parents: CategoryOption[];
    types: Option[];
    filters: { search?: string; type?: string };
};

export default function CategoriesIndex({ workspace, categories, parents, types, filters }: Props) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<CategoryRow | null>(null);
    const filterForm = useForm({
        search: filters.search ?? '',
        type: filters.type ?? '',
    });
    const form = useForm<FormState>(emptyForm);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Overview', href: '/overview' },
        { title: workspace.name, href: cfUrl(workspace.slug) },
        { title: 'Kategori', href: cfUrl(workspace.slug, 'categories') },
    ];

    const openCreate = () => {
        setEditing(null);
        form.setData(emptyForm);
        form.clearErrors();
        setOpen(true);
    };

    const openEdit = (category: CategoryRow) => {
        setEditing(category);
        form.setData({
            name: category.name,
            type: category.type,
            parent_id: category.parent_id?.toString() ?? '',
            icon: category.icon ?? '',
            color: category.color ?? '',
            description: category.description ?? '',
            is_active: Boolean(category.is_active),
        });
        form.clearErrors();
        setOpen(true);
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        const url = editing
            ? cfUrl(workspace.slug, `categories/${editing.id}`)
            : cfUrl(workspace.slug, 'categories');

        form[editing ? 'put' : 'post'](url, {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Kategori - ${workspace.name}`} />
            <div className="flex-1 space-y-6 p-6">
                <PageHeader
                    title="Kategori"
                    description="Kelompokkan pemasukan dan pengeluaran."
                    actions={<Button onClick={openCreate}>+ Tambah Kategori</Button>}
                />
                <FlashBanner />
                <form
                    className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-3"
                    onSubmit={(event) => {
                        event.preventDefault();
                        filterForm.get(cfUrl(workspace.slug, 'categories'), { preserveState: true });
                    }}
                >
                    <Input
                        placeholder="Cari nama"
                        value={filterForm.data.search}
                        onChange={(e) => filterForm.setData('search', e.target.value)}
                    />
                    <select
                        className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                        value={filterForm.data.type}
                        onChange={(e) => filterForm.setData('type', e.target.value)}
                    >
                        <option value="">Semua tipe</option>
                        {types.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                    <Button type="submit" variant="default">
                        Filter
                    </Button>
                </form>

                <div className="overflow-x-auto rounded-2xl border border-border bg-card">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3">Nama</th>
                                <th className="px-4 py-3">Tipe</th>
                                <th className="px-4 py-3">Induk</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {categories.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                                        Belum ada kategori.
                                    </td>
                                </tr>
                            ) : (
                                categories.data.map((category) => (
                                    <tr key={category.id} className="hover:bg-muted/30">
                                        <td className="px-4 py-3.5 font-medium">{category.name}</td>
                                        <td className="px-4 py-3.5 capitalize">{category.type}</td>
                                        <td className="px-4 py-3.5 text-muted-foreground">
                                            {category.parent?.name ?? '-'}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            {category.is_active ? 'Aktif' : 'Arsip'}
                                        </td>
                                        <td className="px-4 py-3.5 text-right text-xs">
                                            <button
                                                type="button"
                                                className="mr-3 text-emerald-400"
                                                onClick={() => openEdit(category)}
                                            >
                                                Ubah
                                            </button>
                                            <button
                                                type="button"
                                                className="text-rose-400"
                                                onClick={() => {
                                                    if (confirm('Hapus kategori ini?')) {
                                                        router.delete(
                                                            cfUrl(workspace.slug, `categories/${category.id}`),
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
                <PaginationLinks paginator={categories} />
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Ubah Kategori' : 'Tambah Kategori'}</DialogTitle>
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
                        <div className="space-y-1.5">
                            <Label htmlFor="parent_id">Kategori induk</Label>
                            <select
                                id="parent_id"
                                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                                value={form.data.parent_id}
                                onChange={(e) => form.setData('parent_id', e.target.value)}
                            >
                                <option value="">Tidak ada</option>
                                {parents
                                    .filter((parent) => parent.id !== editing?.id)
                                    .map((parent) => (
                                        <option key={parent.id} value={parent.id}>
                                            {parent.name}
                                        </option>
                                    ))}
                            </select>
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
