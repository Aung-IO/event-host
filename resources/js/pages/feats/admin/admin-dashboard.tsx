import { usePage } from '@inertiajs/react';
import AdminLayout from './admin-layout';
import Header from '@/components/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type PageProps = {
    id: number;
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
};

export default function HostDashboard() {
    const { auth } = usePage<PageProps>().props;

    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">
            <Header />

            <AdminLayout>
                <div className="container mx-auto px-4 py-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <div className="mb-2 flex items-center gap-3">
                            <h1 className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
                                Admin Dashboard
                            </h1>
                            <Badge className="bg-purple-500">Admin</Badge>
                        </div>
                        <p className="text-slate-600">Welcome back, {auth.user.name}. Manage your events and engage with attendees.</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="border-l-4 border-l-indigo-500 bg-white/80 backdrop-blur">
                            <CardHeader className="pb-3">
                                <CardDescription>My Events</CardDescription>
                                <CardTitle className="text-3xl">12</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-indigo-600">3 upcoming</p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-purple-500 bg-white/80 backdrop-blur">
                            <CardHeader className="pb-3">
                                <CardDescription>Total Attendees</CardDescription>
                                <CardTitle className="text-3xl">342</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-green-600">+24 this week</p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-pink-500 bg-white/80 backdrop-blur">
                            <CardHeader className="pb-3">
                                <CardDescription>Pending RSVPs</CardDescription>
                                <CardTitle className="text-3xl">28</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-amber-600">Awaiting response</p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-rose-500 bg-white/80 backdrop-blur">
                            <CardHeader className="pb-3">
                                <CardDescription>Avg. Rating</CardDescription>
                                <CardTitle className="text-3xl">4.8</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-green-600">⭐⭐⭐⭐⭐</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Action Cards */}
                    <div className="mb-8 grid gap-6 md:grid-cols-2">
                        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white transition-shadow hover:shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-2xl">
                                    <span className="text-3xl">✨</span>
                                    Create New Event
                                </CardTitle>
                                <CardDescription className="text-indigo-100">Start planning your next amazing event</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50">Create Event</Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white transition-shadow hover:shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-2xl">
                                    <span className="text-3xl">📊</span>
                                    Event Analytics
                                </CardTitle>
                                <CardDescription className="text-purple-100">Track performance and engagement metrics</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full bg-white text-purple-600 hover:bg-purple-50">View Analytics</Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Management Sections */}
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="bg-white/80 backdrop-blur transition-shadow hover:shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <span className="text-2xl">📅</span>
                                    My Events
                                </CardTitle>
                                <CardDescription>View and manage all your events</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" className="w-full">
                                    View Events
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur transition-shadow hover:shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <span className="text-2xl">👥</span>
                                    Attendees
                                </CardTitle>
                                <CardDescription>Manage attendee lists and RSVPs</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" className="w-full">
                                    Manage Attendees
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur transition-shadow hover:shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <span className="text-2xl">💬</span>
                                    Messages
                                </CardTitle>
                                <CardDescription>Communicate with your attendees</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" className="w-full">
                                    View Messages
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur transition-shadow hover:shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <span className="text-2xl">🎟️</span>
                                    Tickets
                                </CardTitle>
                                <CardDescription>Manage ticket sales and pricing</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" className="w-full">
                                    Manage Tickets
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur transition-shadow hover:shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <span className="text-2xl">📸</span>
                                    Media Gallery
                                </CardTitle>
                                <CardDescription>Upload and manage event photos</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" className="w-full">
                                    View Gallery
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur transition-shadow hover:shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <span className="text-2xl">⚙️</span>
                                    Settings
                                </CardTitle>
                                <CardDescription>Configure your host profile</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" className="w-full">
                                    Settings
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AdminLayout>
        </div>
    );
}
