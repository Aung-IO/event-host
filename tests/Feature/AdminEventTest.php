<?php

use App\Models\Event;
use App\Models\User;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function adminForEvents(): User
{
    return User::factory()->create(['role' => 'admin']);
}

function hostForEvents(): User
{
    return User::factory()->create(['role' => 'host']);
}

function pendingEventForAdmin(User $host, array $overrides = []): Event
{
    return Event::create(array_merge([
        'title'       => 'Pending Admin Event',
        'description' => 'Awaiting approval',
        'start_date'  => now()->addDays(5)->toDateString(),
        'end_date'    => now()->addDays(6)->toDateString(),
        'location'    => 'Yangon',
        'capacity'    => 20,
        'price'       => 0,
        'tags'        => [],
        'image'       => 'events/test.jpg',
        'host_id'     => $host->id,
        'status'      => 'pending',
    ], $overrides));
}

// ===========================================================================
// Admin Event Approvals List
// ===========================================================================

describe('Admin Event Approvals List', function () {
    test('admin can view the pending events list', function () {
        $admin = adminForEvents();

        $response = $this->actingAs($admin)->get(route('admin.events'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('feats/admin/event-approvals'));
    });

    test('pending events list only shows pending events', function () {
        $admin = adminForEvents();
        $host = hostForEvents();
        pendingEventForAdmin($host, ['title' => 'Pending Only']);
        Event::create([
            ...[
                'title' => 'Approved One', 'description' => 'desc',
                'start_date' => now()->addDay()->toDateString(),
                'end_date' => now()->addDays(2)->toDateString(),
                'location' => 'Mandalay', 'capacity' => 10, 'price' => 0,
                'tags' => [], 'image' => 'events/x.jpg', 'host_id' => $host->id,
            ],
            'status' => 'approved',
        ]);

        $response = $this->actingAs($admin)->get(route('admin.events'));

        $response->assertInertia(
            fn ($page) => $page->count('pendingEvents', 1)->where('pendingCount', 1)
        );
    });

   
});

// ===========================================================================
// Approve Event
// ===========================================================================

describe('Admin Approve Event', function () {
    test('admin can approve a pending event', function () {
        $admin = adminForEvents();
        $host = hostForEvents();
        $event = pendingEventForAdmin($host);

        $response = $this->actingAs($admin)->post(route('admin.events.approve', $event));

        $response->assertRedirect();
        $this->assertDatabaseHas('events', [
            'id'          => $event->id,
            'status'      => 'approved',
            'approved_by' => $admin->id,
        ]);
    });

    test('approved event has its rejected fields cleared', function () {
        $admin = adminForEvents();
        $host = hostForEvents();
        $event = pendingEventForAdmin($host, [
            'status'        => 'rejected',
            'reject_reason' => 'Bad content',
        ]);

        $this->actingAs($admin)->post(route('admin.events.approve', $event));

        $this->assertDatabaseHas('events', [
            'id'            => $event->id,
            'status'        => 'approved',
            'reject_reason' => null,
        ]);
    });

   
});

// ===========================================================================
// Reject Event
// ===========================================================================

describe('Admin Reject Event', function () {
    test('admin can reject a pending event with a reason', function () {
        $admin = adminForEvents();
        $host = hostForEvents();
        $event = pendingEventForAdmin($host);

        $response = $this->actingAs($admin)->post(route('admin.events.reject', $event), [
            'reject_reason' => 'Does not meet guidelines.',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('events', [
            'id'            => $event->id,
            'status'        => 'rejected',
            'reject_reason' => 'Does not meet guidelines.',
        ]);
    });

    

});
