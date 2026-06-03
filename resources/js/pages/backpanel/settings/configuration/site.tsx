import React from 'react';
import { Head, useForm, router, usePage, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import HeadingSmall from '@/components/heading-small';
import HeaderTitle from '@/components/header-title';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Plus, Edit, Trash2, MoreHorizontal, Settings, Globe, Mail, Phone, MapPin, Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import AppearanceToggleTab from '@/components/appearance-tabs';

interface Configuration {
  id: number;
  label: string;
  description?: string;
  group: string;
  key: string;
  value: string;
  type: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  configurations: Configuration[];
  currentGroup: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Pengaturan',
    href: '/cpanel/settings/configuration/site',
  },
];

const getGroupInfo = (group: string) => {
  switch (group) {
    case 'site':
      return {
        title: 'Konfigurasi Umum',
        description: 'Kelola pengaturan konfigurasi situs website anda. Atur informasi dasar seperti nama situs, deskripsi, kontak, dan pengaturan penting lainnya.'
      };
    case 'email':
      return {
        title: 'Konfigurasi Email',
        description: 'Kelola pengaturan email dan SMTP untuk pengiriman notifikasi dan komunikasi dengan pelanggan.'
      };
    case 'system':
      return {
        title: 'Konfigurasi Sistem',
        description: 'Kelola pengaturan sistem inti, konfigurasi aplikasi, dan parameter teknis lainnya untuk operasional sistem.'
      };
    case 'payment':
      return {
        title: 'Konfigurasi Pembayaran',
        description: 'Kelola pengaturan metode pembayaran, gateway pembayaran, dan konfigurasi transaksi keuangan sistem.'
      };
    case 'shipping':
      return {
        title: 'Konfigurasi Pengiriman',
        description: 'Kelola pengaturan metode pengiriman, biaya pengiriman, dan konfigurasi logistik untuk sistem e-commerce.'
      };
    case 'view_homepage':
      return {
        title: 'Konfigurasi Tampilan Landing Page',
        description: 'Kelola konten dan tampilan halaman depan website termasuk teks, judul, dan deskripsi.'
      };
    default:
      return {
        title: 'Konfigurasi Lainnya',
        description: 'Kelola pengaturan tambahan dan konfigurasi khusus lainnya yang tidak termasuk dalam kategori utama.'
      };
  }
};

