import Header from '@/components/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePage } from '@inertiajs/react';

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

export default function Dashboard() {
    const { auth } = usePage<PageProps>().props;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
            <Header />

            <div className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="mb-2 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-4xl font-bold text-transparent">
                        Welcome, {auth.user.name}!
                    </h1>
                    <p className="text-slate-600">Discover and join amazing events happening around you.</p>
                </div>

                {/* Quick Stats */}
                <div className="mb-8 grid gap-6 md:grid-cols-3">
                    <Card className="border-l-4 border-l-blue-500 bg-white/80 backdrop-blur">
                        <CardHeader className="pb-3">
                            <CardDescription>Events Joined</CardDescription>
                            <CardTitle className="text-3xl">8</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-blue-600">2 upcoming</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-cyan-500 bg-white/80 backdrop-blur">
                        <CardHeader className="pb-3">
                            <CardDescription>Saved Events</CardDescription>
                            <CardTitle className="text-3xl">15</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-cyan-600">View saved</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-teal-500 bg-white/80 backdrop-blur">
                        <CardHeader className="pb-3">
                            <CardDescription>Following</CardDescription>
                            <CardTitle className="text-3xl">23</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-teal-600">Hosts & Events</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Featured Events */}
                <div className="mb-8">
                    <h2 className="mb-4 text-2xl font-bold">Featured Events</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card className="group overflow-hidden bg-white/80 backdrop-blur transition-all hover:shadow-xl">
                            <div className="flex h-48 items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400 text-6xl text-white">
                                🎵
                            </div>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <CardTitle>Summer Music Festival</CardTitle>
                                    <Badge className="bg-green-500">Free</Badge>
                                </div>
                                <CardDescription>June 25, 2026 • 6:00 PM</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4 text-sm text-slate-600">Join us for an amazing evening of live music and entertainment.</p>
                                <Button className="w-full transition-colors group-hover:bg-purple-600">Register Now</Button>
                            </CardContent>
                        </Card>

                        <Card className="group overflow-hidden bg-white/80 backdrop-blur transition-all hover:shadow-xl">
                            <div className="flex h-48 items-center justify-center bg-gradient-to-br from-blue-400 to-cyan-400 text-6xl text-white">
                                💼
                            </div>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <CardTitle>Tech Career Fair</CardTitle>
                                    <Badge className="bg-blue-500">Paid</Badge>
                                </div>
                                <CardDescription>July 10, 2026 • 10:00 AM</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4 text-sm text-slate-600">Network with top tech companies and explore career opportunities.</p>
                                <Button className="w-full transition-colors group-hover:bg-blue-600">Register Now</Button>
                            </CardContent>
                        </Card>

                        <Card className="group overflow-hidden bg-white/80 backdrop-blur transition-all hover:shadow-xl">
                            <div className="flex h-48 items-center justify-center bg-gradient-to-br from-amber-400 to-orange-400 text-6xl text-white">
                                🍕
                            </div>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <CardTitle>Food & Wine Tasting</CardTitle>
                                    <Badge className="bg-amber-500">Paid</Badge>
                                </div>
                                <CardDescription>July 15, 2026 • 7:00 PM</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4 text-sm text-slate-600">Experience exquisite cuisine paired with fine wines.</p>
                                <Button className="w-full transition-colors group-hover:bg-amber-600">Register Now</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-white/80 backdrop-blur transition-shadow hover:shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="text-2xl">🔍</span>
                                Browse Events
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full">
                                Explore
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur transition-shadow hover:shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="text-2xl">📅</span>
                                My Events
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full">
                                View All
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur transition-shadow hover:shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="text-2xl">❤️</span>
                                Saved
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full">
                                View Saved
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur transition-shadow hover:shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="text-2xl">⚙️</span>
                                Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full">
                                Configure
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
