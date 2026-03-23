<?php

use App\Models\Event;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

// ---------------------------------------------------------------------------
// Helper: create a host user
// ---------------------------------------------------------------------------
function makeHost(): User
{
    return User::factory()->create(['role' => 'host']);
}

// ---------------------------------------------------------------------------
// Helper: create a base event payload (without image)
// ---------------------------------------------------------------------------
function eventPayload(array $overrides = []): array
{
    return array_merge([
        'title'       => 'Test Event',
        'description' => 'A test description',
        'start_date'  => now()->addDays(5)->toDateString(),
        'end_date'    => now()->addDays(6)->toDateString(),
        'location'    => 'Yangon',
        'capacity'    => 100,
        'price'       => 0,
        'tags'        => ['Music'],
    ], $overrides);
}

// ---------------------------------------------------------------------------
// Helper: create a persisted approved event owned by a given host
// ---------------------------------------------------------------------------
function approvedEvent(User $host, array $overrides = []): Event
{
    return Event::create(array_merge([
        'title'       => 'Approved Event',
        'description' => 'Description',
        'start_date'  => now()->addDays(3)->toDateString(),
        'end_date'    => now()->addDays(4)->toDateString(),
        'location'    => 'Yangon',
        'capacity'    => 50,
        'price'       => 0,
        'tags'        => [],
        'image'       => 'events/test.jpg',
        'host_id'     => $host->id,
        'status'      => 'approved',
    ], $overrides));
}

// ===========================================================================
// Public Event Routes
// ===========================================================================

