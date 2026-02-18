import host from '@/routes/host';
import { Link, usePage } from '@inertiajs/react';

type PageProps = {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
};

type NavItem = {
    label: string;
    href: string;
    icon: string;
};

const navItems: NavItem[] = [
    { label: 'Dashboard', href: host.dashboard.url(), icon: '🏠' },
    { label: 'Create New Event', href: '#', icon: '✨' },
    { label: 'Notifications', href: '#', icon: '🔔' },
    { label: 'Settings', href: '#', icon: '⚙️' },
];

export default function HostLayout({ children }: { children: React.ReactNode }) {
    const { auth } = usePage<PageProps>().props;
    const currentPath = window.location.pathname;

    return (
        <div className="flex h-[calc(100vh-57px)]">
            {/* Sidebar */}
            <aside className="sticky top-0 flex h-full w-64 shrink-0 flex-col overflow-y-auto border-r bg-white/70 backdrop-blur">
                {/* Nav */}
                <nav className="flex-1 space-y-1 px-3 py-4">
                    {navItems.map((item) => {
                        const isActive = item.href !== '#' && currentPath === item.href;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={[
                                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                                    isActive
                                        ? 'bg-linear-to-r from-indigo-500 to-purple-600 text-white shadow-sm'
                                        : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700',
                                ].join(' ')}
                            >
                                <span className="text-base">{item.icon}</span>
                                {item.label}
                                {item.label === 'Notifications' && (
                                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                                        3
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info */}
                <div className="border-b px-5 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
                            {auth.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-800">{auth.user.name}</p>
                            <p className="truncate text-xs text-slate-500">{auth.user.email}</p>
                        </div>
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                        Host
                    </span>
                </div>

                {/* Footer */}
                <div className="px-3 py-3">
                    <p className="px-3 text-xs text-slate-400">© 2026 EventHost</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
    );
}
