<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventRegistration;
use Inertia\Inertia;
use Inertia\Response;

class HostDashboardController extends Controller
{
    /**
     * Display the host dashboard.
     */
    public function index(): Response
    {
        $hostId = auth()->id();

        $totalEvents    = Event::where('host_id', $hostId)->count();
        $approvedEvents = Event::where('host_id', $hostId)->where('status', 'approved')->count();
        $pendingEvents  = Event::where('host_id', $hostId)->where('status', 'pending')->count();
        $rejectedEvents = Event::where('host_id', $hostId)->where('status', 'rejected')->count();

        $totalRegistrations = EventRegistration::whereHas(
            'event', fn ($q) => $q->where('host_id', $hostId)
        )->count();

        $upcomingEvents = Event::where('host_id', $hostId)
            ->where('status', 'approved')
            ->where('start_date', '>=', now())
            ->withCount('registrations')
            ->orderBy('start_date')
            ->limit(5)
            ->get(['id', 'title', 'start_date', 'location', 'capacity']);

        return Inertia::render('feats/host/host-dashboard', [
            'stats' => [
                'totalEvents'        => $totalEvents,
                'approvedEvents'     => $approvedEvents,
                'pendingEvents'      => $pendingEvents,
                'rejectedEvents'     => $rejectedEvents,
                'totalRegistrations' => $totalRegistrations,
            ],
            'upcomingEvents' => $upcomingEvents,
        ]);
    }
}
