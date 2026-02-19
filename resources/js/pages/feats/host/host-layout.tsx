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
import events from '@/routes/events';
import host from '@/routes/host';
import { Link, usePage } from '@inertiajs/react';
import { BarChart3, Bell, CalendarDays, LayoutDashboard, PlusCircle, Settings, Users } from 'lucide-react';

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
    icon: React.ElementType;
    badge?: number;
};

const navItems: NavItem[] = [
    { label: 'Overview', href: host.dashboard.url(), icon: LayoutDashboard },
    { label: 'Create Event', href: host.events.create.url(), icon: PlusCircle },
    { label: 'All Events', href: host.events.index.url(), icon: CalendarDays },
    { label: 'Attendees', href: '#', icon: Users },
    { label: 'Analytics', href: '#', icon: BarChart3 },
    { label: 'Notifications', href: '#', icon: Bell, badge: 3 },
    { label: 'Settings', href: '#', icon: Settings },
];

export default function HostLayout({ children }: { children: React.ReactNode }) {
    const { auth } = usePage<PageProps>().props;
    const currentPath = window.location.pathname;

    return (
        <SidebarProvider>
            <Sidebar collapsible="icon">
                {/* Sidebar Header — branding */}
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
                                <Link href={host.dashboard.url()}>
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
                                        E
                                    </div>
                                    <div className="flex flex-col leading-none">
                                        <span className="text-sm font-semibold">EventHost</span>
                                        <span className="text-xs text-muted-foreground">Host Portal</span>
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
                                {navItems.map((item) => {
                                    const isActive = item.href !== '#' && currentPath === item.href;
                                    const Icon = item.icon;
                                    return (
                                        <SidebarMenuItem key={item.label}>
                                            <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                                                <Link href={item.href}>
                                                    <Icon />
                                                    <span>{item.label}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                            {item.badge !== undefined && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
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
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex min-w-0 flex-col leading-none">
                                    <span className="truncate text-sm font-semibold">{auth.user.name}</span>
                                    <span className="truncate text-xs text-muted-foreground">{auth.user.email}</span>
                                </div>
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
                    <span className="text-sm font-medium text-muted-foreground">Host Dashboard</span>
                </header>

                <main className="flex-1 overflow-y-auto">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}
