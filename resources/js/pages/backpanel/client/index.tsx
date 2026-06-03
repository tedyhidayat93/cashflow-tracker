import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination } from '@/components/ui/pagination-custom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import HeaderTitle from '@/components/header-title';
import { type BreadcrumbItem } from '@/types';
import { formatDate } from '@/lib/utils';
import { 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Search, 
  Filter,
  ToggleLeft,
  ToggleRight,
  Globe,
  Phone,
  Mail,
  MapPin,
  User,
  Image as ImageIcon,
  Eye
} from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { handleImageError } from '@/utils/image';

interface Client {
  id: number;
  name: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  pic?: string;
  image?: string;
  is_active: boolean;
  sequence: number;
  created_at: string;
  updated_at: string;
}

interface PaginatedClients {
  data: Client[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface Props {
  clients: PaginatedClients;
  filters: {
    search?: string;
    active?: string;
  };
}

export default function ClientIndex({ clients, filters }: Props) {

  const [search, setSearch] = React.useState(filters.search || '');
  const [activeFilter, setActiveFilter] = React.useState(filters.active || 'all');

  const handleSearch = (value: string) => {
    setSearch(value);
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    router.get(`/cpanel/cms/client?${params.toString()}`, {}, { preserveState: true });
  };

  const handleActiveFilter = (value: string) => {
    setActiveFilter(value);
    const params = new URLSearchParams(window.location.search);
    if (value !== 'all') {
      params.set('active', value);
    } else {
      params.delete('active');
    }
    router.get(`/cpanel/cms/client?${params.toString()}`, {}, { preserveState: true });
  };

  const handleToggleStatus = (id: number) => {
    router.patch(`/cpanel/cms/client/${id}/toggle-status`);
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus klien ini?')) {
      router.delete(`/cpanel/cms/client/${id}`);
    }
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'CMS',
      href: '/cpanel/cms',
    },
    {
      title: 'Clients',
      href: '/cpanel/cms/client',
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Data Klien" />
        <div className="space-y-6 p-6">
            <HeaderTitle
                title="Data Klien"
                description="Data klien yang tersedia di website"
            >
                <Link href="/cpanel/cms/client/create">
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Klien
                </Button>
                </Link>
            </HeaderTitle>

            <Card>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end mb-4">
                        {/* Search */}
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-xs font-medium text-gray-600">
                            Cari
                            </label>

                            <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />

                            <Input
                                placeholder="Cari client..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="pl-10"
                            />
                            </div>
                        </div>

                        {/* Status */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-600">
                            Status
                            </label>

                            <Select
                            value={activeFilter}
                            onValueChange={handleActiveFilter}
                            >
                            <SelectTrigger className="w-full">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="true">Aktif</SelectItem>
                                <SelectItem value="false">Tidak Aktif</SelectItem>
                            </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Gambar</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>Kontak</TableHead>
                            <TableHead>PIC</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Dibuat</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {clients.data.map((client) => (
                            <TableRow key={client.id}>
                            <TableCell>
                                {client.image ? (
                                <img
                                    src={`/storage/${client.image}`}
                                    alt={client.name}
                                    onError={handleImageError}
                                    className="h-12 w-12 object-cover rounded-md"
                                />
                                ) : (
                                <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center">
                                    <ImageIcon className="h-6 w-6 text-gray-400" />
                                </div>
                                )}
                            </TableCell>
                            <TableCell>
                                <div>
                                <div className="font-medium">
                                    <Link 
                                        href={`/cpanel/cms/client/${client.id}`}
                                        className="hover:text-blue-600"
                                    >
                                        {client.name}
                                    </Link>
                                </div>
                                {client.website && (
                                    <div className="text-sm text-gray-500 flex items-center">
                                    <Globe className="h-3 w-3 mr-1" />
                                    <a 
                                        href={client.website} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="hover:text-blue-600"
                                    >
                                        {client.website}
                                    </a>
                                    </div>
                                )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="space-y-1">
                                {client.email && (
                                    <div className="text-sm text-gray-600 flex items-center">
                                    <Mail className="h-3 w-3 mr-1" />
                                    {client.email}
                                    </div>
                                )}
                                {client.phone && (
                                    <div className="text-sm text-gray-600 flex items-center">
                                    <Phone className="h-3 w-3 mr-1" />
                                    {client.phone}
                                    </div>
                                )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="text-sm text-gray-600">
                                {client.pic || '-'}
                                </div>
                            </TableCell>
                            <TableCell>
                                {client.is_active ? (
                                <Badge variant="default" className="bg-green-100 text-green-800">Aktif</Badge>
                                ) : (
                                <Badge variant="secondary">Tidak Aktif</Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="text-sm text-gray-600">
                                {formatDate(client.created_at)}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                    <Link href={`/cpanel/cms/client/${client.id}`}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        View
                                    </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                    <Link href={`/cpanel/cms/client/edit/${client.id}`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                    onClick={() => handleDelete(client.id)}
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

                    {clients.data.length === 0 && (
                        <div className="text-center py-8">
                            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-semibold text-gray-900">Tidak ada klien</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Mulai dengan membuat klien baru.
                            </p>
                            <div className="mt-6">
                                <Link href="/cpanel/cms/client/create">
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah Klien
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    </AppLayout>
  );
}
