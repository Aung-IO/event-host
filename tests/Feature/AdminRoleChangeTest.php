<?php

use App\Models\User;

describe('Admin Change Role', function () {
    test('admin can change a user role to host', function () {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'user']);

        $this->actingAs($admin)
            ->post(route('admin.users.change-role', $user), ['role' => 'host'])
            ->assertRedirect();

        expect($user->fresh()->role)->toBe('host');
    });

    test('admin can change a host role to user', function () {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'host']);

        $this->actingAs($admin)
            ->post(route('admin.users.change-role', $user), ['role' => 'user'])
            ->assertRedirect();

        expect($user->fresh()->role)->toBe('user');
    });

    test('admin can promote a user to admin', function () {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'user']);

        $this->actingAs($admin)
            ->post(route('admin.users.change-role', $user), ['role' => 'admin'])
            ->assertRedirect();

        expect($user->fresh()->role)->toBe('admin');
    });

    test('admin cannot change their own role', function () {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->post(route('admin.users.change-role', $admin), ['role' => 'user'])
            ->assertRedirect()
            ->assertSessionHasErrors('role');

        expect($admin->fresh()->role)->toBe('admin');
    });

    test('non-admin user gets 403 when trying to change role', function () {
        $actor = User::factory()->create(['role' => 'user']);
        $target = User::factory()->create(['role' => 'user']);

        $this->actingAs($actor)
            ->post(route('admin.users.change-role', $target), ['role' => 'host'])
            ->assertForbidden();
    });

    test('invalid role value returns validation error', function () {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'user']);

        $this->actingAs($admin)
            ->post(route('admin.users.change-role', $user), ['role' => 'superuser'])
            ->assertSessionHasErrors('role');
    });

    test('unauthenticated user is redirected to login', function () {
        $user = User::factory()->create(['role' => 'user']);

        $this->post(route('admin.users.change-role', $user), ['role' => 'host'])
            ->assertRedirect(route('login.create'));
    });
});
