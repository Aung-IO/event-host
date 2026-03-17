import { Link, useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Calendar, Clock, RefreshCw, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { show as showEvent } from '@/routes/events';
import hostEvents from '@/routes/host/events';
import { type Event } from '@/types';
import HostLayout from '../host/host-layout';

interface Props {
    myEvents: Event[];
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

export default function MyEvents({ myEvents }: { myEvents: Event[] }) {
    const { flash } = usePage<Props>().props;
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

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
                            <EventCard
                                key={event.id}
                                event={event}
                                status={status}
                                confirmDeleteId={confirmDeleteId}
                                setConfirmDeleteId={setConfirmDeleteId}
                            />
                        );
                    })}
                </div>
            </HostLayout>
        </div>
    );
}

// ─── Per-card component so each card has isolated useForm instances ───────────

function EventCard({
    event,
    status,
    confirmDeleteId,
    setConfirmDeleteId,
}: {
    event: Event;
    status: { label: string; className: string };
    confirmDeleteId: number | null;
    setConfirmDeleteId: (id: number | null) => void;
}) {
    const resubmitForm = useForm({});
    const deleteForm = useForm({});

    const handleResubmit = () => {
        resubmitForm.post(`/host/events/${event.id}/resubmit`);
    };

    const handleDelete = () => {
        deleteForm.delete(hostEvents.destroy(event.id).url, {
            onSuccess: () => setConfirmDeleteId(null),
        });
    };

    const isConfirmingDelete = confirmDeleteId === event.id;

    return (
        <Card className={cn('gap-2 overflow-hidden py-0 transition hover:shadow-lg')}>
            {/* Thumbnail */}
            <div className="relative h-36 w-full overflow-hidden">
                <img src={`/storage/${event.image}`} alt={event.title} className="h-full w-full object-cover" />
                {/* Status badge */}
                <div className="absolute top-2 left-2">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${status.className}`}>
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
                <div className="mt-3 mb-2 flex flex-col gap-2">
                    {/* Approved: View button */}
                    {event.status === 'approved' && (
                        <Link href={showEvent(event.id).url}>
                            <Button variant="outline" size="sm" className="w-full text-xs">
                                View
                            </Button>
                        </Link>
                    )}

                    {/* Rejected: Resubmit + Delete */}
                    {event.status === 'rejected' && (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-xs"
                                disabled={resubmitForm.processing}
                                onClick={handleResubmit}
                            >
                                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                                {resubmitForm.processing ? 'Submitting…' : 'Resubmit for Approval'}
                            </Button>

                            {!isConfirmingDelete ? (
                                <Button variant="destructive" size="sm" onClick={() => setConfirmDeleteId(event.id)}>
                                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                    Delete
                                </Button>
                            ) : (
                                <div className="rounded-md border border-red-200 bg-red-50 p-2">
                                    <p className="mb-1.5 text-center text-xs font-medium text-red-700">Delete this event?</p>
                                    <div className="flex gap-1.5">
                                        <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => setConfirmDeleteId(null)}>
                                            Cancel
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="flex-1 bg-red-600 text-xs text-white hover:bg-red-700"
                                            disabled={deleteForm.processing}
                                            onClick={handleDelete}
                                        >
                                            {deleteForm.processing ? 'Deleting…' : 'Confirm'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Edit — always visible except irrelevant for approved which already has View */}
                    <Link href={hostEvents.edit(event.id).url}>
                        <Button variant="outline" size="sm" className="w-full text-xs">
                            Edit
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
