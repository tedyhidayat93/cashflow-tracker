import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

const statusLabels = {
  pending: 'Pesanan Baru',
  confirmed: 'Dikonfirmasi',
  processing: 'Diproses',
  shipped: 'Dikirim',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
};

const statusDescriptions = {
  pending: 'Customer input pesanan baru dari halaman katalog yang belum dikonfirmasi, menunggu proses verifikasi dari admin.',
  confirmed: 'Pesanan telah dikonfirmasi dan siap untuk diproses ke tahap selanjutnya.',
  processing: 'Pesanan sedang dalam proses persiapan dan pengemasan produk.',
  shipped: 'Pesanan telah dikirim dan dalam perjalanan ke alamat pelanggan.',
  completed: 'Pesanan telah diterima oleh pelanggan dan proses selesai.',
  cancelled: 'Pesanan dibatalkan karena alasan tertentu.',
};

interface OrderStatusInfoModalProps {
  className?: string;
}

export default function OrderStatusInfoModal({ className }: OrderStatusInfoModalProps = {}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={`gap-2 ${className}`}>
          <Info className="h-4 w-4" />
          Info Status
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90%]">
        <DialogHeader>
          <DialogTitle>Alur Proses Status Pesanan</DialogTitle>
        </DialogHeader>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="text-sm font-bold text-orange-600">
            Pesanan Baru → Dikonfirmasi → Diproses → Dikirim → Selesai
          </div>
        </div>
          <p className="text-xs text-slate-800">
            Detail penjelasan lengkap mengenai setiap status pesanan dalam sistem:
          </p>
        <div className="space-y-4 overflow-y-auto max-h-96">
          <div className="space-y-3">
            {Object.entries(statusLabels).map(([status, label]) => (
              <div key={status} className="border rounded-lg p-3">
                <div className="font-semibold text-xs mb-1">{label}</div>
                <div className="text-xs text-muted-foreground">
                  {statusDescriptions[status as keyof typeof statusDescriptions]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
