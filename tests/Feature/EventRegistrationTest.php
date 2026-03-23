<?php

use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\User;

// ---------------------------------------------------------------------------
// Helper: create a host user
// ---------------------------------------------------------------------------
function registrationHost(): User
{
    return User::factory()->create(['role' => 'host']);
}

// ---------------------------------------------------------------------------
// Helper: create a persisted approved event
// ---------------------------------------------------------------------------
function registrableEvent(User $host, array $overrides = []): Event
{
    return Event::create(array_merge([
        'title'       => 'Open Event',
        'description' => 'Open for registration',
        'start_date'  => now()->addDays(3)->toDateString(),
        'end_date'    => now()->addDays(4)->toDateString(),
        'location'    => 'Yangon',
        'capacity'    => 10,
        'price'       => 0,
        'tags'        => [],
        'image'       => 'events/test.jpg',
        'host_id'     => $host->id,
        'status'      => 'approved',
    ], $overrides));
}

// ===========================================================================
// Join Event
// ===========================================================================

describe('Join Event', function () {
    test('authenticated user can join an event', function () {
        $host = registrationHost();
        $user = User::factory()->create(['role' => 'user']);
        $event = registrableEvent($host);

        $response = $this->actingAs($user)->post(route('events.join', $event));

        $response->assertRedirect();
        $this->assertDatabaseHas('event_registrations', [
            'event_id' => $event->id,
            'user_id'  => $user->id,
        ]);
    });

    test('guest cannot join an event', function () {
        $host = registrationHost();
        $event = registrableEvent($host);

        $response = $this->post(route('events.join', $event));

        $response->assertRedirect(route('login.create'));
    });

    test('user cannot join the same event twice', function () {
        $host = registrationHost();
        $user = User::factory()->create(['role' => 'user']);
        $event = registrableEvent($host);

        $this->actingAs($user)->post(route('events.join', $event));
        $response = $this->actingAs($user)->post(route('events.join', $event));

        $response->assertSessionHasErrors('join');
        $this->assertDatabaseCount('event_registrations', 1);
    });

    test('user cannot join a full event', function () {
        $host = registrationHost();
        $user = User::factory()->create(['role' => 'user']);
        $event = registrableEvent($host, ['capacity' => 1]);

        // Fill the event
        $otherUser = User::factory()->create();
        EventRegistration::create([
            'event_id'  => $event->id,
            'user_id'   => $otherUser->id,
            'joined_at' => now(),
        ]);

        $response = $this->actingAs($user)->post(route('events.join', $event));

        $response->assertSessionHasErrors('join');
        $this->assertDatabaseMissing('event_registrations', [
            'event_id' => $event->id,
            'user_id'  => $user->id,
        ]);
    });
});

// ===========================================================================
// Leave Event
// ===========================================================================

describe('Leave Event', function () {
    test('user can leave an event they joined', function () {
        $host = registrationHost();
        $user = User::factory()->create(['role' => 'user']);
        $event = registrableEvent($host);

        EventRegistration::create([
            'event_id'  => $event->id,
            'user_id'   => $user->id,
            'joined_at' => now(),
        ]);

        $response = $this->actingAs($user)->delete(route('events.leave', $event));

        $response->assertRedirect();
        $this->assertDatabaseMissing('event_registrations', [
            'event_id' => $event->id,
            'user_id'  => $user->id,
        ]);
    });

    test('user cannot leave an event they never joined', function () {
        $host = registrationHost();
        $user = User::factory()->create(['role' => 'user']);
        $event = registrableEvent($host);

        $response = $this->actingAs($user)->delete(route('events.leave', $event));

        $response->assertSessionHasErrors('leave');
    });

    test('guest cannot leave an event', function () {
        $host = registrationHost();
        $event = registrableEvent($host);

        $response = $this->delete(route('events.leave', $event));

        $response->assertRedirect(route('login.create'));
    });
});

// ===========================================================================
// My Registrations
// ===========================================================================

describe('My Registrations', function () {
    test('authenticated user can view their registrations page', function () {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->get(route('events.my-registrations'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('feats/user/my-registrations'));
    });

    test('my registrations only shows the current user\'s registrations', function () {
        $host = registrationHost();
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $event = registrableEvent($host);

        EventRegistration::create(['event_id' => $event->id, 'user_id' => $user1->id, 'joined_at' => now()]);
        EventRegistration::create(['event_id' => $event->id, 'user_id' => $user2->id, 'joined_at' => now()]);

        $response = $this->actingAs($user1)->get(route('events.my-registrations'));

        $response->assertInertia(fn ($page) => $page->count('registrations', 1));
    });

    test('guest is redirected to login when accessing my registrations', function () {
        $response = $this->get(route('events.my-registrations'));

        $response->assertRedirect(route('login.create'));
    });
});
