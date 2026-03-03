import { Link, usePage } from '@inertiajs/react';
import { CalendarCheck, LayoutDashboard, Settings, Users } from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import admin from '@/routes/admin';

type PageProps = {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
            avatar: string | null;
        };
    };
};

type NavItem = {
    label: string;
    href: string;
    icon: React.ElementType;
};

const adminNavItems: NavItem[] = [
    { label: 'Overview', href: admin.dashboard.url(), icon: LayoutDashboard },
    { label: 'Event Approvals', href: admin.events.url(), icon: CalendarCheck },
    { label: 'Users', href: admin.users.url(), icon: Users },
    { label: 'Settings', href: '#', icon: Settings },
];

export default function AdminLayout({ children, pendingCount }: { children: React.ReactNode; pendingCount?: number }) {
    const { auth } = usePage<PageProps>().props;
    const currentPath = window.location.pathname;

    return (
        <SidebarProvider>
            <Toaster richColors position="top-right" />
            <Sidebar collapsible="icon">
                {/* Sidebar Header — branding */}
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
                                <Link href={admin.dashboard.url()}>
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
                                        E
                                    </div>
                                    <div className="flex flex-col leading-none">
                                        <span className="text-sm font-semibold">EventHost</span>
                                        <span className="text-xs text-muted-foreground">Admin Portal</span>
                                    </div>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                {/* Nav items */}
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {adminNavItems.map((item) => {
                                    const isActive = item.href !== '#' && currentPath === item.href;
                                    const Icon = item.icon;
                                    const isPendingApprovals = item.label === 'Event Approvals';
                                    return (
                                        <SidebarMenuItem key={item.label}>
                                            <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                                                <Link href={item.href}>
                                                    <Icon />
                                                    <span>{item.label}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                            {isPendingApprovals && pendingCount !== undefined && pendingCount > 0 && (
                                                <SidebarMenuBadge>{pendingCount}</SidebarMenuBadge>
                                            )}
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                {/* User info footer */}
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" className="cursor-default select-none">
                                <Link href={admin.profile.url()} className="flex items-center justify-center gap-2">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white">
                                        {auth.user.avatar ? (
                                            <img
                                                src={`/storage/${auth.user.avatar}`}
                                                alt="Avatar"
                                                className="h-full w-full rounded-full object-cover"
                                            />
                                        ) : (
                                            auth.user.name.charAt(0).toUpperCase()
                                        )}
                                    </span>
                                    <div className="flex min-w-0 flex-col leading-none">
                                        <span className="truncate text-sm font-semibold">{auth.user.name}</span>
                                        <span className="truncate text-xs text-muted-foreground">{auth.user.email}</span>
                                    </div>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>

                <SidebarRail />
            </Sidebar>

            {/* Main content area */}
            <SidebarInset>
                {/* Top bar with sidebar trigger */}
                <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <div className="h-4 w-px bg-border" />
                    <span className="text-sm font-medium text-muted-foreground">Admin Dashboard</span>
                </header>

                <main className="flex-1 overflow-y-auto">
                    <div className="container mx-auto px-4 py-8">{children}</div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
