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

    test('non-admin user gets 403 on admin dashboard', function () {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->get(route('admin.dashboard'));

        $response->assertForbidden();
    });

    test('host user gets 403 on admin dashboard', function () {
        $host = User::factory()->create(['role' => 'host']);

        $response = $this->actingAs($host)->get(route('admin.dashboard'));

        $response->assertForbidden();
    });

    test('guest is redirected to login for admin dashboard', function () {
        $response = $this->get(route('admin.dashboard'));

        $response->assertRedirect(route('login.create'));
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

    test('non-admin cannot view users list', function () {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->get(route('admin.users'));

        $response->assertForbidden();
    });

    test('guest is redirected to login for users list', function () {
        $response = $this->get(route('admin.users'));

        $response->assertRedirect(route('login.create'));
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

    test('non-admin cannot reset a user\'s password', function () {
        $actor = User::factory()->create(['role' => 'user']);
        $target = User::factory()->create();

        $response = $this->actingAs($actor)->post(route('admin.users.reset-password', $target));

        $response->assertForbidden();
    });

    test('guest cannot reset a user\'s password', function () {
        $user = User::factory()->create();

        $response = $this->post(route('admin.users.reset-password', $user));

        $response->assertRedirect(route('login.create'));
    });
});
