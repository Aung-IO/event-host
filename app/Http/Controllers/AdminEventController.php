<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminEventController extends Controller
{
    /**
     * List all pending events for admin review.
     */
    public function index(): Response
    {
        $pendingEvents = Event::where('status', 'pending')
            ->with('user:id,name,email,avatar')
            ->latest()
            ->get();

        $pendingCount = $pendingEvents->count();

        return Inertia::render('feats/admin/event-approvals', [
            'pendingEvents' => $pendingEvents,
            'pendingCount'  => $pendingCount,
        ]);
    }

    /**
     * Approve an event.
     */
    public function approve(Event $event)
    {
        $event->update([
            'status'      => 'approved',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
            'rejected_at' => null,
            'reject_reason' => null,
        ]);

        return back()->with('success', "Event \"{$event->title}\" has been approved.");
    }

    /**
     * Reject an event with a reason.
     */
    public function reject(Request $request, Event $event)
    {
        $validated = $request->validate([
            'reject_reason' => ['required', 'string', 'max:500'],
        ]);

        $event->update([
            'status'        => 'rejected',
            'rejected_at'   => now(),
            'reject_reason' => $validated['reject_reason'],
            'approved_by'   => null,
            'approved_at'   => null,
        ]);

        return back()->with('success', "Event \"{$event->title}\" has been rejected.");
    }
}
