<?php

use App\Models\Event;
use App\Models\User;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function adminUser(): User
{
    return User::factory()->create(['role' => 'admin']);
}

function pendingEvent(User $host): Event
{
    return Event::create([
        'title'       => 'Pending Event',
        'description' => 'Needs review',
        'start_date'  => now()->addDays(5)->toDateString(),
        'end_date'    => now()->addDays(6)->toDateString(),
        'location'    => 'Yangon',
        'capacity'    => 20,
        'price'       => 0,
        'tags'        => [],
        'image'       => 'events/test.jpg',
        'host_id'     => $host->id,
        'status'      => 'pending',
    ]);
}

// ===========================================================================
// Admin Dashboard
// ===========================================================================

describe('Admin Dashboard', function () {
    test('admin can view the admin dashboard', function () {
        $admin = adminUser();

        $response = $this->actingAs($admin)->get(route('admin.dashboard'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('feats/admin/admin-dashboard'));
    });

    test('admin dashboard contains correct stats keys', function () {
        $admin = adminUser();

        $response = $this->actingAs($admin)->get(route('admin.dashboard'));

        $response->assertInertia(
            fn ($page) => $page
                ->has('stats.totalEvents')
                ->has('stats.pendingEvents')
                ->has('stats.approvedEvents')
                ->has('stats.rejectedEvents')
                ->has('stats.totalUsers')
                ->has('stats.totalRegistrations')
                ->has('stats.newUsersThisWeek')
        );
    });

   
});

// ===========================================================================
// Admin Users List
// ===========================================================================

describe('Admin Users List', function () {
    test('admin can view all users', function () {
        $admin = adminUser();
        User::factory()->count(3)->create();

        $response = $this->actingAs($admin)->get(route('admin.users'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('feats/admin/users')->has('users'));
    });

});

// ===========================================================================
// Admin Reset Password
// ===========================================================================

describe('Admin Reset Password', function () {
    test('admin can reset a user\'s password', function () {
        $admin = adminUser();
        $user = User::factory()->create();
        $oldPassword = $user->password;

        $response = $this->actingAs($admin)->post(route('admin.users.reset-password', $user));

        $response->assertRedirect();
        $response->assertSessionHas('resetInfo');
        $this->assertNotEquals($oldPassword, $user->fresh()->password);
    });

    test('reset password response contains name and temp password', function () {
        $admin = adminUser();
        $user = User::factory()->create(['name' => 'Target User']);

        $response = $this->actingAs($admin)->post(route('admin.users.reset-password', $user));

        $response->assertSessionHas('resetInfo.name', 'Target User');
        $response->assertSessionHas('resetInfo.password');
    });

});
