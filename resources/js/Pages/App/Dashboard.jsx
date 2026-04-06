import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    // Stats disederhanakan untuk konteks budgeting personal
    const stats = [
        { name: 'Sisa Saldo', value: 'Rp 12.500.000', color: 'text-[#1B3022] dark:text-[#F4F4E8]', bg: 'bg-[#E8E8D5]', border: 'border-[#C5C5B0]' },
        { name: 'Total Pemasukan', value: 'Rp 4.200.000', color: 'text-[#2D5A27] dark:text-[#85BB65]', bg: 'bg-[#D8E6D1]', border: 'border-[#B8CBB0]' },
        { name: 'Total Pengeluaran', value: 'Rp 1.150.000', color: 'text-[#8B2E2E] dark:text-red-400', bg: 'bg-[#F9E6E6]', border: 'border-[#EACACA]' },
    ];

    const transactions = [
        { id: 1, desc: 'Kopi Kenangan', cat: 'Konsumsi', amount: '- Rp 25.000', date: 'Hari ini', icon: '☕' },
        { id: 2, desc: 'Gaji Bulanan', cat: 'Pemasukan', amount: '+ Rp 4.000.000', date: 'Kemarin', icon: '💵' },
        { id: 3, desc: 'Listrik & Air', cat: 'Tagihan', amount: '- Rp 450.000', date: '2 hari lalu', icon: '⚡' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col">
                    <h2 className="text-xl font-black leading-tight text-[#1B3022] dark:text-[#F4F4E8] uppercase tracking-tight">
                        Ringkasan <span className="text-[#2D5A27]">Anggaran</span>
                    </h2>
                    <p className="text-[10px] font-bold text-[#4A5D50]/60 dark:text-[#85BB65]/40 uppercase tracking-[0.3em]">
                        Personal Finance Tracker
                    </p>
                </div>
            }
        >
            <Head title="Dashboard - Dollar Edition" />

            <div className="bg-[#F4F4E8] dark:bg-[#0D1A12] min-h-screen font-sans">
                <div className="mx-auto max-w-7xl space-y-6">
                    
                    {/* Stats Cards: Ringkasan Cepat */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.map((stat) => (
                            <div key={stat.name} className={`overflow-hidden ${stat.bg} dark:bg-[#1B3022]/40 shadow-sm sm:rounded-3xl border ${stat.border} dark:border-[#2D5A27]/30 transition-all hover:shadow-md`}>
                                <div className="p-6">
                                    <p className="text-[10px] font-black text-[#4A5D50] dark:text-[#85BB65]/60 uppercase tracking-[0.2em]">
                                        {stat.name}
                                    </p>
                                    <p className={`mt-2 text-3xl font-black tracking-tighter ${stat.color}`}>
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Transaction List: Ledger Style */}
                        <div className="lg:col-span-2 overflow-hidden bg-white/80 dark:bg-[#0D1A12]/80 backdrop-blur-md shadow-xl sm:rounded-3xl border border-[#D1D1C2] dark:border-[#1B3022]">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-lg font-black text-[#1B3022] dark:text-[#F4F4E8] uppercase tracking-tight">Catatan Transaksi</h3>
                                    <button className="text-[10px] font-black text-[#2D5A27] dark:text-[#85BB65] hover:underline uppercase tracking-widest">Semua Riwayat</button>
                                </div>
                                
                                <div className="space-y-3">
                                    {transactions.map((trx) => (
                                        <div key={trx.id} className="flex items-center justify-between p-4 rounded-2xl border border-[#F4F4E8] dark:border-[#1B3022] bg-[#FDFDF7] dark:bg-[#15261C]/50 hover:border-[#C5C5B0] dark:hover:border-[#2D5A27] transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-[#E8E8D5] dark:bg-[#1B3022] flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                                                    {trx.icon}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#1B3022] dark:text-white leading-none">{trx.desc}</p>
                                                    <p className="text-[10px] font-bold text-[#4A5D50]/60 dark:text-[#85BB65]/40 uppercase tracking-widest mt-1">
                                                        {trx.cat} • {trx.date}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className={`font-black tracking-tighter ${trx.amount.includes('+') ? 'text-[#2D5A27] dark:text-[#85BB65]' : 'text-[#8B2E2E] dark:text-red-400'}`}>
                                                {trx.amount}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Side Actions: Budgeting Tools */}
                        <div className="space-y-6">
                            <div className="overflow-hidden bg-[#1B3022] dark:bg-[#2D5A27] shadow-2xl sm:rounded-3xl border border-[#2D5A27]">
                                <div className="p-6 text-center">
                                    <h3 className="text-sm font-black text-[#85BB65] uppercase tracking-[0.2em] mb-6 text-left">Manajemen Dana</h3>
                                    <div className="space-y-3">
                                        <button className="w-full py-4 bg-[#85BB65] text-[#1B3022] rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-[#85BB65]/20 hover:bg-[#F4F4E8] transition-all active:scale-95">
                                            + Catat Baru
                                        </button>
                                        <button className="w-full py-4 bg-transparent text-[#F4F4E8] border border-[#2D5A27] rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#2D5A27] transition-all">
                                            Unduh Laporan bulanan
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Info Box: Tips Hemat */}
                            <div className="p-6 bg-[#E8E8D5]/50 dark:bg-[#1B3022]/40 rounded-3xl border border-[#C5C5B0] dark:border-[#2D5A27]/30">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="flex h-2 w-2 rounded-full bg-[#2D5A27] animate-pulse"></span>
                                    <p className="text-[10px] font-black text-[#2D5A27] dark:text-[#85BB65] uppercase tracking-widest">Wawasan Anggaran</p>
                                </div>
                                <p className="text-sm text-[#4A5D50] dark:text-[#D1D9D0] leading-relaxed italic">
                                    "Kamu sudah menghabiskan <span className="font-bold text-[#1B3022] dark:text-white">Rp 25.000</span> untuk kopi hari ini. Tetap semangat menabung!"
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}