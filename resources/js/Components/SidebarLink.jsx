import { Link } from '@inertiajs/react';

export default function SidebarLink({ active = false, isCollapsed = false, href, icon, children, ...props }) {
    return (
        <Link
            href={href}
            {...props}
            className={
                'flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ' +
                (active
                    ? 'bg-[#2D5A27] text-white shadow-lg shadow-[#15261C]'
                    : 'hover:bg-[#2D5A27]/20 text-[#A8B5A7] hover:text-[#F4F4E8]')
            }
            title={isCollapsed ? children : ''} // Munculkan tooltip saat collapsed
        >
            {/* Icon Wrapper */}
            <span className={`shrink-0 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                {icon}
            </span>

            {/* Label Text - Disembunyikan saat Collapsed */}
            <span
                className={`text-[11px] font-black uppercase tracking-[0.2em] whitespace-nowrap overflow-hidden transition-all duration-300 ${
                    isCollapsed ? 'w-0 opacity-0' : 'w-full opacity-100'
                }`}
            >
                {children}
            </span>

            {/* Active Indicator Dot (Hanya muncul saat collapsed & active) */}
            {active && isCollapsed && (
                <div className="absolute right-2 w-1.5 h-1.5 bg-[#85BB65] rounded-full shadow-[0_0_8px_#85BB65]"></div>
            )}
        </Link>
    );
}