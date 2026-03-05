import { Link, router, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Ban, Calendar, Clock, Pencil, Trash2 } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { show as showEvent } from '@/routes/events';
import hostEvents from '@/routes/host/events';
import { type CardEvent } from '@/types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface CardPageProps {
    auth?: { user?: { id: number; role: string } | null };
    [key: string]: unknown;
}

interface EventCardProps {
    event: CardEvent;
}

export default function EventCard({ event }: EventCardProps) {
    const { auth } = usePage<CardPageProps>().props;
    const isOwner = auth?.user?.id === event.host_id;

    function handleDelete(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this event?')) {
            router.delete(hostEvents.destroy(event.id).url);
        }
    }

    const isSoldOut = event.available_spots === 0;

    return (
        <Link href={showEvent(event.id).url}>
            <Card key={event.id} className="relative transition hover:shadow-lg">
                {/* Sold Out overlay badge */}
                {isSoldOut && (
                    <div className="absolute top-3 right-3 z-10">
                        <Badge variant="destructive" className="flex items-center gap-1 px-2 py-1 text-xs font-semibold shadow">
                            <Ban className="h-3 w-3" />
                            Sold Out
                        </Badge>
                    </div>
                )}

                <CardHeader>
                    {event.tags && event.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {event.tags.map((tag: string) => (
                                <Badge key={tag}>{tag}</Badge>
                            ))}
                        </div>
                    )}
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription className={cn('pt-0 text-xs')}>Aung Pyae Kyaw | Frontend Developer</CardDescription>
                </CardHeader>

                <CardContent className={cn('space-y-2')}>
                    <p className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        {format(event.start_date, 'MMM dd, yyyy')} - {format(event.end_date, 'MMM dd, yyyy')}
                    </p>
                    <p className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4" />
                        {format(event.start_date, 'hh:mm a')} - {format(event.end_date, 'hh:mm a')}
                    </p>
                    <p className="text-sm text-muted-foreground">{event.location}</p>

                    {/* Spots indicator */}
                    {!isSoldOut && typeof event.available_spots === 'number' && (
                        <p className="text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">{event.available_spots}</span> spot{event.available_spots !== 1 ? 's' : ''}{' '}
                            left
                        </p>
                    )}

                    <Button
                        className={cn('mt-4 w-full', isSoldOut && 'cursor-not-allowed opacity-60')}
                        variant={isSoldOut ? 'outline' : 'default'}
                        disabled={isSoldOut}
                    >
                        {isSoldOut ? 'Sold Out' : 'View Details'}
                    </Button>

                    {isOwner && (
                        <div className="mt-4 flex justify-end gap-1">
                            <Link href={hostEvents.edit(event.id).url} onClick={(e) => e.stopPropagation()}>
                                <Button size="icon" variant="secondary" className="h-7 w-7">
                                    <Pencil className="h-3.5 w-3.5" />
                                </Button>
                            </Link>
                            <Button size="icon" variant="destructive" className="h-7 w-7" onClick={handleDelete}>
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}
