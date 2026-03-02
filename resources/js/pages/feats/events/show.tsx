import { router } from '@inertiajs/react';
import { CircleUser, Star } from 'lucide-react';
import { useEffect } from 'react';

import Header from '@/components/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface Event {
    id: number;
    title: string;
    description: string;
    image: string;
    location: string;
    start_date: string;
    capacity: number;
    price: number;
    available_spots: number;
    tags?: string[];
}

export default function EventDetailPage({ event }: { event: Event }) {
    const taken = event.capacity - event.available_spots;
    const fillPct = event.capacity > 0 ? Math.min(100, (taken / event.capacity) * 100) : 0;
    const isAlmostFull = event.capacity > 0 && event.available_spots / event.capacity < 0.2;
    const isFull = event.available_spots <= 0;

    // Real-time polling: reload just the event prop every 15 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['event'] });
        }, 15_000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <Header />
            <div className="px-10 py-10">
                {/* Hero Image */}
                <div className="relative">
                    <img src={`/storage/${event.image}`} alt={event.title} className="h-[420px] w-full rounded-2xl object-cover" />

                    <div className="absolute bottom-6 left-6 rounded-xl bg-white/90 px-4 py-2 shadow backdrop-blur-md">
                        <span className="text-sm font-medium text-muted-foreground">{event.location}</span>
                    </div>
                </div>

                {/* Title + Rating */}
                <div className="mt-8 space-y-3">
                    <h1 className="text-4xl font-bold tracking-tight">{event.title}</h1>

                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="font-medium text-foreground">4.9</span>
                        </div>
                        <span>•</span>
                        <span>120 reviews</span>
                        <span>•</span>
                        <span>{event.location}</span>
                    </div>
                </div>

                {/* Booking Card */}
                <Card className="sticky top-24 mt-6 rounded-2xl shadow-lg">
                    <CardContent className="space-y-5 p-6">
                        {/* Price + Spots badge */}
                        <div className="flex items-baseline justify-between">
                            <div>
                                {event.price > 0 ? (
                                    <>
                                        <span className="text-2xl font-bold">{event.price.toLocaleString()} MMK</span>
                                        <span className="text-sm text-muted-foreground"> / guest</span>
                                    </>
                                ) : (
                                    <span className="text-2xl font-bold text-green-600">Free</span>
                                )}
                            </div>
                            {isFull ? (
                                <Badge variant="destructive">Event Full</Badge>
                            ) : isAlmostFull ? (
                                <Badge variant="destructive" className="animate-pulse">
                                    Filling up fast 🔥
                                </Badge>
                            ) : (
                                <Badge variant="secondary">{event.available_spots} spots left</Badge>
                            )}
                        </div>

                        <Separator />

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Date</span>
                                <span className="font-medium">{event.start_date}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Capacity</span>
                                <span className="font-medium">
                                    {event.available_spots} / {event.capacity} left
                                </span>
                            </div>
                        </div>

                        {/* Animated Progress Bar */}
                        <div className="overflow-hidden rounded-full bg-muted" style={{ height: '8px' }}>
                            <div
                                className="h-full rounded-full bg-primary transition-all duration-700 ease-in-out"
                                style={{ width: `${fillPct}%` }}
                            />
                        </div>

                        {/* Tags */}
                        {event.tags && event.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {event.tags.map((tag) => (
                                    <Badge key={tag} variant="outline">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        <Button size="lg" className="w-full rounded-xl" disabled={isFull}>
                            {isFull ? 'Event Full' : 'Join Event'}
                        </Button>
                    </CardContent>
                </Card>

                {/* Host */}
                <div className="mt-12 flex items-start gap-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <CircleUser className="h-8 w-8" />
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold">Hosted by Aung Pyae</h3>
                        <p className="mt-2 max-w-xl text-muted-foreground">Fullstack Developer</p>

                        <Button variant="outline" size="sm" className="mt-4 rounded-xl">
                            Message Host
                        </Button>
                    </div>
                </div>

                {/* Location */}
                <div className="mt-16 space-y-4">
                    <h2 className="text-2xl font-semibold">Where we'll meet</h2>

                    <p className="text-muted-foreground">{event.location}</p>

                    <div className="overflow-hidden rounded-2xl shadow-sm">
                        <iframe
                            src={`https://www.google.com/maps?q=${encodeURIComponent(event.location)}&output=embed`}
                            className="h-[350px] w-full"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
