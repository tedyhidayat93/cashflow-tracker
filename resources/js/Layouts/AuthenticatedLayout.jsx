import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import SidebarLink from '@/Components/SidebarLink'; // Import komponen baru
import { Link, usePage } from '@inertiajs/react';
import { LogOut, User2, BarChart3, Wallet, Settings, Users, History, Tags, Plus, ArrowUp, ArrowDown, ArrowRight, ArrowRightLeft, BoxIcon, DollarSign, BadgeDollarSign, PaintBucket, HandCoins } from 'lucide-react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    
    // State untuk Desktop Collapsible
    const [isCollapsed, setIsCollapsed] = useState(false);
    // State untuk Mobile Drawer
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    // State untuk Floating Button Menu
    const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);

    const menuItems = [
        { name: 'Dashboard', icon: <BarChart3 className="w-5 h-5" />, route: 'dashboard' },
        { name: 'Transaksi', icon: <History className="w-5 h-5" />, route: 'transactions.index' },
        { name: 'Dompet', icon: <Wallet className="w-5 h-5" />, route: 'budget.index' },
        { name: 'Budgeting', icon: <HandCoins className="w-5 h-5" />, route: 'transactions.index'},
        { name: 'Kategori', icon: <Tags className="w-5 h-5" />, route: 'budget.index' },
        { name: 'User Manajemen', icon: <Users className="w-5 h-5" />, route: 'users.index' },
        { name: 'Pengaturan', icon: <Settings className="w-5 h-5" />, route: 'settings.edit' },
    ];

    return (
        <div className="min-h-screen bg-[#F4F4E8] dark:bg-[#0D1A12] flex overflow-hidden font-sans">
            
            {/* --- SIDEBAR --- */}
            <aside 
                className={`fixed inset-y-0 max-h-screen left-0 z-50 bg-[#2D5A27] text-[#F4F4E8] transition-all duration-500 ease-in-out border-r border-[#2D5A27] shadow-2xl 
                ${isCollapsed ? 'w-20' : 'w-64'} 
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:relative lg:translate-x-0`}
            >
                <div className="flex flex-col h-full relative">
                    
                    {/* Toggle Button (Desktop) */}
                    <button 
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:flex absolute -right-3 top-24 w-6 h-6 bg-[#2D5A27] border border-[#85BB65] rounded-full items-center justify-center text-white z-50 hover:bg-[#85BB65] transition-colors shadow-lg"
                    >
                        <span className={`transition-transform duration-500 ${isCollapsed ? 'rotate-180' : ''}`}>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                        </span>
                    </button>

                    {/* Logo Section */}
                    <div className="h-20 flex items-center px-5 border-b border-[#2D5A27]/30 overflow-hidden shrink-0">
                        <Link href="/" className="flex items-center gap-3">
                            <ApplicationLogo className="h-10 w-10 shrink-0 fill-current text-[#85BB65]" />
                            <span className={`font-black text-lg tracking-tighter uppercase italic transition-all duration-500 ${isCollapsed ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}>
                                Cash<span className="text-[#85BB65]">Flow</span>
                            </span>
                        </Link>
                    </div>

                    {/* Menu Navigation with Enhanced Scrolling */}
                    <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-[#2D5A27]/20 scrollbar-thumb-[#85BB65]/40 hover:scrollbar-thumb-[#85BB65]/60 scrollbar-thumb-rounded-full">
                        <div className={`mb-4 px-2 text-[10px] font-black text-[#85BB65]/40 uppercase tracking-[0.3em] transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                            Treasury
                        </div>
                        
                        {menuItems.map((item) => (
                            <SidebarLink
                                key={item.name}
                                href={route().has(item.route) ? route(item.route) : '#'}
                                active={route().current(item.route)}
                                icon={item.icon}
                                isCollapsed={isCollapsed}
                            >
                                {item.name}
                            </SidebarLink>
                        ))}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-[#2D5A27]/30 bg-[#0D1A12]/50 shrink-0">
                        <div className={`transition-all duration-500 bg-[#2D5A27] rounded-2xl border border-[#2D5A27]/20 flex items-center justify-center ${isCollapsed ? 'p-2' : 'p-4'}`}>
                            {isCollapsed ? (
                                <span className="text-[#85BB65] text-xs font-black animate-pulse">●</span>
                            ) : (
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-[#85BB65] uppercase tracking-widest leading-none">V 1.0 SECURE</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 flex flex-col min-w-0 max-h-screen">
                <header className="h-16 bg-white/90 dark:bg-[#15261C]/90 backdrop-blur-md border-b border-[#C5C5B0] dark:border-[#2D5A27]/30 flex items-center justify-between px-6 shadow-sm relative z-40">
                    {/* Mobile Toggle */}
                    <button 
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        className="p-2 -ml-2 rounded-lg text-[#2D5A27] lg:hidden"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>

                    <div className="text-[10px] font-black text-[#4A5D50]/40 uppercase tracking-[0.2em] hidden sm:block">
                        Active Session: <span className="text-[#2D5A27]">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    </div>

                    {/* Profile Section */}
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex items-center gap-3 group focus:outline-none">
                                <div className="text-right hidden sm:block transition-all group-hover:translate-x-[-4px]">
                                    <p className="text-[11px] font-black text-[#2D5A27] dark:text-[#F4F4E8] uppercase">{user.name}</p>
                                    <p className="text-[9px] font-bold text-[#2D5A27] dark:text-[#85BB65] uppercase tracking-tighter italic">Verified Member</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-[#2D5A27] border-2 border-[#85BB65] flex items-center justify-center text-[#85BB65] font-black shadow-lg shadow-[#2D5A27]/20 transform transition-transform group-hover:rotate-6">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            </button>
                        </Dropdown.Trigger>

                        <Dropdown.Content align="right" width="48">
                            <Dropdown.Link className="flex items-center gap-2 font-medium" href={route('profile.edit')}><User2 className="w-4 h-4" /> Profil</Dropdown.Link>
                            <Dropdown.Link className="flex items-center gap-2 font-medium text-red-600" href={route('logout')} method="post" as="button"><LogOut className="w-4 h-4" /> Keluar</Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </header>

                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-screen-2xl mx-auto">
                        {header && (
                            <div className="bg-white/40 dark:bg-transparent border-b border-[#C5C5B0]/20 py-5 px-5 lg:px-10">
                                {header}
                            </div>
                        )}
                        <div className="px-4 lg:px-8 py-5">
                            {children}
                        </div>
                    </div>
                </main>
            </div>

            {/* Floating Buttons */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
                {/* Expanded Menu Items */}
                <div className={`flex flex-col gap-3 transition-all duration-300 ${isFloatingMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    {/* Pemasukan Button */}
                    <button className="group flex items-center gap-3 bg-white dark:bg-[#0D1A12] text-primary-700 dark:text-primary-500 px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <ArrowDown className="w-5 h-5" />
                        <span className="text-sm font-semibold whitespace-nowrap">Pemasukan</span>
                    </button>
                    
                    {/* Pengeluaran Button */}
                    <button className="group flex items-center gap-3 bg-white dark:bg-[#0D1A12] text-red-600 dark:text-red-400 px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <ArrowUp className="w-5 h-5" />
                        <span className="text-sm font-semibold whitespace-nowrap">Pengeluaran</span>
                    </button>
                    
                    {/* Transfer Saldo Button */}
                    <button className="group flex items-center gap-3 bg-white dark:bg-[#0D1A12] text-blue-600 dark:text-blue-400 px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <ArrowRightLeft className="w-5 h-5" />
                        <span className="text-sm font-semibold whitespace-nowrap">Transfer Saldo</span>
                    </button>
                </div>

                {/* Main Plus Button */}
                <button
                    onClick={() => setIsFloatingMenuOpen(!isFloatingMenuOpen)}
                    className={`w-14 h-14 bg-primary-700 hover:bg-primary-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110 ${isFloatingMenuOpen ? 'rotate-45' : ''}`}
                >
                    <Plus className="w-6 h-6 transition-transform duration-300" />
                </button>
            </div>
        </div>
    );
}