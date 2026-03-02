import { Link } from '@inertiajs/react';
import { CalendarDays, MapPin } from 'lucide-react';

import Header from '@/components/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import events from '@/routes/events';

interface Registration {
    id: number;
    joined_at: string;
    event: {
        id: number;
        title: string;
        location: string;
        start_date: string;
        image: string;
        status: string;
    };
}

export default function MyRegistrations({ registrations }: { registrations: Registration[] }) {
    return (
        <div className="min-h-screen">
            <Header />
            <div className="mx-auto max-w-3xl px-6 py-10">
                <h1 className="mb-6 text-3xl font-bold tracking-tight">My Registered Events</h1>

                {registrations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center text-muted-foreground">
                        <CalendarDays className="h-12 w-12 opacity-30" />
                        <p className="text-lg">You haven't joined any events yet.</p>
                        <Button asChild>
                            <Link href={events.index.url()}>Browse Events</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {registrations.map((reg) => (
                            <Card key={reg.id} className="overflow-hidden rounded-2xl">
                                <CardContent className="flex items-start gap-4 p-4">
                                    <img
                                        src={`/storage/${reg.event.image}`}
                                        alt={reg.event.title}
                                        className="h-24 w-32 flex-shrink-0 rounded-xl object-cover"
                                    />

                                    <div className="flex-1 space-y-1.5">
                                        <div className="flex items-start justify-between gap-2">
                                            <h2 className="text-lg leading-snug font-semibold">{reg.event.title}</h2>
                                            <Badge variant="secondary" className="shrink-0 bg-green-100 text-green-700">
                                                Joined ✓
                                            </Badge>
                                        </div>

                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <MapPin className="h-3.5 w-3.5" />
                                            <span>{reg.event.location}</span>
                                        </div>

                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <CalendarDays className="h-3.5 w-3.5" />
                                            <span>{reg.event.start_date}</span>
                                        </div>
                                    </div>

                                    <Button asChild variant="outline" size="sm" className="shrink-0 rounded-xl">
                                        <Link href={events.show.url(reg.event.id)}>View</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
