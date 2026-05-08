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

   

   

    
});
