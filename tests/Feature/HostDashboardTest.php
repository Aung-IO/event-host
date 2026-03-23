<?php

use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\User;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function hostUser(): User
{
    return User::factory()->create(['role' => 'host']);
}

function hostEvent(User $host, array $overrides = []): Event
{
    return Event::create(array_merge([
        'title'       => 'Host Event',
        'description' => 'Description',
        'start_date'  => now()->addDays(5)->toDateString(),
        'end_date'    => now()->addDays(6)->toDateString(),
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
// Host Dashboard
// ===========================================================================

describe('Host Dashboard', function () {
    test('host can view the host dashboard', function () {
        $host = hostUser();

        $response = $this->actingAs($host)->get(route('host.dashboard'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('feats/host/host-dashboard'));
    });

    test('host dashboard contains correct stats keys', function () {
        $host = hostUser();

        $response = $this->actingAs($host)->get(route('host.dashboard'));

        $response->assertInertia(
            fn ($page) => $page
                ->has('stats.totalEvents')
                ->has('stats.approvedEvents')
                ->has('stats.pendingEvents')
                ->has('stats.rejectedEvents')
                ->has('stats.totalRegistrations')
                ->has('upcomingEvents')
        );
    });

    test('host dashboard stats reflect only the host\'s own events', function () {
        $host1 = hostUser();
        $host2 = hostUser();
        hostEvent($host1, ['status' => 'approved']);
        hostEvent($host1, ['status' => 'pending']);
        hostEvent($host2, ['status' => 'approved']);

        $response = $this->actingAs($host1)->get(route('host.dashboard'));

        $response->assertInertia(
            fn ($page) => $page
                ->where('stats.totalEvents', 2)
                ->where('stats.approvedEvents', 1)
                ->where('stats.pendingEvents', 1)
        );
    });

    test('host dashboard total registrations counts only registrations for host\'s events', function () {
        $host1 = hostUser();
        $host2 = hostUser();
        $event1 = hostEvent($host1);
        $event2 = hostEvent($host2);
        $user = User::factory()->create();

        EventRegistration::create(['event_id' => $event1->id, 'user_id' => $user->id, 'joined_at' => now()]);
        EventRegistration::create(['event_id' => $event2->id, 'user_id' => $user->id, 'joined_at' => now()]);

        $response = $this->actingAs($host1)->get(route('host.dashboard'));

        $response->assertInertia(
            fn ($page) => $page->where('stats.totalRegistrations', 1)
        );
    });

    test('upcoming events in dashboard are ordered by start date', function () {
        $host = hostUser();
        hostEvent($host, ['title' => 'Later Event', 'start_date' => now()->addDays(10)->toDateString(), 'end_date' => now()->addDays(11)->toDateString()]);
        hostEvent($host, ['title' => 'Sooner Event', 'start_date' => now()->addDays(3)->toDateString(), 'end_date' => now()->addDays(4)->toDateString()]);

        $response = $this->actingAs($host)->get(route('host.dashboard'));

        $response->assertInertia(
            fn ($page) => $page->where('upcomingEvents.0.title', 'Sooner Event')
        );
    });

    test('non-host user gets 403 on host dashboard', function () {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->get(route('host.dashboard'));

        $response->assertForbidden();
    });

    test('guest is redirected to login for host dashboard', function () {
        $response = $this->get(route('host.dashboard'));

        $response->assertRedirect(route('login.create'));
    });
});
