import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import SidebarLink from '@/Components/SidebarLink'; // Import komponen baru
import { Link, usePage } from '@inertiajs/react';
import { LogOut, User2, BarChart3, PenSquare, Wallet, Settings, Users } from 'lucide-react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    
    // State untuk Desktop Collapsible
    const [isCollapsed, setIsCollapsed] = useState(false);
    // State untuk Mobile Drawer
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const menuItems = [
        { name: 'Dashboard', icon: <BarChart3 className="w-5 h-5" />, route: 'dashboard' },
        { name: 'Catat Pengeluaran', icon: <PenSquare className="w-5 h-5" />, route: 'transactions.index' },
        { name: 'Budgeting', icon: <Wallet className="w-5 h-5" />, route: 'budget.index' },
        { name: 'Pengaturan', icon: <Settings className="w-5 h-5" />, route: 'settings.edit' },
        { name: 'User Manajemen', icon: <Users className="w-5 h-5" />, route: 'users.index' },
    ];

    return (
        <div className="min-h-screen bg-[#F4F4E8] dark:bg-[#0D1A12] flex overflow-hidden font-sans">
            
            {/* --- SIDEBAR --- */}
            <aside 
                className={`fixed inset-y-0 left-0 z-50 bg-[#1B3022] text-[#F4F4E8] transition-all duration-500 ease-in-out border-r border-[#2D5A27] shadow-2xl 
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

                    {/* Menu Navigation */}
                    <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
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
                    <div className="p-4 border-t border-[#2D5A27]/30 bg-[#0D1A12]/50">
                        <div className={`transition-all duration-500 bg-[#1B3022] rounded-2xl border border-[#2D5A27]/20 flex items-center justify-center ${isCollapsed ? 'p-2' : 'p-4'}`}>
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
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white/90 dark:bg-[#15261C]/90 backdrop-blur-md border-b border-[#C5C5B0] dark:border-[#2D5A27]/30 flex items-center justify-between px-6 shadow-sm relative z-40">
                    {/* Mobile Toggle */}
                    <button 
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        className="p-2 -ml-2 rounded-lg text-[#1B3022] lg:hidden"
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
                                    <p className="text-[11px] font-black text-[#1B3022] dark:text-[#F4F4E8] uppercase">{user.name}</p>
                                    <p className="text-[9px] font-bold text-[#2D5A27] dark:text-[#85BB65] uppercase tracking-tighter italic">Verified Member</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-[#1B3022] border-2 border-[#85BB65] flex items-center justify-center text-[#85BB65] font-black shadow-lg shadow-[#1B3022]/20 transform transition-transform group-hover:rotate-6">
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
        </div>
    );
}