describe('Event Index (public)', function () {
    test('anyone can view the events listing page', function () {
        $response = $this->get(route('events.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('feats/events/index'));
    });

    test('events listing only shows approved events', function () {
        $host = makeHost();
        approvedEvent($host, ['title' => 'Approved One']);
        Event::create([
            'title' => 'Pending One', 'description' => 'desc',
            'start_date' => now()->addDay()->toDateString(),
            'end_date' => now()->addDays(2)->toDateString(),
            'location' => 'Mandalay', 'capacity' => 10, 'price' => 0,
            'tags' => [], 'image' => 'events/x.jpg',
            'host_id' => $host->id, 'status' => 'pending',
        ]);

        $response = $this->get(route('events.index'));

        $response->assertInertia(
            fn ($page) => $page
                ->component('feats/events/index')
                ->where('allEvents.0.title', 'Approved One')
                ->count('allEvents', 1)
        );
    });

    test('events listing can be filtered by search term', function () {
        $host = makeHost();
        approvedEvent($host, ['title' => 'Laravel Conference']);
        approvedEvent($host, ['title' => 'PHP Meetup']);

        $response = $this->get(route('events.index', ['search' => 'Laravel']));

        $response->assertInertia(
            fn ($page) => $page->count('allEvents', 1)->where('allEvents.0.title', 'Laravel Conference')
        );
    });

    test('events listing can be filtered by tag', function () {
        $host = makeHost();
        approvedEvent($host, ['title' => 'Music Fest', 'tags' => ['Music']]);
        approvedEvent($host, ['title' => 'Tech Talk', 'tags' => ['Technology']]);

        $response = $this->get(route('events.index', ['tag' => 'Music']));

        $response->assertInertia(
            fn ($page) => $page->count('allEvents', 1)->where('allEvents.0.title', 'Music Fest')
        );
    });

    test('anyone can view an approved event detail page', function () {
        $host = makeHost();
        $event = approvedEvent($host);

        $response = $this->get(route('events.show', $event));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('feats/events/show'));
    });

    test('guest sees userRegistered as false on event show', function () {
        $host = makeHost();
        $event = approvedEvent($host);

        $response = $this->get(route('events.show', $event));

        $response->assertInertia(
            fn ($page) => $page->where('userRegistered', false)
        );
    });
});

// ===========================================================================
// Host Event Routes
// ===========================================================================

describe('Host Event Create', function () {
    test('host can view the create event page', function () {
        $host = makeHost();

        $response = $this->actingAs($host)->get(route('host.events.create'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('feats/events/create'));
    });

    test('non-host user cannot access create event page', function () {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->get(route('host.events.create'));

        $response->assertForbidden();
    });

    test('guest is redirected to login when accessing create event page', function () {
        $response = $this->get(route('host.events.create'));

        $response->assertRedirect(route('login.create'));
    });
});

describe('Host Event Store', function () {
    test('host can create an event with valid data', function () {
        Storage::fake('public');
        $host = makeHost();
        $image = UploadedFile::fake()->image('event.jpg');

        $response = $this->actingAs($host)->post(
            route('host.events.store'),
            array_merge(eventPayload(), ['image' => $image])
        );

        $response->assertRedirect(route('host.my-events'));

        $this->assertDatabaseHas('events', [
            'title'   => 'Test Event',
            'host_id' => $host->id,
            'status'  => 'pending',
        ]);
    });

    test('event store fails with missing required fields', function () {
        $host = makeHost();

        $response = $this->actingAs($host)->post(route('host.events.store'), []);

        $response->assertSessionHasErrors(['title', 'description', 'start_date', 'end_date', 'location', 'capacity', 'price', 'image']);
    });

    test('event store fails with invalid tag', function () {
        Storage::fake('public');
        $host = makeHost();
        $image = UploadedFile::fake()->image('event.jpg');

        $response = $this->actingAs($host)->post(
            route('host.events.store'),
            array_merge(eventPayload(['tags' => ['InvalidTag']]), ['image' => $image])
        );

        $response->assertSessionHasErrors('tags.0');
    });

    test('event store fails when image is not an image file', function () {
        $host = makeHost();
        $file = UploadedFile::fake()->create('document.pdf', 100);

        $response = $this->actingAs($host)->post(
            route('host.events.store'),
            array_merge(eventPayload(), ['image' => $file])
        );

        $response->assertSessionHasErrors('image');
    });

    test('event store fails when image exceeds 2MB', function () {
        $host = makeHost();
        $file = UploadedFile::fake()->image('large.jpg')->size(3000);

        $response = $this->actingAs($host)->post(
            route('host.events.store'),
            array_merge(eventPayload(), ['image' => $file])
        );

        $response->assertSessionHasErrors('image');
    });

    test('non-host cannot create an event', function () {
        Storage::fake('public');
        $user = User::factory()->create(['role' => 'user']);
        $image = UploadedFile::fake()->image('event.jpg');

        $response = $this->actingAs($user)->post(
            route('host.events.store'),
            array_merge(eventPayload(), ['image' => $image])
        );

        $response->assertForbidden();
    });
});

describe('Host Event Edit & Update', function () {
    test('host can view the edit page for their own event', function () {
        $host = makeHost();
        $event = approvedEvent($host);

        $response = $this->actingAs($host)->get(route('host.events.edit', $event));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('feats/events/edit'));
    });

    test('host can update their event', function () {
        Storage::fake('public');
        $host = makeHost();
        $event = approvedEvent($host);

        $response = $this->actingAs($host)->put(
            route('host.events.update', $event),
            eventPayload(['title' => 'Updated Title'])
        );

        $response->assertRedirect(route('host.my-events'));
        $this->assertDatabaseHas('events', ['id' => $event->id, 'title' => 'Updated Title']);
    });

    test('host can update event with a new image', function () {
        Storage::fake('public');
        $host = makeHost();
        $event = approvedEvent($host);
        $newImage = UploadedFile::fake()->image('new.jpg');

        $response = $this->actingAs($host)->put(
            route('host.events.update', $event),
            array_merge(eventPayload(['title' => 'With New Image']), ['image' => $newImage])
        );

        $response->assertRedirect(route('host.my-events'));
        $event->refresh();
        Storage::disk('public')->assertExists($event->image);
    });

    test('event update fails with missing required fields', function () {
        $host = makeHost();
        $event = approvedEvent($host);

        $response = $this->actingAs($host)->put(
            route('host.events.update', $event),
            ['title' => '']
        );

        $response->assertSessionHasErrors('title');
    });
});

describe('Host My Events', function () {
    test('host can view their my-events page', function () {
        $host = makeHost();

        $response = $this->actingAs($host)->get(route('host.my-events'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('feats/events/my-events'));
    });

    test('my-events only shows events belonging to the host', function () {
        $host1 = makeHost();
        $host2 = makeHost();
        approvedEvent($host1, ['title' => 'Host 1 Event']);
        approvedEvent($host2, ['title' => 'Host 2 Event']);

        $response = $this->actingAs($host1)->get(route('host.my-events'));

        $response->assertInertia(
            fn ($page) => $page
                ->count('myEvents', 1)
                ->where('myEvents.0.title', 'Host 1 Event')
        );
    });
});

describe('Host Event Resubmit', function () {
    test('host can resubmit a rejected event', function () {
        $host = makeHost();
        $event = approvedEvent($host, ['status' => 'rejected', 'reject_reason' => 'Bad content']);

        $response = $this->actingAs($host)->post(route('host.events.resubmit', $event));

        $response->assertRedirect(route('host.my-events'));
        $this->assertDatabaseHas('events', ['id' => $event->id, 'status' => 'pending', 'reject_reason' => null]);
    });

    test('host cannot resubmit a non-rejected event', function () {
        $host = makeHost();
        $event = approvedEvent($host, ['status' => 'pending']);

        $response = $this->actingAs($host)->post(route('host.events.resubmit', $event));

        $response->assertStatus(422);
    });

    test('host cannot resubmit another host\'s event', function () {
        $host1 = makeHost();
        $host2 = makeHost();
        $event = approvedEvent($host1, ['status' => 'rejected']);

        $response = $this->actingAs($host2)->post(route('host.events.resubmit', $event));

        $response->assertForbidden();
    });
});

describe('Host Event Delete', function () {
    test('host can delete their own event', function () {
        $host = makeHost();
        $event = approvedEvent($host);

        $response = $this->actingAs($host)->delete(route('host.events.destroy', $event));

        $response->assertRedirect(route('host.my-events'));
        $this->assertDatabaseMissing('events', ['id' => $event->id]);
    });

    test('host cannot delete another host\'s event', function () {
        $host1 = makeHost();
        $host2 = makeHost();
        $event = approvedEvent($host1);

        $response = $this->actingAs($host2)->delete(route('host.events.destroy', $event));

        $response->assertForbidden();
        $this->assertDatabaseHas('events', ['id' => $event->id]);
    });

    test('non-host cannot delete events', function () {
        $host = makeHost();
        $user = User::factory()->create(['role' => 'user']);
        $event = approvedEvent($host);

        $response = $this->actingAs($user)->delete(route('host.events.destroy', $event));

        $response->assertForbidden();
    });
});
