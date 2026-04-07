import { AnimatedNumber } from '@/Components/AnimatedNumber';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Welcome({ auth }) {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <>
            <Head title="CashflowTracker - Dollar Edition" />
            
            {/* Background: Menggunakan warna Off-White (kertas uang) dan Dark Green */}
            <div className="min-h-screen bg-[#F4F4E8] text-[#2D5A27] selection:bg-[#2D5A27] selection:text-white dark:bg-[#0D1A12] dark:text-[#D1D9D0] transition-colors duration-300 relative overflow-hidden">
                
                {/* --- DOLLAR BACKGROUND EFFECTS --- */}
                <div 
                    className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500"
                    style={{
                        background: `radial-gradient(circle 400px at ${mousePos.x}px ${mousePos.y}px, rgba(45, 90, 39, 0.05), transparent)`
                    }}
                />

                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[5%] left-[10%] w-80 h-80 bg-[#2D5A27]/10 rounded-full blur-[120px] animate-blob" />
                    <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-[#85BB65]/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
                </div>

                {/* Navigation */}
                <nav className="fixed top-0 w-full z-50 bg-[#F4F4E8]/60 backdrop-blur-xl border-b border-[#D1D1C2] dark:bg-[#0D1A12]/60 dark:border-[#2D5A27]">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            {/* Logo: Green Dollar Style */}
                            <div className="w-9 h-9 bg-[#2D5A27] rounded-xl flex items-center justify-center shadow-lg shadow-[#2D5A27]/30">
                                <span className="text-[#85BB65] font-black text-xl">$</span>
                            </div>
                            <span className="font-extrabold text-xl tracking-tight text-[#2D5A27] dark:text-[#F4F4E8] uppercase">
                                Cashflow<span className="text-[#4A7C44]">Tracker</span>
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-6 py-3">
                            {auth.user ? (
                                <Link href={route('dashboard')} className="text-sm font-bold text-[#2D5A27] px-4 py-2 rounded-xl transition dark:text-[#85BB65]">Dashboard →</Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="text-sm font-semibold text-[#3D5245] hover:text-[#2D5A27] transition hidden sm:block">Log in</Link>
                                    <Link href={route('register')} className="text-sm font-bold bg-[#2D5A27] text-[#F4F4E8] px-5 py-2.5 rounded-xl hover:bg-[#2D5A27] shadow-md transition dark:bg-[#2D5A27] dark:hover:bg-[#3D7A36]">Mulai Gratis</Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                <main className="relative pt-[7rem] pb-20 px-6 z-10">
                    <div className="max-w-5xl mx-auto text-center">
                        {/* Badge: Dollar Green */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8E8D5] border border-[#C5C5B0] dark:bg-[#2D5A27] dark:border-[#2D5A27] mb-8">
                            <span className="flex h-2 w-2 rounded-full bg-[#2D5A27] animate-pulse"></span>
                            <span className="text-xs font-bold text-[#2D5A27] dark:text-[#85BB65] uppercase tracking-wider text-[10px]">Cashflow Monitoring System</span>
                        </div>

                        <h1 className="text-4xl md:text-7xl font-black capitalize mb-5 text-[#2D5A27] dark:text-[#F4F4E8] leading-[1.1] tracking-tight">
                            Atur Uangmu Seperti <br /> <span className="text-[#2D5A27] dark:text-[#85BB65]">Bendahara Profesional.</span>
                        </h1>
                        
                        <p className="text-base text-[#4A5D50] dark:text-[#A8B5A7] max-w-2xl mx-auto leading-relaxed mb-7">
                            Visualisasikan arus keuangan kamu dengan sistem cerdas <span className="font-semibold text-[#2D5A27] dark:text-white underline decoration-[#85BB65] underline-offset-4">CashflowTracker</span>.
                        </p>

                        {/* Card Preview: Dollar Aesthetics */}
                        <div className="mb-6 relative max-w-full md:max-w-lg mx-auto group">
                            <div className="relative bg-[#E8E8D5]/80 dark:bg-[#15261C]/80 backdrop-blur-2xl border border-[#C5C5B0] dark:border-[#2D5A27] p-2 rounded-[2.5rem] shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="px-6 py-3 text-left rounded-[2rem] bg-[#F4F4E8] dark:bg-[#0D1A12] border border-[#D1D1C2] dark:border-[#2D5A27] shadow-sm">
                                        <div className="text-[#4A5D50]/60 dark:text-[#85BB65]/40 font-bold uppercase text-[7px] md:text-[9px] tracking-widest">Balance</div>
                                        <AnimatedNumber value={12500000} prefix="Rp" className="text-[10px] line-clamp-1 md:text-base font-bold" colorClass="text-[#2D5A27] dark:text-[#F4F4E8]" />
                                    </div>
                                    <div className="px-6 py-3 text-left rounded-[2rem] bg-[#D8E6D1] dark:bg-[#2D5A27]/20 border border-[#B8CBB0] dark:border-[#2D5A27] shadow-sm">
                                        <div className="text-[#2D5A27] font-bold uppercase text-[7px] md:text-[9px] tracking-widest">Income</div>
                                        <AnimatedNumber value={4200000} prefix="+" className="text-[10px] line-clamp-1 md:text-base font-bold" colorClass="text-[#2D5A27] dark:text-[#85BB65]" />
                                    </div>
                                    <div className="px-6 py-3 text-left rounded-[2rem] bg-[#F9E6E6] dark:bg-[#3D1A1A]/30 border border-[#EACACA] dark:border-[#522525] shadow-sm">
                                        <div className="text-[#8B2E2E] font-bold uppercase text-[7px] md:text-[9px] tracking-widest">Expense</div>
                                        <AnimatedNumber value={1150000} prefix="-" className="text-[10px] line-clamp-1 md:text-base font-bold" colorClass="text-[#8B2E2E]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center gap-8">
                            <Link href={route('register')} className="w-full sm:w-auto px-10 py-5 bg-primary-700 text-primary-50 font-black text-lg rounded-2xl shadow-2xl shadow-primary-700/30 hover:bg-primary-800 hover:-translate-y-1 transition-all duration-300">
                                Mulai Catat Pengeluaran
                            </Link>
                            
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-[#F4F4E8] dark:border-[#0D1A12] bg-[#D8E6D1] overflow-hidden shadow-sm">
                                            <img src={`https://i.pravatar.cc/150?u=money${i}`} alt="user" className="w-full h-full object-cover grayscale" />
                                        </div>
                                    ))}
                                </div>
                                <span className="text-sm font-medium text-[#4A5D50] dark:text-[#85BB65]">
                                    <span className="text-[#2D5A27] dark:text-white font-bold">1,00+</span> menggunakan ini.
                                </span>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="py-12 border-t border-[#D1D1C2] dark:border-[#2D5A27] relative z-10">
                    <div className="max-w-7xl mx-auto px-6 text-center text-[10px] font-bold text-[#4A5D50]/40 dark:text-[#85BB65]/20 uppercase tracking-[0.4em]">
                        © {new Date().getFullYear()} THEIGHTDEV • CASHFLOWTRACKER
                    </div>
                </footer>
            </div>
        </>
    );
}