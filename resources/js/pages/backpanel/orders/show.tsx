import React from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import HeaderTitle from '@/components/header-title';
import { type BreadcrumbItem } from '@/types';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Package, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  Hash,
  DollarSign,
  FileText,
  Clock,
  Eye,
  Loader,
  Save,
  RefreshCw
} from 'lucide-react';
import OrderStatusInfoModal from '@/components/order-status-info-modal';
import { getOrderStatusBadgeProps, OrderStatusBadge } from '@/utils/order-status';
import { formatCurrencyDisplay } from '@/utils/currency';
import { handleImageError } from '@/utils/image';
import ResendOrderEmailDialog from '@/components/resend-email';

interface Order {
  id: number;
  order_number: string;
  company_name: string;
  pic_name: string;
  phone: string;
  email?: string;
  address: string;
  province: string;
  regency: string;
  district: string;
  village: string;
  postal_code: string;
  notes?: string;
  product_id: number;
  product_name: string;
  product_category: string;
  product_image: string;
  product_price: number;
  quantity: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  admin_notes?: string;
  status_history?: Array<{
    created_by: number | null;
    username: string;
    note: string;
    status: string;
    created_at: string;
    formatted_date?: string;
  }>;
  created_at: string;
  updated_at: string;
  status_label: string;
  status_color: string;
  product?: {
    id: number;
    name: string;
    coverImage?: {
      image_path: string;
    };
  };
}

interface Props {
  order: Order;
}

