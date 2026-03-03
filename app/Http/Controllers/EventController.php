<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $allEvents = Event::where('status', 'approved')->get();

        return Inertia::render('feats/events/index', [
            'allEvents' => $allEvents,
        ]);
    }

    public function myEvents()
    {
        $myEvents = Event::where('host_id', auth()->id())
            ->latest()
            ->get(['id', 'host_id', 'title', 'description', 'start_date', 'end_date', 'location', 'image', 'capacity', 'price', 'tags', 'status', 'reject_reason', 'created_at']);

        return Inertia::render('feats/events/my-events', [
            'myEvents' => $myEvents,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('feats/events/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validTags = [
            'Music', 'Technology', 'Sports', 'Arts & Culture', 'Food & Drink',
            'Business', 'Health & Wellness', 'Education', 'Networking',
            'Entertainment', 'Outdoor', 'Charity',
        ];

        $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date'],
            'location' => ['required', 'string', 'max:255'],
            'capacity' => ['required', 'integer', 'min:1'],
            'price' => ['required', 'integer', 'min:0'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'in:'.implode(',', $validTags)],
            'image' => ['required', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ]);

        $imagePath = $request->file('image')->store('events', 'public');

        Event::create([
            ...$request->except('image'),
            'image' => $imagePath,
            'host_id' => auth()->id(),
            'status' => 'pending',
        ]);

        return redirect()->route('host.my-events')->with('success', 'Event created! It is pending admin approval.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event)
    {
        $event->loadCount('registrations');
        $event->load('user:id,name,avatar');

        $userRegistered = auth()->check()
            ? $event->registrations()->where('user_id', auth()->id())->exists()
            : false;

        return Inertia::render('feats/events/show', [
            'event' => $event,
            'userRegistered' => $userRegistered,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Event $event)
    {
        return Inertia::render('feats/events/edit', [
            'event' => $event,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Event $event)
    {
        $validTags = [
            'Music', 'Technology', 'Sports', 'Arts & Culture', 'Food & Drink',
            'Business', 'Health & Wellness', 'Education', 'Networking',
            'Entertainment', 'Outdoor', 'Charity',
        ];

        $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date'],
            'location' => ['required', 'string', 'max:255'],
            'capacity' => ['required', 'integer', 'min:1'],
            'price' => ['required', 'integer', 'min:0'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'in:'.implode(',', $validTags)],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ]);

        $data = $request->except('image');

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('events', 'public');
        }

        $event->update($data);

        return redirect()->route('host.my-events');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        $event->delete();

        return redirect()->route('events.index');
    }
}
