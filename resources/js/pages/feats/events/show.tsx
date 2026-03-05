import { router, useForm, usePage } from '@inertiajs/react';
import { formatDate } from 'date-fns';
import { CircleUser, Star } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import Header from '@/components/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import events from '@/routes/events';

interface Host {
    id: number;
    name: string;
    avatar?: string | null;
}

interface Event {
    id: number;
    title: string;
    description: string;
    image: string;
    location: string;
    start_date: string;
    end_date: string;
    capacity: number;
    price: number;
    available_spots: number;
    tags?: string[];
    user?: Host | null;
}

interface AuthUser {
    id: number;
    name: string;
    role: string;
}

interface Props {
    event: Event;
    userRegistered: boolean;
    flash?: { success?: string };
    errors?: { join?: string; leave?: string };
    auth?: { user?: AuthUser | null };
    [key: string]: unknown;
}

export default function EventDetailPage({ event, userRegistered }: { event: Event; userRegistered: boolean }) {
    const { flash, errors, auth } = usePage<Props>().props;

    // Derive role: 'public' for unauthenticated visitors
    const userRole: string = auth?.user?.role ?? 'public';
    const canJoinLeave = userRole === 'user';
    const isSoldOut = event.available_spots === 0;

    const taken = event.capacity - event.available_spots;
    const fillPct = event.capacity > 0 ? Math.min(100, (taken / event.capacity) * 100) : 0;
    const isAlmostFull = event.capacity > 0 && event.available_spots / event.capacity < 0.2;

    const joinForm = useForm({});
    const leaveForm = useForm({});

    // Show Sonner toasts on flash / error
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (errors?.join) toast.error(errors.join);
        if (errors?.leave) toast.error(errors.leave);
    }, [flash, errors]);

    // Real-time polling — reload event + userRegistered every 15 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['event', 'userRegistered'] });
        }, 15_000);
        return () => clearInterval(interval);
    }, []);

    function handleJoin() {
        joinForm.post(events.join.url(event.id));
    }

    function handleLeave() {
        leaveForm.delete(events.leave.url(event.id));
    }

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
                            {userRegistered ? (
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                    You're in ✓
                                </Badge>
                            ) : isSoldOut ? (
                                <Badge variant="destructive" className="font-semibold">
                                    🚫 Sold Out
                                </Badge>
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
                                <span className="font-medium">
                                    {formatDate(event.start_date, 'MMM dd, yyyy')} - {formatDate(event.end_date, 'MMM dd, yyyy')}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Time</span>
                                <span className="font-medium">
                                    {formatDate(event.start_date, 'hh:mm a')} - {formatDate(event.end_date, 'hh:mm a')}
                                </span>
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

                        {/* Join / Leave / Sold Out button — hidden for admin and host roles */}
                        {canJoinLeave && userRegistered ? (
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full rounded-xl border-red-300 text-red-600 hover:bg-red-50"
                                onClick={handleLeave}
                                disabled={leaveForm.processing}
                            >
                                {leaveForm.processing ? 'Leaving…' : 'Leave Event'}
                            </Button>
                        ) : canJoinLeave || userRole === 'public' ? (
                            <Button
                                size="lg"
                                className="w-full rounded-xl"
                                onClick={canJoinLeave && !isSoldOut ? handleJoin : undefined}
                                disabled={isSoldOut || !canJoinLeave || joinForm.processing}
                            >
                                {joinForm.processing ? 'Joining…' : isSoldOut ? 'Sold Out' : 'Join Event'}
                            </Button>
                        ) : null}
                        <p className="text-lg text-muted-foreground text-center">{!canJoinLeave ? 'Please log in to join this event' : ''}</p>
                    </CardContent>
                </Card>

                {/* Host */}
                <div className="mt-12 flex items-start gap-6">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                        {event.user?.avatar ? (
                            <img src={`/storage/${event.user.avatar}`} alt={event.user.name} className="h-full w-full object-cover" />
                        ) : (
                            <CircleUser className="h-8 w-8" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Hosted by {event.user?.name ?? 'Unknown'}</h3>
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