export default function OrderShow({ order }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'CRM',
      href: '/cpanel/crm',
    },
    {
      title: 'Daftar Pesanan',
      href: '/cpanel/crm/orders',
    },
    {
      title: 'Detail',
      href: `/cpanel/crm/orders/${order.id}`,
    },
  ];

  const { data, setData, patch, processing } = useForm({
    status: order.status as 'pending' | 'confirmed' | 'processing' | 'shipped' | 'completed' | 'cancelled',
    admin_notes: order.admin_notes || '',
  });

  const handleStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    patch(`/cpanel/crm/orders/${order.id}/status`, {
      preserveScroll: true,
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Detail Pesanan ${order.order_number}`} />

      <div className="space-y-6 p-6 mx-auto w-full">
        {/* Top Bar / Action Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border shadow-sm">
          <div className="flex items-center gap-4">
            <Link href="/cpanel/crm/orders">
              <Button variant="outline" size="sm" className="h-9">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <HeaderTitle
              title={`Detail Pesanan ${order.order_number}`} 
              description="Informasi lengkap pesanan pelanggan"
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <ResendOrderEmailDialog orderId={order.id} />
            <OrderStatusInfoModal />
            {/* <Link href={`/cpanel/crm/orders/edit/${order.id}`}>
              <Button variant="outline" size="sm" className="h-9">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link> */}
            <Button
              variant="outline"
              className='hover:text-white hover:bg-red-600 border-red-500 text-red-500'
              size="sm"
              onClick={() => {
                if (confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) {
                  router.delete(`/cpanel/crm/orders/${order.id}`);
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
              Hapus
            </Button>
          </div>
        </div>

        {/* Main Content Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LEFT SIDE: Order Details */}
          <div className="lg:col-span-2 space-y-6">

            {/* Order Summary & Product Info Combined / Grouped */}
            <Card className="p-0 overflow-hidden shadow-sm">
              <CardHeader className="pb-2! pt-4 border-b bg-slate-800 dark:bg-slate-800/50 ">
                <CardTitle className="flex items-center gap-2 text-white font-semibold">
                  <Hash className="h-5 w-5 text-muted-foreground" />
                  Detail & Ringkasan Pesanan
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-5 space-y-6">
                
                {/* Meta Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nomor Pesanan</span>
                    <div className="font-mono font-bold text-lg mt-0.5 tracking-tight">{order.order_number}</div>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status Saat Ini</span>
                    <div className="mt-1">
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Pembayaran</span>
                    <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {formatCurrencyDisplay(order.total_price)}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Product Card Inside */}
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-dashed flex flex-col sm:flex-row gap-4">
                  <div className="flex-shrink-0 mx-auto sm:mx-0">
                    <img 
                      src={order.product_image ? `/storage/${order.product_image}` : order.product?.coverImage?.image_path || '/images/placeholder.png'} 
                      alt={order.product_name}
                      onError={handleImageError}
                      className="h-24 w-24 object-cover rounded-lg border bg-white shadow-sm"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-base text-slate-900 dark:text-slate-100">{order.product_name}</h4>
                          <p className="text-xs text-muted-foreground font-medium mt-0.5">{order.product_category}</p>
                        </div>
                        {order.product_id && (
                          <Link 
                            href={`/cpanel/cms/product/${order.product_id}`}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400 transition-colors border border-blue-100 dark:border-blue-900"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Lihat Produk
                          </Link>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs border-t pt-2 border-slate-200/60 dark:border-slate-700/60">
                      <div>
                        <span className="text-muted-foreground block">Harga Satuan</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{formatCurrencyDisplay(order.product_price)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Kuantitas</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{order.quantity}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Subtotal</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">{formatCurrencyDisplay(order.total_price)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dates Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-muted-foreground bg-slate-200/60 dark:bg-slate-800/20 p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>Dibuat: <b>{new Date(order.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</b></span>
                  </div>
                  <div className="flex items-center gap-2 sm:border-l sm:pl-4">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>Diperbarui: <b>{new Date(order.updated_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</b></span>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card className="p-0 shadow-sm overflow-hidden">
              <CardHeader className="pb-2! pt-4 border-b bg-slate-800 dark:bg-slate-800/50 ">
                <CardTitle className="flex items-center gap-2 text-white font-semibold">
                  <User className="h-5 w-5 text-muted-foreground" />
                  Informasi Pelanggan
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50/60 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-muted-foreground block mb-0.5">Perusahaan / Instansi</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{order.company_name}</span>
                  </div>
                  <div className="p-3 bg-slate-50/60 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-muted-foreground block mb-0.5">Nama PIC</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{order.pic_name}</span>
                  </div>
                  <div className="p-3 bg-slate-50/60 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-muted-foreground block mb-1">Telepon / WhatsApp</span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-800 dark:text-slate-200">
                      <Phone className="h-3.5 w-3.5 text-emerald-500" />
                      {order.phone}
                    </span>
                  </div>
                  {order.email && (
                    <div className="p-3 bg-slate-50/60 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="text-xs text-muted-foreground block mb-1">Email Kantor</span>
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-800 dark:text-slate-200">
                        <Mail className="h-3.5 w-3.5 text-blue-500" />
                        {order.email}
                      </span>
                    </div>
                  )}
                </div>

                {/* Notes Section */}
                {(order.notes || order.admin_notes) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {order.notes && (
                      <div className="space-y-1.5">
                        <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 block">Catatan dari Pelanggan:</span>
                        <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/60 p-3 rounded-lg text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          {order.notes}
                        </div>
                      </div>
                    )}
                    {order.admin_notes && (
                      <div className="space-y-1.5">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Catatan Internal Terakhir Admin:</span>
                        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-sm text-slate-600 dark:text-slate-400 border italic">
                          "{order.admin_notes}"
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDE: Actions & Timeline History */}
          <div className="space-y-6">

            {/* Status Update Form Card */}
            <Card className="p-0 border-2 border-orange-100 dark:border-orange-950/40 shadow-md">
              <CardHeader className="pb-2! pt-4 bg-orange-50/40 dark:bg-orange-950/10 border-b border-orange-100 dark:border-orange-950/40">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-orange-800 dark:text-orange-400">
                  <RefreshCw className="h-4 w-4 animate-spin-slow" />
                  Update Status Pesanan
                </CardTitle>
                <CardDescription className="text-xs text-orange-700/70 dark:text-orange-400/70">
                  Perbarui status dan tambahkan catatan log aktivitas internal.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-5">
                <form onSubmit={handleStatusUpdate} className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Status Pesanan
                      </label>
                      <select
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value as any)}
                        className="w-full rounded-lg border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm text-sm p-2.5 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      >
                        <option value="pending">⏳ Pesanan Baru (Pending)</option>
                        <option value="confirmed">✅ Dikonfirmasi</option>
                        <option value="processing">⚙️ Diproses</option>
                        <option value="shipped">🚚 Dikirim</option>
                        <option value="completed">🎉 Selesai</option>
                        <option value="cancelled">❌ Dibatalkan</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Catatan Aktivitas Admin
                      </label>
                      <textarea
                        value={data.admin_notes}
                        onChange={(e) => setData('admin_notes', e.target.value)}
                        placeholder="Contoh: Pembayaran DP 50% sudah diterima / Resi pengiriman JNE..."
                        rows={3}
                        className="w-full text-sm rounded-lg border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm p-2.5 focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/60"
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={processing} className="w-full flex items-center justify-center gap-2 h-10 shadow-sm">
                    {processing ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Simpan Perubahan</span>
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Status History - Elegant Timeline */}
            <Card className="p-0 shadow-sm">
              <CardHeader className="pb-2! pt-4  border-b">
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Riwayat
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-5 max-h-[420px] overflow-y-auto scrollbar-thin">
                {order.status_history && order.status_history.length > 0 ? (
                  <div className="relative pl-4 border-l-2 border-slate-200 dark:border-slate-800 ml-2 space-y-5">
                    {order.status_history.map((history, index) => (
                      <div key={index} className="relative group">
                        
                        {/* Timeline Dot */}
                        <div className={`absolute -left-[25px] top-1 h-3.5 w-3.5 rounded-full border-2 bg-white dark:bg-slate-950 transition-all ${
                          index === 0 
                            ? 'border-primary ring-4 ring-primary/10 shadow-sm' 
                            : 'border-slate-300 dark:border-slate-700'
                        }`} />
                        
                        {/* Content Item */}
                        <div className="space-y-1 bg-slate-200/60 dark:bg-slate-800/30 p-2.5 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <OrderStatusBadge status={history.status as any} />
                              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                by {history.username}
                              </span>
                            </div>
                            <time className="text-[10px] font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap">
                              {history.formatted_date || new Date(history.created_at).toLocaleString('id-ID')}
                            </time>
                          </div>

                          {history.note && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 italic pl-2 border-l border-slate-300 dark:border-slate-700 mt-1.5 line-clamp-3 group-hover:line-clamp-none transition-all">
                              "{history.note}"
                            </p>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Belum ada log riwayat aktivitas pesanan ini.</p>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
