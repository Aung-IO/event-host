<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

describe('Profile Page', function () {
    test('authenticated user can view profile page', function () {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('profile.show'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('feats/profile/profile'));
    });

    test('guest is redirected to login when accessing profile', function () {
        $response = $this->get(route('profile.show'));

        $response->assertRedirect(route('login.create'));
    });
});

describe('Profile Update', function () {
    test('user can update their name and email', function () {
        $user = User::factory()->create(['name' => 'Old Name', 'email' => 'old@example.com']);

        $response = $this->actingAs($user)->patch(route('profile.update'), [
            'name'  => 'New Name',
            'email' => 'new@example.com',
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('users', [
            'id'    => $user->id,
            'name'  => 'New Name',
            'email' => 'new@example.com',
        ]);
    });

    test('update fails with email already taken by another user', function () {
        User::factory()->create(['email' => 'taken@example.com']);
        $user = User::factory()->create();

        $response = $this->actingAs($user)->patch(route('profile.update'), [
            'name'  => 'Some Name',
            'email' => 'taken@example.com',
        ]);

        $response->assertSessionHasErrors('email');
    });

    test('user can update email to their own existing email', function () {
        $user = User::factory()->create(['email' => 'mine@example.com']);

        $response = $this->actingAs($user)->patch(route('profile.update'), [
            'name'  => 'Same User',
            'email' => 'mine@example.com',
        ]);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();
    });

    test('update fails when name is missing', function () {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->patch(route('profile.update'), [
            'name'  => '',
            'email' => $user->email,
        ]);

        $response->assertSessionHasErrors('name');
    });
});

describe('Avatar Upload', function () {
    test('user can upload a profile avatar', function () {
        Storage::fake('public');
        $user = User::factory()->create();

        $file = UploadedFile::fake()->image('avatar.jpg', 100, 100);

        $response = $this->actingAs($user)->post(route('profile.avatar'), [
            'avatar' => $file,
        ]);

        $response->assertRedirect();

        $user->refresh();
        $this->assertNotNull($user->avatar);
        Storage::disk('public')->assertExists($user->avatar);
    });

    test('avatar upload fails with non-image file', function () {
        Storage::fake('public');
        $user = User::factory()->create();

        $file = UploadedFile::fake()->create('document.pdf', 100);

        $response = $this->actingAs($user)->post(route('profile.avatar'), [
            'avatar' => $file,
        ]);

        $response->assertSessionHasErrors('avatar');
    });

    test('avatar upload fails when file exceeds 2MB', function () {
        Storage::fake('public');
        $user = User::factory()->create();

        $file = UploadedFile::fake()->image('large.jpg')->size(3000);

        $response = $this->actingAs($user)->post(route('profile.avatar'), [
            'avatar' => $file,
        ]);

        $response->assertSessionHasErrors('avatar');
    });
});

describe('Password Change', function () {
    test('user can change their password with correct current password', function () {
        $user = User::factory()->create([
            'password' => Hash::make('current-password'),
        ]);

        $response = $this->actingAs($user)->patch(route('profile.password'), [
            'current_password'      => 'current-password',
            'password'              => 'new-password-123',
            'password_confirmation' => 'new-password-123',
        ]);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();

        $this->assertTrue(Hash::check('new-password-123', $user->fresh()->password));
    });

    test('password change fails with wrong current password', function () {
        $user = User::factory()->create([
            'password' => Hash::make('correct-password'),
        ]);

        $response = $this->actingAs($user)->patch(route('profile.password'), [
            'current_password'      => 'wrong-password',
            'password'              => 'new-password-123',
            'password_confirmation' => 'new-password-123',
        ]);

        $response->assertSessionHasErrors('current_password');
    });

    test('password change fails when confirmation does not match', function () {
        $user = User::factory()->create([
            'password' => Hash::make('current-password'),
        ]);

        $response = $this->actingAs($user)->patch(route('profile.password'), [
            'current_password'      => 'current-password',
            'password'              => 'new-password-123',
            'password_confirmation' => 'different-password',
        ]);

        $response->assertSessionHasErrors('password');
    });

    test('password change fails when new password is too short', function () {
        $user = User::factory()->create([
            'password' => Hash::make('current-password'),
        ]);

        $response = $this->actingAs($user)->patch(route('profile.password'), [
            'current_password'      => 'current-password',
            'password'              => 'short',
            'password_confirmation' => 'short',
        ]);

        $response->assertSessionHasErrors('password');
    });
});
