<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventRegistration;
use Inertia\Inertia;

class EventRegistrationController extends Controller
{
    /**
     * List all events the authenticated user has joined.
     */
    public function index()
    {
        $registrations = EventRegistration::with(['event'])
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('feats/user/my-registrations', [
            'registrations' => $registrations,
        ]);
    }

    /**
     * Join an event.
     */
    public function store(Event $event)
    {
        $user = auth()->user();

        // Load registration count so available_spots accessor works
        $event->loadCount('registrations');

        // Prevent joining if event is full
        if ($event->available_spots <= 0) {
            return back()->withErrors(['join' => 'This event is already full.']);
        }

        // Prevent duplicate registration (also enforced at DB level)
        $alreadyJoined = EventRegistration::where('event_id', $event->id)
            ->where('user_id', $user->id)
            ->exists();

        if ($alreadyJoined) {
            return back()->withErrors(['join' => 'You have already joined this event.']);
        }

        EventRegistration::create([
            'event_id' => $event->id,
            'user_id' => $user->id,
            'joined_at' => now(),
        ]);

        return back()->with('success', 'You have successfully joined the event!');
    }

    /**
     * Leave an event.
     */
    public function destroy(Event $event)
    {
        $deleted = EventRegistration::where('event_id', $event->id)
            ->where('user_id', auth()->id())
            ->delete();

        if (! $deleted) {
            return back()->withErrors(['leave' => 'You are not registered for this event.']);
        }

        return back()->with('success', 'You have left the event.');
    }
}
