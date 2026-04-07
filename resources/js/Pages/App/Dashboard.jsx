import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Calendar, ChevronDown, ChevronUp, Dot, Sparkles, Tag, TrendingUp, User2, Wallet } from 'lucide-react';
import Chart from 'react-apexcharts';


export default function Dashboard() {
    const [isOpen, setIsOpen] = useState(false);

    // 1. Data Source: Wallets
    const wallets = [
        { id: 1, name: 'Bank Central', balance: 'Rp 8.500.000', lastIn: 'Rp 2.000.000', lastOut: 'Rp 150.000', color: 'bg-[#1B3022]' },
        { id: 2, name: 'E-Wallet Dana', balance: 'Rp 4.000.000', lastIn: 'Rp 500.000', lastOut: 'Rp 25.000', color: 'bg-[#2D5A27]' },
        { id: 3, name: 'Bank BRI', balance: 'Rp 2.000.000', lastIn: 'Rp 1.000.000', lastOut: 'Rp 50.000', color: 'bg-[#1B3022]' },
        { id: 4, name: 'E-Wallet OVO', balance: 'Rp 1.000.000', lastIn: 'Rp 500.000', lastOut: 'Rp 25.000', color: 'bg-[#2D5A27]' },
    ];

    // 2. Logic: Konsolidasi Data (Menghitung total dari semua dompet)
    const parseCurrency = (val) => parseInt(val.replace(/[^0-9]/g, '')) || 0;
    
    const totalSaldoAll = wallets.reduce((acc, w) => acc + parseCurrency(w.balance), 0);
    const totalMasukAll = wallets.reduce((acc, w) => acc + parseCurrency(w.lastIn), 0);
    const totalKeluarAll = wallets.reduce((acc, w) => acc + parseCurrency(w.lastOut), 0);

    const formatIDR = (val) => new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(val);

    // 3. Stats Data (Ringkasan Konsolidasi)
    const stats = [
        { 
            name: 'Total Saldo Global', 
            value: formatIDR(totalSaldoAll), 
            color: 'text-[#1B3022] dark:text-[#F4F4E8]', 
            bg: 'bg-[#E8E8D5]', 
            border: 'border-[#C5C5B0]' 
        },
        { 
            name: 'Total Uang Masuk', 
            value: formatIDR(totalMasukAll), 
            color: 'text-[#2D5A27] dark:text-[#85BB65]', 
            bg: 'bg-[#D8E6D1]', 
            border: 'border-[#B8CBB0]' 
        },
        { 
            name: 'Total Uang Keluar', 
            value: formatIDR(totalKeluarAll), 
            color: 'text-[#8B2E2E] dark:text-red-400', 
            bg: 'bg-[#F9E6E6]', 
            border: 'border-[#EACACA]' 
        },
    ];

    const transactions = [
        { id: 1, description: 'Kopi Kenangan', category: 'Konsumsi', amount: '25.000', date: '07 Apr 2026', wallet: 'Bank Jago', type: 'keluar', userName: 'Admin Utama' },
        { id: 2, description: 'Gaji Bulanan', category: 'Pemasukan', amount: '4.500.000', date: '06 Apr 2026', wallet: 'BCA Syariah', type: 'masuk', userName: 'Sistem' },
        { id: 3, description: 'Listrik & Air', category: 'Tagihan', amount: '450.000', date: '05 Apr 2026', wallet: 'E-Wallet (Dana)', type: 'keluar', userName: 'Admin Utama' },
        { id: 4, description: 'Freelance Design', category: 'Pemasukan', amount: '1.200.000', date: '07 Apr 2026', wallet: 'Bank Jago', type: 'masuk', userName: 'Sistem' },
        { id: 5, description: 'Bensin Pertamax', category: 'Transportasi', amount: '150.000', date: '07 Apr 2026', wallet: 'BCA Syariah', type: 'keluar', userName: 'Admin Utama' },
        { id: 6, description: 'Belanja Mingguan', category: 'Konsumsi', amount: '650.000', date: '04 Apr 2026', wallet: 'E-Wallet (Dana)', type: 'keluar', userName: 'Admin Utama' },
        { id: 7, description: 'Netflix Premium', category: 'Hiburan', amount: '186.000', date: '03 Apr 2026', wallet: 'Bank Jago', type: 'keluar', userName: 'Sistem' },
        { id: 8, description: 'Bonus Proyek', category: 'Pemasukan', amount: '2.000.000', date: '02 Apr 2026', wallet: 'BCA Syariah', type: 'masuk', userName: 'Sistem' },
        { id: 9, description: 'Makan Malam Sushi', category: 'Konsumsi', amount: '320.000', date: '07 Apr 2026', wallet: 'BCA Syariah', type: 'keluar', userName: 'Admin Utama' },
        { id: 10, description: 'Token Listrik Kantor', category: 'Tagihan', amount: '200.000', date: '06 Apr 2026', wallet: 'E-Wallet (Dana)', type: 'keluar', userName: 'Admin Utama' },
        { id: 11, description: 'Parkir Mall', category: 'Transportasi', amount: '15.000', date: '06 Apr 2026', wallet: 'Bank Jago', type: 'keluar', userName: 'Admin Utama' },
        { id: 12, description: 'Dividen Saham', category: 'Pemasukan', amount: '850.000', date: '01 Apr 2026', wallet: 'BCA Syariah', type: 'masuk', userName: 'Sistem' },
        { id: 13, description: 'Gym Membership', category: 'Kesehatan', amount: '400.000', date: '05 Apr 2026', wallet: 'Bank Jago', type: 'keluar', userName: 'Admin Utama' },
        { id: 14, description: 'Laundry Ekspres', category: 'Layanan', amount: '45.000', date: '04 Apr 2026', wallet: 'E-Wallet (Dana)', type: 'keluar', userName: 'Admin Utama' },
        { id: 15, description: 'Top Up Game', category: 'Hiburan', amount: '100.000', date: '03 Apr 2026', wallet: 'E-Wallet (Dana)', type: 'keluar', userName: 'Admin Utama' },
        { id: 16, description: 'Cashback Belanja', category: 'Pemasukan', amount: '50.000', date: '02 Apr 2026', wallet: 'Bank Jago', type: 'masuk', userName: 'Sistem' },
        { id: 17, description: 'Obat Apotek', category: 'Kesehatan', amount: '125.000', date: '01 Apr 2026', wallet: 'BCA Syariah', type: 'keluar', userName: 'Admin Utama' },
        { id: 18, description: 'Iuran Sampah', category: 'Tagihan', amount: '35.000', date: '07 Apr 2026', wallet: 'Bank Jago', type: 'keluar', userName: 'Admin Utama' },
        { id: 19, description: 'Gofood Siang', category: 'Konsumsi', amount: '85.000', date: '05 Apr 2026', wallet: 'E-Wallet (Dana)', type: 'keluar', userName: 'Admin Utama' },
        { id: 20, description: 'Bunga Bank', category: 'Pemasukan', amount: '12.000', date: '01 Apr 2026', wallet: 'BCA Syariah', type: 'masuk', userName: 'Sistem' },
    ];
   // --- LOGIKA PEMROSESAN DATA UNTUK CHART ---

    // 1. Data untuk Line Chart (Mengelompokkan Pemasukan & Pengeluaran per 12 Bulan)
    // Generate 12 months data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    // Sample data for 12 months - in real app, this would come from database
    const monthlyData = [
        { month: 'Jan 2026', masuk: 8000000, keluar: 3500000 },
        { month: 'Feb 2026', masuk: 7500000, keluar: 4200000 },
        { month: 'Mar 2026', masuk: 9200000, keluar: 3800000 },
        { month: 'Apr 2026', masuk: 8500000, keluar: 4500000 },
        { month: 'May 2026', masuk: 7800000, keluar: 3900000 },
        { month: 'Jun 2026', masuk: 8200000, keluar: 4100000 },
        { month: 'Jul 2026', masuk: 8800000, keluar: 4300000 },
        { month: 'Aug 2026', masuk: 9500000, keluar: 4600000 },
        { month: 'Sep 2026', masuk: 8700000, keluar: 4000000 },
        { month: 'Oct 2026', masuk: 9000000, keluar: 4400000 },
        { month: 'Nov 2026', masuk: 8300000, keluar: 4200000 },
        { month: 'Dec 2026', masuk: 9800000, keluar: 4800000 }
    ];

    // --- 1. PEMROSESAN DATA (LOGIKA) ---

    // Data untuk Pie Chart Saldo
    const walletPieData = wallets.map(w => ({
        name: w.name,
        value: parseCurrency(w.balance)
    }));

    // Data Agregat Pengeluaran per Kategori (Hanya tipe 'keluar')
    // Digunakan bersama untuk Pie Chart dan Horizontal Bar Chart agar tidak redundan
    const categoryExpenseData = [...new Set(
        transactions.filter(t => t.type === 'keluar').map(t => t.category)
    )].map(cat => {
        const total = transactions
            .filter(t => t.category === cat && t.type === 'keluar')
            .reduce((acc, curr) => acc + parseCurrency(curr.amount), 0);
        return { name: cat, total: total };
    }).sort((a, b) => b.total - a.total);

    // --- 2. KONFIGURASI APEXCHARTS ---

    // Line Chart (Arus Kas Bulanan)
    const lineOptions = {
        chart: { type: 'line', toolbar: { show: false }, zoom: { enabled: false }, fontFamily: 'inherit' },
        colors: ['#2D5A27', '#8B2E2E'],
        stroke: { width: 4, curve: 'smooth' },
        xaxis: {
            categories: monthlyData.map(d => d.month),
            labels: { style: { colors: '#4A5D50', fontWeight: 600 } },
        },
        yaxis: {
            labels: { 
                style: { colors: '#4A5D50', fontWeight: 600 },
                formatter: (val) => `Rp ${val.toLocaleString('id-ID')}`
            }
        },
        legend: { position: 'top', fontWeight: 900 },
        tooltip: { y: { formatter: (val) => formatIDR(val) } }
    };

    const lineSeries = [
        { name: 'Pemasukan', data: monthlyData.map(d => d.masuk) },
        { name: 'Pengeluaran', data: monthlyData.map(d => d.keluar) }
    ];

    // Horizontal Bar Chart (Ranking Pengeluaran)
   const categoryBarOptions = {
        chart: { 
            type: 'bar', 
            toolbar: { show: false }, 
            fontFamily: 'inherit' 
        },
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: '70%',
                borderRadius: 6,
                distributed: true, // WAJIB: agar tiap bar bisa punya warna berbeda
                dataLabels: { position: 'top' },
            }
        },
        // Menggunakan colors sebagai array untuk membuat gradasi manual 
        // atau biarkan plotOptions menangani ranges. 
        // Di sini kita buat manual berdasarkan urutan data (karena data sudah kita sort DESC):
        colors: categoryExpenseData.map((_, index) => {
            // Semakin kecil index (data terbesar), semakin gelap merahnya
            const opacities = [1, 0.85, 0.7, 0.55, 0.4, 0.25]; 
            const opacity = opacities[index] || 0.2;
            return `rgba(159, 0, 0, ${opacity})`;
        }),
        dataLabels: {
            enabled: true,
            offsetX: 45,
            style: { fontSize: '12px', fontWeight: 900, colors: ['#4A5D50'] },
            formatter: (val) => `Rp ${val.toLocaleString('id-ID')}`
        },
        xaxis: {
            categories: categoryExpenseData.map(c => c.name),
            labels: { show: false },
            axisBorder: { show: false }
        },
        yaxis: { 
            labels: { 
                style: { 
                    colors: '#8B2E2E', 
                    fontWeight: 900,
                    fontSize: '11px' 
                } 
            } 
        },
        grid: { show: false },
        legend: { show: false }, // Sembunyikan legend karena distributed: true akan memunculkannya
        tooltip: { 
            theme: 'dark',
            y: { formatter: (val) => formatIDR(val) } 
        }
    };

    // Donut Chart (Saldo Dompet)
    const walletDonutOptions = {
        labels: walletPieData.map(d => d.name),
        colors: ['#2D5A27', '#1B3022', '#4A5D50', '#85BB65'],
        chart: { type: 'donut' },
        plotOptions: { pie: { donut: { size: '70%' } } },
        dataLabels: { enabled: false },
        legend: { show: true, position: 'bottom', fontSize: '10px', fontWeight: 600 },
        tooltip: { y: { formatter: (val) => formatIDR(val) } }
    };

    // Donut Chart (Kategori Pengeluaran)
    const categoryDonutOptions = {
        labels: categoryExpenseData.map(d => d.name),
        colors: ['#8B2E2E', '#D1D1C2', '#4A5D50', '#1B3022'],
        chart: { type: 'donut' },
        plotOptions: { pie: { donut: { size: '70%' } } },
        dataLabels: { enabled: false },
        legend: { show: true, position: 'bottom', fontSize: '10px', fontWeight: 600 },
        tooltip: { y: { formatter: (val) => formatIDR(val) } }
    };

    // summary AI

    const AISummaryCard = () => {
        return (
            <div className={`transition-all duration-500 ease-in-out bg-slate-100/30 dark:bg-[#0D1A12] rounded-3xl overflow-hidden ${isOpen ? 'max-h-[1000px] p-6 border-2 border-[#2D5A27]' : 'p-4 max-h-[80px] border border-[#2D5A27]/30'}`}>
                
                {/* --- HEADER (Selalu Muncul & Menjadi Trigger Toggle) --- */}
                <div 
                    className="flex items-center justify-between cursor-pointer" 
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform duration-500 ${isOpen ? 'bg-[#2D5A27] rotate-180' : 'bg-[#1B3022]'}`}>
                            <Sparkles className="text-white w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-[#2D5A27] dark:text-[#85BB65] uppercase tracking-tighter">
                                AI Financial Intelligence
                            </h3>
                            <p className="text-[10px] font-bold text-[#4A5D50]/60 uppercase tracking-widest">
                                {isOpen ? 'Detailed Analysis Active' : 'Status: Keuangan Sangat Sehat • Klik untuk Detail'}
                            </p>
                        </div>
                    </div>

                    <button className="p-2 rounded-full bg-[#2D5A27]/10 text-[#2D5A27]">
                        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                </div>

                {/* --- COLLAPSIBLE CONTENT (Detail yang Sekarang) --- */}
                <div className={`mt-8 transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Insight 1: Pengeluaran Terbesar */}
                        <div className="p-4 rounded-2xl border-2 border-[#8B2E2E]/20 bg-white/50 dark:bg-white/5">
                            <p className="text-[9px] font-black text-[#8B2E2E] uppercase tracking-widest mb-1">Puncak Pengeluaran</p>
                            <p className="text-xl font-black text-[#2D5A27] tracking-tight">Konsumsi</p>
                            <p className="text-[10px] font-bold text-[#4A5D50]/60 mt-1 leading-tight">
                                Total pengeluaran mencapai <span className="text-[#8B2E2E] font-black">{formatIDR(1080000)}</span>.
                            </p>
                        </div>

                        {/* Insight 2: Pemasukan Utama */}
                        <div className="p-4 rounded-2xl border-2 border-[#2D5A27]/20 bg-white/50 dark:bg-white/5">
                            <p className="text-[9px] font-black text-[#2D5A27] uppercase tracking-widest mb-1">Arus Kas Utama</p>
                            <p className="text-xl font-black text-[#2D5A27] tracking-tight">Gaji Bulanan</p>
                            <p className="text-[10px] font-bold text-[#4A5D50]/60 mt-1 leading-tight">
                                Menyumbang <span className="text-[#2D5A27] font-black">52%</span> dari total likuiditas Anda.
                            </p>
                        </div>

                        {/* Insight 3: Kebiasaan Belanja */}
                        <div className="p-4 rounded-2xl border-2 border-[#1B3022]/20 bg-white/50 dark:bg-white/5">
                            <p className="text-[9px] font-black text-[#1B3022] uppercase tracking-widest mb-1">Paling Sering</p>
                            <p className="text-xl font-black text-[#2D5A27] tracking-tight">Tagihan</p>
                            <p className="text-[10px] font-bold text-[#4A5D50]/60 mt-1 leading-tight">
                                Frekuensi transaksi tertinggi pada operasional harian.
                            </p>
                        </div>

                        {/* Insight 4: Kondisi Likuiditas */}
                        <div className="p-4 rounded-2xl border-2 border-[#85BB65]/20 bg-white/50 dark:bg-white/5">
                            <p className="text-[9px] font-black text-[#4A5D50] uppercase tracking-widest mb-1">Likuiditas</p>
                            <div className="flex items-center gap-2">
                                <p className="text-xl font-black text-[#2D5A27] tracking-tight">Sehat</p>
                                <TrendingUp size={16} className="text-[#2D5A27]" />
                            </div>
                            <p className="text-[10px] font-bold text-[#4A5D50]/60 mt-1 leading-tight">
                                Rasio tabungan aman di angka <span className="text-[#2D5A27] font-black">64%</span>.
                            </p>
                        </div>
                    </div>

                    {/* Narrative Summary Area */}
                    <div className="mt-8 pt-6 border-t-2 border-dashed border-[#2D5A27]/20">
                        <p className="text-xs font-bold text-[#4A5D50] leading-relaxed italic">
                            "Kondisi keuangan periode April 2026 terpantau stabil dengan dominasi saldo pada **Bank Central**. 
                            Meskipun kategori **Konsumsi** mendominasi pengeluaran, pemasukan dari **Freelance Design** menjaga neraca tetap positif. 
                            Anda memiliki cadangan dana sebesar **{formatIDR(totalSaldoAll)}** untuk alokasi investasi selanjutnya."
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col">
                    <h2 className="text-xl font-black leading-tight text-[#2D5A27] dark:text-[#F4F4E8] uppercase tracking-tight">
                        Dashboard
                    </h2>
                    <p className="text-[10px] font-bold text-[#4A5D50]/60 dark:text-[#85BB65]/40 uppercase tracking-[0.3em]">
                        Summary Finance Tracker
                    </p>
                </div>
            }
        >
            <Head title="Dashboard - Dollar Edition" />

            <div className="bg-[#F4F4E8] dark:bg-[#0D1A12] min-h-screen font-sans">
                <div className="mx-auto max-w-7xl space-y-8">

                    {/* Sumarize AI */}
                    <AISummaryCard/>

                    {/* --- STATS SECTION: KONSOLIDASI --- */}
                    <section className="grid grid-cols-3 gap-4 md:gap-6">
                        {stats.map((stat) => (
                            <div key={stat.name} className={`overflow-hidden ${stat.bg} dark:bg-[#2D5A27]/40 shadow-sm rounded-3xl border-2 ${stat.border} dark:border-[#2D5A27]/30 transition-all hover:scale-[1.02] duration-300`}>
                                <div className="p-6">
                                    <p className="text-[7px] md:text-[10px] font-black text-[#4A5D50] dark:text-[#85BB65]/60 uppercase tracking-[0.2em]">
                                        {stat.name}
                                    </p>
                                    <p className={`mt-2 text-base lg:text-3xl font-black tracking-tighter ${stat.color}`}>
                                        {stat.value}
                                    </p>
                                    <div className="mt-2 flex items-center gap-1">
                                        <span className="text-[8px] font-bold text-[#2D5A27] uppercase bg-[#2D5A27]/10 px-2 py-0.5 rounded-full">
                                            Grand Total
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>
                    

                    {/* --- WALLET SECTION --- */}
                    <section>
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="text-[11px] font-black text-[#1B3022] dark:text-[#85BB65] uppercase tracking-[0.3em]">Dompet Penyimpanan</h3>
                            <button className="text-[10px] font-bold text-[#2D5A27] hover:underline uppercase">+ Tambah Dompet</button>
                        </div>
                        
                        {/* Horizontal Scroll Container */}
                        <div className="relative">
                            {/* Scroll Indicators */}
                            {/* <div className="absolute right-0 top-0 bottom-0 w-32 pointer-events-none z-10
                                bg-gradient-to-l 
                                from-[#F4F4E8]/90   
                                via-[#F4F4E8]/30     
                                to-[#F4F4E8]/0       
                                dark:from-[#0D1A12]/95 
                                dark:via-[#0D1A12]/20 
                                dark:to-[#0D1A12]/0">
                            </div> */}

                            {/* Horizontal Scroll */}
                            <div className="overflow-x-auto overflow-y-hidden pt-4 pb-1 scrollbar-hidden">
                                <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
                                    {wallets.map((wallet) => (
                                        <div key={wallet.id} className={`${wallet.color} rounded-[2rem] p-6 text-[#F4F4E8] relative overflow-hidden group border border-[#85BB65]/20 transition-all hover:translate-y-[-4px] flex-shrink-0`} style={{ width: '310px' }}>
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#85BB65]/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-[#85BB65]/40 transition-all"></div>
                                            
                                            <div className="relative z-10 flex flex-col h-full justify-between">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#85BB65] mb-1 italic">Dompet</p>
                                                        <h4 className="text-lg font-black uppercase tracking-tight">{wallet.name}</h4>
                                                    </div>
                                                    <div className="w-10 h-6 bg-[#85BB65]/20 rounded-md border border-[#85BB65]/10 flex items-center justify-center">
                                                        <div className="w-3 h-3 bg-[#85BB65] rounded-full opacity-40"></div>
                                                    </div>
                                                </div>

                                                <div className="mb-6">
                                                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#85BB65]/80">Saldo</p>
                                                    <p className="text-2xl font-black tracking-tighter">{wallet.balance}</p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 border-t border-[#F4F4E8]/10 pt-4 mb-6">
                                                    <div>
                                                        <p className="text-[8px] font-bold uppercase text-[#85BB65]">Pemasukan</p>
                                                        <p className="text-xs font-bold text-white">{wallet.lastIn}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] font-bold uppercase text-red-400">Pengeluaran</p>
                                                        <p className="text-xs font-bold text-white">{wallet.lastOut}</p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button className="flex-1 py-2 bg-[#F4F4E8] text-[#1B3022] rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#85BB65] transition-colors">
                                                        Lihat Riwayat
                                                    </button>
                                                    <button className="px-4 py-2 bg-transparent border border-[#F4F4E8]/30 text-[#F4F4E8] rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#F4F4E8]/10 transition-colors">
                                                        Edit
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* --- Transaction List --- */}
                    <section>
                        <div className="lg:col-span-3 overflow-hidden bg-[#F4F4E8] dark:bg-[#0D1A12] shadow-[0_20px_50px_rgba(45,90,39,0.15)] sm:rounded-3xl relative">
                            <div className="p-5 relative z-10">
                                <div className="flex items-center justify-between mb-4 border-b border-[#2D5A27] pb-3">
                                    <div>
                                        <h3 className="text-lg font-black text-[#2D5A27] dark:text-[#85BB65] uppercase tracking-[0.2em] leading-none">
                                            Riwayat Transaksi
                                        </h3>
                                    </div>
                                    <button className="px-4 py-2 bg-[#2D5A27] text-[#F4F4E8] text-[10px] font-black rounded-lg hover:bg-[#1D3B1A] transition-colors uppercase tracking-widest">
                                        Lihat Semua
                                    </button>
                                </div>
                                
                                <div className="space-y-2">
                                    {transactions.slice(0, 5).map((trx) => (
                                        <div 
                                            key={trx.id} 
                                            className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border border-[#D1D1C2] dark:border-[#2D5A27]/40 bg-white/50 dark:bg-[#15261C]/30 hover:bg-[#2D5A27]/5 dark:hover:bg-[#2D5A27]/20 transition-all"
                                        >
                                            {/* Kiri: Metadata & Stamp Style */}
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-3">
                                                    {/* Stamp-like Type Indicator */}
                                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border font-black text-[9px] uppercase shadow-sm
                                                        ${trx.type === 'masuk' 
                                                            ? 'border-[#2D5A27] text-[#2D5A27] bg-[#E8F0E7]' 
                                                            : 'border-[#8B2E2E] text-[#8B2E2E] bg-[#FCEAEA]'}`}>
                                                        {trx.type === 'masuk' ? 'IN' : 'OUT'}
                                                    </div>
                                                    
                                                    <div>
                                                        <p className="font-black text-[#2D5A27] dark:text-white text-xxs leading-none tracking-tight">
                                                            {trx.description}
                                                        </p>
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <span className="text-[10px] font-bold text-[#4A5D50]/60 dark:text-[#85BB65]/60 uppercase tracking-tighter flex items-center">
                                                                <Calendar size={8} className="inline-block mr-1" />
                                                                {trx.date}
                                                            </span>
                                                            <Dot size={8} className="text-[#4A5D50]/60 dark:text-[#85BB65]/60" />
                                                            <span className="text-[10px] font-bold text-[#4A5D50]/60 dark:text-[#85BB65]/60 uppercase tracking-tighter flex items-center">
                                                                <Tag size={8} className="inline-block mr-1" />
                                                                {trx.category}
                                                            </span> 
                                                            <Dot size={8} className="text-[#4A5D50]/60 dark:text-[#85BB65]/60" />
                                                            <span className="text-[10px] font-bold text-[#4A5D50]/60 dark:text-[#85BB65]/60 uppercase tracking-tighter flex items-center">
                                                                <Wallet size={8} className="inline-block mr-1" />
                                                                {trx.wallet}
                                                            </span>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Kanan: Nominal (Digital Greenback Style) */}
                                            <div className="flex flex-col items-end pt-4 sm:pt-0 sm:pl-8">
                                                <p className={`font-black text-lg tracking-tighter font-mono ${trx.type === 'masuk' ? 'text-[#2D5A27]' : 'text-[#8B2E2E]'}`}>
                                                    {trx.type === 'masuk' ? '+Rp' : '-Rp'}{trx.amount}
                                                </p>
                                                <p className="text-[10px] font-bold text-[#4A5D50]/40 dark:text-[#85BB65]/30 flex items-center">
                                                    <User2 size={8} className="inline-block mr-1" />{trx.userName}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    {/* --- Infographic --- */}
                    <section className="space-y-5">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="text-[11px] font-black text-[#1B3022] dark:text-[#85BB65] uppercase tracking-[0.3em]">Infografis</h3>
                        </div>

                        {/* Horizontal Bar Chart: Pengeluaran Per Kategori */}
                        <div className="p-6 bg-white/80 dark:bg-[#0D1A12]/80 backdrop-blur-md rounded-3xl border border-[#2D5A27]/20 shadow-xl">
                            <h3 className="text-[10px] font-black text-[#2D5A27] dark:text-[#F4F4E8] uppercase tracking-widest mb-6">
                                Peringkat Pengeluaran Per Kategori (30 Hari Terakhir)
                            </h3>
                            <div className="w-full">
                                <Chart 
                                    options={categoryBarOptions} 
                                    series={[{ name: 'Total Pengeluaran', data: categoryExpenseData.map(d => d.total) }]} 
                                    type="bar" 
                                    height={categoryExpenseData.length * 60 + 100} // Tinggi dinamis agar label tidak tumpang tindih
                                />
                            </div>
                        </div>

                        {/* Line Chart: Arus Transaksi */}
                        <div className="p-6 bg-white/80 dark:bg-[#0D1A12]/80 backdrop-blur-md rounded-3xl border border-[#2D5A27]/20 shadow-xl">
                            <h3 className="text-[10px] font-black text-[#2D5A27] dark:text-[#F4F4E8] uppercase tracking-widest mb-6">
                                Arus Transaksi (12 Bulan Terakhir)
                            </h3>
                            <div className="w-full">
                                <Chart options={lineOptions} series={lineSeries} type="line" height={350} />
                            </div>
                        </div>

                        {/* Grid untuk Donut Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
                            {/* Donut Chart: Saldo Per Dompet */}
                            <div className="p-6 bg-white/80 dark:bg-[#0D1A12]/80 backdrop-blur-md rounded-3xl border border-[#2D5A27]/20 shadow-xl flex flex-col items-center justify-center">
                                <h3 className="text-[10px] font-black text-[#2D5A27] dark:text-[#85BB65] uppercase tracking-widest mb-4">
                                    Distribusi Saldo Saat Ini
                                </h3>
                                <div className="w-full">
                                    <Chart options={walletDonutOptions} series={walletPieData.map(d => d.value)} type="donut" height={250} />
                                </div>
                                <div className="mt-4 text-center border-t border-[#2D5A27]/10 pt-3 w-full">
                                    <p className="text-[10px] font-bold text-[#4A5D50]/60 uppercase tracking-tighter">Total Saldo Global</p>
                                    <p className="text-sm font-black text-[#2D5A27]">{formatIDR(totalSaldoAll)}</p>
                                </div>
                            </div>

                            {/* Donut Chart: Kategori Pengeluaran */}
                            <div className="p-6 bg-white/80 dark:bg-[#0D1A12]/80 backdrop-blur-md rounded-3xl border border-[#8B2E2E]/20 shadow-xl flex flex-col items-center justify-center">
                                <h3 className="text-[10px] font-black text-[#8B2E2E] uppercase tracking-widest mb-4">
                                    Komposisi Pengeluaran (12 Bulan Terakhir)
                                </h3>
                                <div className="w-full">
                                    <Chart options={categoryDonutOptions} series={categoryExpenseData.map(d => d.total)} type="donut" height={250} />
                                </div>
                                <div className="mt-4 text-center border-t border-[#8B2E2E]/10 pt-3 w-full">
                                    <p className="text-[10px] font-bold text-[#8B2E2E]/60 uppercase tracking-tighter">Total Pengeluaran</p>
                                    <p className="text-sm font-black text-[#8B2E2E]">{formatIDR(totalKeluarAll)}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

