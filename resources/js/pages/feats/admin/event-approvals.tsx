import { useForm, usePage } from '@inertiajs/react';
import { formatDate } from 'date-fns';
import { AlertCircle, CheckCircle2, CircleUser, Clock, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import Header from '@/components/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import adminEvents from '@/routes/admin/events';
import { type Event } from '@/types';
import AdminLayout from './admin-layout';

interface Props {
    pendingEvents: Event[];
    pendingCount: number;
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

export default function EventApprovals() {
    const { pendingEvents, pendingCount, flash } = usePage<Props>().props;

    const [rejectTarget, setRejectTarget] = useState<Event | null>(null);

    const approveForm = useForm({});
    const rejectForm = useForm({ reject_reason: '' });

    useEffect(() => {
        if (flash?.success) toast.success(flash.success as string);
        if (flash?.error) toast.error(flash.error as string);
    }, [flash]);

    function handleApprove(event: Event) {
        approveForm.post(adminEvents.approve.url(event.id), {
            preserveScroll: true,
        });
    }

    function openRejectSheet(event: Event) {
        setRejectTarget(event);
        rejectForm.reset();
    }

    function handleRejectSubmit() {
        if (!rejectTarget) return;
        rejectForm.post(adminEvents.reject.url(rejectTarget.id), {
            preserveScroll: true,
            onSuccess: () => {
                setRejectTarget(null);
                rejectForm.reset();
            },
        });
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">
            <Header />

            <AdminLayout pendingCount={pendingCount}>
                {/* Page header */}
                <div className="mb-8">
                    <div className="mb-2 flex items-center gap-3">
                        <h1 className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
                            Event Approvals
                        </h1>
                        {pendingCount > 0 && <Badge className="bg-amber-500 text-white">{pendingCount} pending</Badge>}
                    </div>
                    <p className="text-slate-600">Review and approve or reject event submissions from hosts.</p>
                </div>

                {/* Empty state */}
                {pendingEvents.length === 0 && (
                    <Card className="bg-white/80 backdrop-blur">
                        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                            <CheckCircle2 className="mb-4 h-16 w-16 text-green-400" />
                            <h2 className="text-xl font-semibold text-slate-700">All caught up!</h2>
                            <p className="mt-1 text-slate-500">No events are waiting for approval.</p>
                        </CardContent>
                    </Card>
                )}

                {/* Pending events list */}
                <div className="space-y-4">
                    {pendingEvents.map((event) => (
                        <Card key={event.id} className="overflow-hidden bg-white/80 shadow-sm backdrop-blur transition-shadow hover:shadow-md">
                            <div className="flex flex-col md:flex-row">
                                {/* Thumbnail */}
                                <div className="relative h-48 w-full shrink-0 md:h-auto md:w-52">
                                    <img src={`/storage/${event.image}`} alt={event.title} className="h-full w-full object-cover" />
                                    <div className="absolute top-2 left-2">
                                        <Badge className="bg-amber-500 text-white">
                                            <Clock className="mr-1 h-3 w-3" /> Pending
                                        </Badge>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex flex-1 flex-col justify-between p-5">
                                    <div>
                                        <div className="mb-1 flex flex-wrap items-start justify-between gap-2">
                                            <h2 className="text-xl font-bold text-slate-800">{event.title}</h2>
                                            <span className="text-xs text-slate-400">
                                                Submitted {event.created_at ? formatDate(event.created_at, 'MMM dd, yyyy') : '—'}
                                            </span>
                                        </div>

                                        {/* Host info */}
                                        <div className="mb-3 flex items-center gap-2">
                                            <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                                                {event.user?.avatar ? (
                                                    <img
                                                        src={`/storage/${event.user.avatar}`}
                                                        alt={event.user.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <CircleUser className="h-4 w-4" />
                                                )}
                                            </div>
                                            <span className="text-sm text-slate-600">
                                                <span className="font-medium">{event.user?.name ?? 'Unknown'}</span>
                                                <span className="ml-1 text-muted-foreground">({event.user?.email})</span>
                                            </span>
                                        </div>

                                        <p className="mb-3 line-clamp-2 text-sm text-slate-600">{event.description}</p>

                                        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                                            <span>📍 {event.location}</span>
                                            <span>
                                                📅 {formatDate(event.start_date, 'MMM dd, yyyy')} – {formatDate(event.end_date, 'MMM dd, yyyy')}
                                            </span>
                                            <span>👥 Capacity: {event.capacity}</span>
                                            <span>💰 {event.price > 0 ? `${event.price.toLocaleString()} MMK` : 'Free'}</span>
                                        </div>

                                        {event.tags && event.tags.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-1.5">
                                                {event.tags.map((tag) => (
                                                    <Badge key={tag} variant="outline" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-4 flex gap-3">
                                        <Button
                                            className="bg-green-600 hover:bg-green-700"
                                            onClick={() => handleApprove(event)}
                                            disabled={approveForm.processing}
                                        >
                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                            {approveForm.processing ? 'Approving…' : 'Approve'}
                                        </Button>
                                        <Button variant="destructive" onClick={() => openRejectSheet(event)}>
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Reject side sheet */}
                <Sheet
                    open={!!rejectTarget}
                    onOpenChange={(open: boolean) => {
                        if (!open) {
                            setRejectTarget(null);
                            rejectForm.reset();
                        }
                    }}
                >
                    <SheetContent side="right" className="w-full max-w-md">
                        <SheetHeader>
                            <SheetTitle className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-destructive" />
                                Reject Event
                            </SheetTitle>
                            <SheetDescription>
                                You are rejecting <span className="font-semibold">"{rejectTarget?.title}"</span>. Please provide a reason so the host
                                can improve their submission.
                            </SheetDescription>
                        </SheetHeader>

                        <div className="px-4 py-4">
                            <Textarea
                                id="reject_reason"
                                placeholder="e.g. Missing venue details, inappropriate content, incomplete description…"
                                rows={5}
                                value={rejectForm.data.reject_reason}
                                onChange={(e) => rejectForm.setData('reject_reason', e.target.value)}
                            />
                            {rejectForm.errors.reject_reason && <p className="mt-1 text-sm text-destructive">{rejectForm.errors.reject_reason}</p>}
                        </div>

                        <SheetFooter className="flex gap-2 px-4">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                    setRejectTarget(null);
                                    rejectForm.reset();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                className="flex-1"
                                onClick={handleRejectSubmit}
                                disabled={rejectForm.processing || !rejectForm.data.reject_reason.trim()}
                            >
                                {rejectForm.processing ? 'Rejecting…' : 'Confirm Reject'}
                            </Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </AdminLayout>
        </div>
    );
}
