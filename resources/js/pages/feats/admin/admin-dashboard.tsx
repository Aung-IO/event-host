import { usePage } from '@inertiajs/react';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type PageProps = {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
};

export default function AdminDashboard() {
    const { auth } = usePage<PageProps>().props;

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
            <Header />

            <div className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="mb-2 text-4xl font-bold text-slate-900">Admin Dashboard</h1>
                    <p className="text-slate-600">Welcome back, {auth.user.name}. Manage your platform from here.</p>
                </div>

                {/* Stats Grid */}
                <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-3">
                            <CardDescription>Total Users</CardDescription>
                            <CardTitle className="text-3xl">1,234</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-green-600">+12% from last month</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-purple-500">
                        <CardHeader className="pb-3">
                            <CardDescription>Total Events</CardDescription>
                            <CardTitle className="text-3xl">456</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-green-600">+8% from last month</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-amber-500">
                        <CardHeader className="pb-3">
                            <CardDescription>Active Hosts</CardDescription>
                            <CardTitle className="text-3xl">89</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-green-600">+5% from last month</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-emerald-500">
                        <CardHeader className="pb-3">
                            <CardDescription>Revenue</CardDescription>
                            <CardTitle className="text-3xl">$12.5k</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-green-600">+18% from last month</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Management Sections */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="transition-shadow hover:shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="text-2xl">👥</span>
                                User Management
                            </CardTitle>
                            <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full">Manage Users</Button>
                        </CardContent>
                    </Card>

                    <Card className="transition-shadow hover:shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="text-2xl">📅</span>
                                Event Management
                            </CardTitle>
                            <CardDescription>Review, approve, and manage all events</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full">Manage Events</Button>
                        </CardContent>
                    </Card>

                    <Card className="transition-shadow hover:shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="text-2xl">🎭</span>
                                Host Management
                            </CardTitle>
                            <CardDescription>Manage host accounts and event permissions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full">Manage Hosts</Button>
                        </CardContent>
                    </Card>

                    <Card className="transition-shadow hover:shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="text-2xl">📊</span>
                                Analytics
                            </CardTitle>
                            <CardDescription>View detailed platform analytics and reports</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full">View Analytics</Button>
                        </CardContent>
                    </Card>

                    <Card className="transition-shadow hover:shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="text-2xl">⚙️</span>
                                System Settings
                            </CardTitle>
                            <CardDescription>Configure platform settings and preferences</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full">Settings</Button>
                        </CardContent>
                    </Card>

                    <Card className="transition-shadow hover:shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="text-2xl">🔒</span>
                                Security
                            </CardTitle>
                            <CardDescription>Manage security settings and audit logs</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full">Security</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
