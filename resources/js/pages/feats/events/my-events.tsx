import { Link, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { show as showEvent } from '@/routes/events';
import hostEvents from '@/routes/host/events';
import HostLayout from '../host/host-layout';
import { cn } from '@/lib/utils';

interface MyEvent {
    id: number;
    host_id: number;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    location: string;
    image: string;
    capacity: number;
    price: number;
    tags?: string[];
    status: 'pending' | 'approved' | 'rejected';
    reject_reason?: string | null;
}

interface Props {
    myEvents: MyEvent[];
    flash?: { success?: string };
    [key: string]: unknown;
}

const statusConfig = {
    pending: {
        label: '🟡 Pending Approval',
        className: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    approved: {
        label: '🟢 Approved',
        className: 'bg-green-100 text-green-800 border-green-300',
    },
    rejected: {
        label: '🔴 Rejected',
        className: 'bg-red-100 text-red-800 border-red-300',
    },
};

export default function MyEvents({ myEvents }: { myEvents: MyEvent[] }) {
    const { flash } = usePage<Props>().props;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success as string);
    }, [flash]);

    return (
        <div>
            <Header />

            <HostLayout>
                {myEvents.length === 0 && (
                    <div className="py-20 text-center text-muted-foreground">
                        <p className="text-lg font-medium">You haven't created any events yet.</p>
                        <p className="mt-1 text-sm">Create your first event to get started!</p>
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {myEvents.map((event) => {
                        const status = statusConfig[event.status] ?? statusConfig.pending;
                        return (
                            <Card key={event.id} className={cn('overflow-hidden transition hover:shadow-lg py-0 gap-2')}>
                                {/* Thumbnail */}
                                <div className="relative h-36 w-full overflow-hidden">
                                    <img src={`/storage/${event.image}`} alt={event.title} className="h-full w-full object-cover" />
                                    {/* Status badge */}
                                    <div className="absolute top-2 left-2">
                                        <span
                                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                                        >
                                            {status.label}
                                        </span>
                                    </div>
                                </div>

                                <CardHeader>
                                    <CardTitle className="text-base">{event.title}</CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-1.5">
                                    <p className="flex items-center text-xs text-muted-foreground">
                                        <Calendar className="mr-1.5 h-3.5 w-3.5" />
                                        {format(event.start_date, 'MMM dd, yyyy')} – {format(event.end_date, 'MMM dd, yyyy')}
                                    </p>
                                    <p className="flex items-center text-xs text-muted-foreground">
                                        <Clock className="mr-1.5 h-3.5 w-3.5" />
                                        {format(event.start_date, 'hh:mm a')} – {format(event.end_date, 'hh:mm a')}
                                    </p>
                                    <p className="text-xs text-muted-foreground">📍 {event.location}</p>

                                    {/* Rejection reason */}
                                    {event.status === 'rejected' && event.reject_reason && (
                                        <div className="mt-2 rounded-md border border-red-200 bg-red-50 p-2.5">
                                            <p className="text-xs font-semibold text-red-700">Rejection reason:</p>
                                            <p className="mt-0.5 text-xs text-red-600">{event.reject_reason}</p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="mt-3 flex gap-2 mb-2">
                                        {event.status === 'approved' && (
                                            <Link href={showEvent(event.id).url} className="flex-1">
                                                <button className="w-full rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted">
                                                    View
                                                </button>
                                            </Link>
                                        )}
                                        <Link href={hostEvents.edit(event.id).url} className="flex-1">
                                            <button className="w-full rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted">Edit</button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </HostLayout>
        </div>
    );
}