export default function SiteConfiguration({ configurations, currentGroup }: Props) {

  const [search, setSearch] = React.useState('');
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editingConfig, setEditingConfig] = React.useState<Configuration | null>(null);

  const configForm = useForm({
    configurations: configurations.map(config => ({
      id: config.id,
      value: config.value
    }))
  });

  const addForm = useForm({
    label: '',
    key: '',
    description: '',
    value: '',
    type: 'text'
  });

  const editForm = useForm({
    id: '',
    value: ''
  });

 
  const handleAddConfig = (e: React.FormEvent) => {
    e.preventDefault();
    addForm.post(`/cpanel/settings/configuration/${currentGroup}`, {
      onSuccess: () => {
        setIsAddModalOpen(false);
        addForm.reset();
      },
    });
  };

  const handleEditConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingConfig) {
      const formData = new FormData();
      formData.append('_method', 'PUT')
      formData.append('id', String(editForm.data.id));
      formData.append('value', String(editForm.data.value));
      
      // If it's an image type, append file if exists
      const fileInput = document.querySelector('input[name="file"]') as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        formData.append('file', fileInput.files[0]);
      }

      console.log(editForm.data.id)
      
      router.post(`/cpanel/settings/configuration/${currentGroup}`, formData, {
        onSuccess: () => {
          setIsEditModalOpen(false);
          setEditingConfig(null);
          editForm.reset();
        },
        onError: (errors) => {
          console.log(formData)
          alert(JSON.stringify(errors))
          console.error('Error updating configuration:', errors);
        }
      });
    }
  };

  const openEditModal = (config: Configuration) => {
    setEditingConfig(config);
    editForm.setData('id', config.id.toString());
    editForm.setData('value', config.value);
    setIsEditModalOpen(true);
  };

  const filteredConfigurations = configurations.filter(config => 
    config.label.toLowerCase().includes(search.toLowerCase()) ||
    config.key.toLowerCase().includes(search.toLowerCase()) ||
    config.value.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus konfigurasi ini?')) {
      router.delete(`/cpanel/settings/configuration/${currentGroup}/${id}`);
    }
  };

  const renderEditInput = () => {
    if (!editingConfig) return null;
    
    switch (editingConfig.type) {
      case 'textarea':
        return (
          <Textarea
            value={editForm.data.value}
            onChange={(e) => editForm.setData('value', e.target.value)}
            placeholder={editingConfig.description || `Masukkan ${editingConfig.label.toLowerCase()}`}
          />
        );
      case 'select':
        return (
          <Select
            value={editForm.data.value}
            onValueChange={(value) => editForm.setData('value', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Pilih ${editingConfig.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Ya</SelectItem>
              <SelectItem value="no">Tidak</SelectItem>
              <SelectItem value="enabled">Aktif</SelectItem>
              <SelectItem value="disabled">Nonaktif</SelectItem>
            </SelectContent>
          </Select>
        );
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={editForm.data.value === 'true'}
              onChange={(e) => editForm.setData('value', e.target.checked ? 'true' : 'false')}
              className="h-4 w-4"
            />
            <Label>{editingConfig.description || editingConfig.label}</Label>
          </div>
        );
      case 'file':
      case 'image':
        return (
          <div className="space-y-2">
            <Input
              name="file"
              type="file"
              accept={editingConfig.type === 'image' ? 'image/*' : '*'}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  editForm.setData('value', file.name);
                }
              }}
            />
            {editForm.data.value && (
              <p className="text-sm text-gray-500">File saat ini: {editForm.data.value}</p>
            )}
          </div>
        );
      default:
        return (
          <Input
            value={editForm.data.value}
            onChange={(e) => editForm.setData('value', e.target.value)}
            placeholder={editingConfig.description || `Masukkan ${editingConfig.label.toLowerCase()}`}
          />
        );
    }
  };

  const getGroupTitle = (group: string) => {
    switch (group) {
      case 'site':
        return 'Pengaturan Situs';
      case 'email':
        return 'Pengaturan Email';
      case 'system':
        return 'Pengaturan Sistem';
      case 'payment':
        return 'Pengaturan Pembayaran';
      case 'shipping':
        return 'Pengaturan Pengiriman';
      case 'view_homepage':
        return 'Pengaturan Tampilan';
      default:
        return 'Pengaturan Lainnya';
    }
  };

  const groupInfo = getGroupInfo(currentGroup);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={groupInfo.title} />

      <SettingsLayout>
        <div className="space-y-6">
          <HeaderTitle
            title={groupInfo.title}
            description={groupInfo.description}
          >
            {/* <AppearanceToggleTab /> */}
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Konfigurasi
            </Button>
          </HeaderTitle>

          <Card>
            <CardContent>
              {/* tab setting */}
              <div className="space-y-4">
                {/* Tab Navigation */}
                <div className="border-b border-border">
                  <nav className="flex space-x-8">
                    {[
                      { key: 'site', label: 'Umum', href: '/cpanel/settings/configuration/site' },
                      { key: 'email', label: 'Email', href: '/cpanel/settings/configuration/email' },
                      { key: 'seo', label: 'SEO', href: '/cpanel/settings/configuration/seo' },
                      // { key: 'system', label: 'Sistem', href: '/cpanel/settings/configuration/system' },
                      // { key: 'payment', label: 'Pembayaran', href: '/cpanel/settings/configuration/payment' },
                      // { key: 'shipping', label: 'Pengiriman', href: '/cpanel/settings/configuration/shipping' },
                      { key: 'view_homepage', label: 'Tampilan', href: '/cpanel/settings/configuration/view_homepage' },
                      { key: 'other', label: 'Lainnya', href: '/cpanel/settings/configuration/other' },
                    ].map((tab) => (
                      <Link
                        key={tab.key}
                        href={tab.href}
                        className={cn(
                          'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                          currentGroup === tab.key
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        )}
                      >
                        {tab.label}
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* Search Bar */}
                <div className="flex items-center space-x-4 mb-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Cari konfigurasi..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Group</TableHead>
                    <TableHead>Label</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Nilai</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConfigurations.map((config) => (
                    <TableRow key={config.id}>
                      <TableCell className='text-xs'>{getGroupTitle(config.group)}</TableCell>
                      <TableCell className="font-medium">
                        {config.label}
                        <br />
                        <small className='text-slate-400'>{config.description}</small>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                          {config.key}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{config.type}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {config.value}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditModal(config)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(config.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredConfigurations.length === 0 && (
                <div className="text-center py-8">
                  <Settings className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">Tidak ada konfigurasi</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Mulai dengan membuat konfigurasi baru.
                  </p>
                  <div className="mt-6">
                    <Button onClick={() => setIsAddModalOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Konfigurasi
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add Configuration Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tambah Konfigurasi Baru</DialogTitle>
              <DialogDescription>
                Tambah konfigurasi baru untuk situs
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddConfig}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="label">Label</Label>
                    <Input
                      id="label"
                      value={addForm.data.label}
                      onChange={(e) => addForm.setData('label', e.target.value)}
                      placeholder="Nama konfigurasi"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="key">Key</Label>
                    <Input
                      id="key"
                      value={addForm.data.key}
                      onChange={(e) => addForm.setData('key', e.target.value)}
                      placeholder="key_konfigurasi"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={addForm.data.description}
                    onChange={(e) => addForm.setData('description', e.target.value)}
                    placeholder="Deskripsi konfigurasi"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="value">Nilai</Label>
                  <Input
                    id="value"
                    value={addForm.data.value}
                    onChange={(e) => addForm.setData('value', e.target.value)}
                    placeholder="Nilai konfigurasi"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Tipe</Label>
                  <Select value={addForm.data.type} onValueChange={(value) => addForm.setData('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="select">Select</SelectItem>
                      <SelectItem value="checkbox">Checkbox</SelectItem>
                      <SelectItem value="radio">Radio</SelectItem>
                      <SelectItem value="file">File</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="textarea">Textarea</SelectItem>
                      <SelectItem value="wysiwyg">WYSIWYG</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Batal
                </Button>
                {/* <Button type="submit" disabled={addForm.processing}>
                  {addForm.processing ? 'Menyimpan...' : 'Tambah Konfigurasi'}
                </Button> */}
                <Button
                  type="submit"
                  disabled={addForm.processing}
                  className="min-w-[170px]"
                >
                  {addForm.processing ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Menyimpan...
                    </span>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Konfigurasi
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Configuration Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Edit Konfigurasi</DialogTitle>
              <DialogDescription>
                Edit konfigurasi {editingConfig?.label}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditConfig}>
              <div className="grid gap-4 py-4 text-wrap max-w-full">
                <div className="space-y-2">
                  <Label>Label</Label>
                  <Input value={editingConfig?.label || ''} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Key</Label>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded block">
                    {editingConfig?.key}
                  </code>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-value">Nilai</Label>
                  {renderEditInput()}
                </div>
                {editingConfig?.description && (
                  <p className="text-sm text-gray-500 w-96 text-wrap">{editingConfig.description}</p>
                )}
                <div>
                  <Badge variant="outline">{editingConfig?.type}</Badge>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Batal
                </Button>
                {/* <Button type="submit" disabled={editForm.processing}>
                  {editForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button> */}
                <Button
                  type="submit"
                  disabled={editForm.processing}
                  className="min-w-[170px]"
                >
                  {editForm.processing ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Menyimpan...
                    </span>
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      Simpan Perubahan
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </SettingsLayout>
    </AppLayout>
  );
}
