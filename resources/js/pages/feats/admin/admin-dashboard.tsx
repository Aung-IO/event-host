import { Link, usePage } from '@inertiajs/react';
import { CalendarCheck, CalendarClock, CalendarX2, LayoutGrid, Ticket, UserPlus, Users } from 'lucide-react';
import Header from '@/components/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import admin from '@/routes/admin';
import AdminLayout from './admin-layout';

type Stats = {
    totalEvents: number;
    pendingEvents: number;
    approvedEvents: number;
    rejectedEvents: number;
    totalUsers: number;
    totalRegistrations: number;
    newUsersThisWeek: number;
};

type PageProps = {
    stats: Stats;
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
};

type StatCardProps = {
    title: string;
    value: number;
    sub: string;
    subColor?: string;
    borderColor: string;
    icon: React.ElementType;
    iconColor: string;
};

function StatCard({ title, value, sub, subColor = 'text-slate-500', borderColor, icon: Icon, iconColor }: StatCardProps) {
    return (
        <Card className={`border-l-4 ${borderColor} bg-white/80 backdrop-blur`}>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardDescription className="text-xs font-medium tracking-wider uppercase">{title}</CardDescription>
                    <Icon className={`h-4 w-4 ${iconColor}`} />
                </div>
                <CardTitle className="text-3xl font-bold">{value.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className={`text-sm ${subColor}`}>{sub}</p>
            </CardContent>
        </Card>
    );
}

export default function AdminDashboard() {
    const { auth, stats } = usePage<PageProps>().props;

    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">
            <Header />

            <AdminLayout pendingCount={stats.pendingEvents}>
                {/* Welcome Section */}
                <div className="mb-8">
                    <div className="mb-2 flex items-center gap-3">
                        <h1 className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
                            Admin Dashboard
                        </h1>
                        <Badge className="bg-purple-500">Admin</Badge>
                    </div>
                    <p className="text-slate-600">
                        Welcome back, <span className="font-medium">{auth.user.name}</span>. Here's an overview of the platform.
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Events"
                        value={stats.totalEvents}
                        sub={stats.pendingEvents > 0 ? `${stats.pendingEvents} pending review` : 'No pending events'}
                        subColor={stats.pendingEvents > 0 ? 'text-amber-600' : 'text-green-600'}
                        borderColor="border-l-indigo-500"
                        icon={LayoutGrid}
                        iconColor="text-indigo-400"
                    />

                    <StatCard
                        title="Approved Events"
                        value={stats.approvedEvents}
                        sub={`${stats.rejectedEvents} rejected`}
                        subColor="text-red-500"
                        borderColor="border-l-green-500"
                        icon={CalendarCheck}
                        iconColor="text-green-400"
                    />

                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers}
                        sub={stats.newUsersThisWeek > 0 ? `+${stats.newUsersThisWeek} joined this week` : 'No new users this week'}
                        subColor={stats.newUsersThisWeek > 0 ? 'text-indigo-600' : 'text-slate-400'}
                        borderColor="border-l-purple-500"
                        icon={Users}
                        iconColor="text-purple-400"
                    />

                    <StatCard
                        title="Registrations"
                        value={stats.totalRegistrations}
                        sub="Across all events"
                        subColor="text-slate-500"
                        borderColor="border-l-pink-500"
                        icon={Ticket}
                        iconColor="text-pink-400"
                    />
                </div>

                {/* Status Breakdown */}
                <div className="mb-8 grid gap-4 md:grid-cols-3">
                    <Card className="bg-white/80 backdrop-blur">
                        <CardContent className="flex items-center gap-4 py-5">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100">
                                <CalendarClock className="h-6 w-6 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-amber-600">{stats.pendingEvents}</p>
                                <p className="text-sm text-slate-500">Pending Approval</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur">
                        <CardContent className="flex items-center gap-4 py-5">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100">
                                <CalendarCheck className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-600">{stats.approvedEvents}</p>
                                <p className="text-sm text-slate-500">Approved</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur">
                        <CardContent className="flex items-center gap-4 py-5">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100">
                                <CalendarX2 className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-red-600">{stats.rejectedEvents}</p>
                                <p className="text-sm text-slate-500">Rejected</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Action Cards */}
                <div className="mb-8 grid gap-6 md:grid-cols-2">
                    <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white transition-shadow hover:shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <span className="text-3xl">📋</span>
                                Event Approvals
                            </CardTitle>
                            <CardDescription className="text-indigo-100">Review pending event submissions from hosts</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50" asChild>
                                <Link href={admin.events.url()}>Review Events{stats.pendingEvents > 0 && ` (${stats.pendingEvents})`}</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white transition-shadow hover:shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <span className="text-3xl">👥</span>
                                User Management
                            </CardTitle>
                            <CardDescription className="text-purple-100">Manage roles, reset passwords, and monitor users</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full bg-white text-purple-600 hover:bg-purple-50" asChild>
                                <Link href={admin.users.url()}>Manage Users</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Info Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="bg-white/80 backdrop-blur transition-shadow hover:shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="text-2xl">📅</span>
                                All Events
                            </CardTitle>
                            <CardDescription>Browse the public event listing</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/events">View Public Events</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur transition-shadow hover:shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserPlus className="h-5 w-5 text-indigo-500" />
                                New This Week
                            </CardTitle>
                            <CardDescription>Users who joined this week</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-indigo-600">+{stats.newUsersThisWeek}</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur transition-shadow hover:shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="text-2xl">⚙️</span>
                                Profile Settings
                            </CardTitle>
                            <CardDescription>Manage your admin account</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full" asChild>
                                <Link href={admin.profile.url()}>Settings</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </AdminLayout>
        </div>
    );
}
