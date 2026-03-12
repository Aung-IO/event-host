import { Link, usePage } from '@inertiajs/react';
import { CalendarDays, CheckCircle2, Clock, MapPin, PlusCircle, Users, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import host from '@/routes/host';
import HostLayout from './host-layout';

type Stats = {
    totalEvents: number;
    approvedEvents: number;
    pendingEvents: number;
    rejectedEvents: number;
    totalRegistrations: number;
};

type UpcomingEvent = {
    id: number;
    title: string;
    start_date: string;
    location: string;
    registrations_count: number;
    capacity: number;
};

type PageProps = {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    stats: Stats;
    upcomingEvents: UpcomingEvent[];
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export default function HostDashboard() {
    const { auth, stats, upcomingEvents } = usePage<PageProps>().props;

    const statCards = [
        {
            label: 'Total Events',
            value: stats.totalEvents,
            icon: CalendarDays,
            accent: 'border-l-indigo-500',
            iconColor: 'text-indigo-500',
            sub: `${stats.totalRegistrations} total registrations`,
            subColor: 'text-indigo-600 dark:text-indigo-400',
        },
        {
            label: 'Approved',
            value: stats.approvedEvents,
            icon: CheckCircle2,
            accent: 'border-l-emerald-500',
            iconColor: 'text-emerald-500',
            sub: 'Live & visible',
            subColor: 'text-emerald-600 dark:text-emerald-400',
        },
        {
            label: 'Pending Review',
            value: stats.pendingEvents,
            icon: Clock,
            accent: 'border-l-amber-500',
            iconColor: 'text-amber-500',
            sub: 'Awaiting approval',
            subColor: 'text-amber-600 dark:text-amber-400',
        },
        {
            label: 'Rejected',
            value: stats.rejectedEvents,
            icon: XCircle,
            accent: 'border-l-rose-500',
            iconColor: 'text-rose-500',
            sub: 'Needs revision',
            subColor: 'text-rose-600 dark:text-rose-400',
        },
    ];

    return (
        <HostLayout>
            {/* Welcome Section */}
            <div className="mb-8">
                <div className="mb-1 flex items-center gap-3">
                    <h1 className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">Host Dashboard</h1>
                    <Badge className="bg-purple-500 text-white">Host</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                    Welcome back, <span className="font-medium text-foreground">{auth.user.name}</span>. Here's an overview of your events.
                </p>
            </div>

            {/* Stats */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Card key={card.label} className={`border-l-4 ${card.accent}`}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardDescription className="text-sm font-medium">{card.label}</CardDescription>
                                <Icon className={`h-4 w-4 ${card.iconColor}`} />
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">{card.value}</p>
                                <p className={`mt-1 text-xs ${card.subColor}`}>{card.sub}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
                <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md transition-shadow hover:shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <PlusCircle className="h-5 w-5" />
                            Create New Event
                        </CardTitle>
                        <CardDescription className="text-indigo-100">Start planning your next amazing event</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full bg-white text-indigo-600 hover:bg-indigo-50">
                            <Link href={host.events.create.url()}>Create Event</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-md transition-shadow hover:shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <CalendarDays className="h-5 w-5" />
                            My Events
                        </CardTitle>
                        <CardDescription className="text-purple-100">View and manage all your events</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full bg-white text-purple-600 hover:bg-purple-50">
                            <Link href={host.myEvents.url()}>View My Events</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Upcoming Events */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-semibold">Upcoming Events</CardTitle>
                        <CardDescription>Your next 5 approved events</CardDescription>
                    </div>
                    <Button asChild variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
                        <Link href={host.myEvents.url()}>View all →</Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    {upcomingEvents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                            <CalendarDays className="h-10 w-10 text-muted-foreground/40" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">No upcoming events</p>
                                <p className="mt-0.5 text-xs text-muted-foreground/70">Create an event to get started</p>
                            </div>
                            <Button asChild size="sm" className="mt-2">
                                <Link href={host.events.create.url()}>Create Event</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {upcomingEvents.map((event) => {
                                const fillPct = event.capacity > 0 ? Math.round((event.registrations_count / event.capacity) * 100) : 0;

                                return (
                                    <div key={event.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">{event.title}</p>
                                            <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <CalendarDays className="h-3 w-3" />
                                                    {formatDate(event.start_date)}
                                                </span>
                                                <span className="flex items-center gap-1 truncate">
                                                    <MapPin className="h-3 w-3 shrink-0" />
                                                    <span className="truncate">{event.location}</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 flex-col items-end gap-1">
                                            <span className="flex items-center gap-1 text-xs font-medium">
                                                <Users className="h-3 w-3 text-muted-foreground" />
                                                {event.registrations_count}/{event.capacity}
                                            </span>
                                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                                                <div
                                                    className={`h-full rounded-full transition-all ${
                                                        fillPct >= 90 ? 'bg-rose-500' : fillPct >= 60 ? 'bg-amber-500' : 'bg-emerald-500'
                                                    }`}
                                                    style={{ width: `${fillPct}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </HostLayout>
    );
}
