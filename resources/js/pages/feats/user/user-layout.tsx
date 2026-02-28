import { Link, usePage } from '@inertiajs/react';
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
import user from '@/routes/user';
import { Bell, Bookmark, CalendarCheck, LayoutDashboard, User } from 'lucide-react';

type PageProps = {
    auth: {
        user: {
            name: string;
            email: string;
            avatar?: string | null;
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
    { label: 'Dashboard',     href: user.dashboard.url(), icon: LayoutDashboard },
    { label: 'Joined Events', href: '#',                  icon: CalendarCheck },
    { label: 'Bookmarks',     href: '#',                  icon: Bookmark },
    { label: 'Notifications', href: '#',                  icon: Bell, badge: 2 },
    // { label: 'My Profile',    href: user.profile.url(),   icon: User },
];

export default function UserLayout({ children }: { children: React.ReactNode }) {
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
                                <Link href={user.dashboard.url()}>
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-teal-500 text-sm font-bold text-white">
                                        E
                                    </div>
                                    <div className="flex flex-col leading-none">
                                        <span className="text-sm font-semibold">EventHost</span>
                                        <span className="text-xs text-muted-foreground">User Portal</span>
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
                            <SidebarMenuButton size="lg" asChild>
                                <Link href={user.profile.url()} className="flex items-center gap-2">
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-blue-500 to-teal-500 text-xs font-bold text-white">
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
                <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <div className="h-4 w-px bg-border" />
                    <span className="text-sm font-medium text-muted-foreground">My Dashboard</span>
                </header>

                <main className="flex-1 overflow-y-auto">
                    <div className="container mx-auto px-4 py-8">{children}</div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
