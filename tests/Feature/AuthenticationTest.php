<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

describe('Registration', function () {
    test('user can view registration page', function () {
        $response = $this->get(route('register.create'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('auth/register'));
    });

    test('user can register with valid credentials', function () {
        $response = $this->post(route('register.store'), [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
        ]);

        $response->assertRedirect(route('login.create'));
        
        $this->assertDatabaseHas('users', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
        ]);
    });

    test('user is automatically logged in after registration', function () {
        $this->post(route('register.store'), [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'password' => 'password123',
        ]);

        $this->assertAuthenticated();
    });

    test('registration fails with invalid email', function () {
        $response = $this->post(route('register.store'), [
            'name' => 'John Doe',
            'email' => 'invalid-email',
            'password' => 'password123',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    });

    test('registration fails with duplicate email', function () {
        User::factory()->create(['email' => 'existing@example.com']);

        $response = $this->post(route('register.store'), [
            'name' => 'John Doe',
            'email' => 'existing@example.com',
            'password' => 'password123',
        ]);

        $response->assertSessionHasErrors('email');
    });

    test('registration fails with weak password', function () {
        $response = $this->post(route('register.store'), [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => '123',
        ]);

        $response->assertSessionHasErrors('password');
        $this->assertGuest();
    });

    test('registration fails with missing required fields', function () {
        $response = $this->post(route('register.store'), []);

        $response->assertSessionHasErrors(['name', 'email', 'password']);
        $this->assertGuest();
    });
});

describe('Login', function () {
    test('user can view login page', function () {
        $response = $this->get(route('login.create'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('auth/login'));
    });

    test('user can login with valid credentials', function () {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->post(route('login.store'), [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertRedirect();
        $this->assertAuthenticatedAs($user);
    });

    test('user session is regenerated after login', function () {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        $this->post(route('login.store'), [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $this->assertAuthenticated();
    });

    test('login fails with invalid credentials', function () {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->post(route('login.store'), [
            'email' => 'test@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    });

    test('login fails with non-existent email', function () {
        $response = $this->post(route('login.store'), [
            'email' => 'nonexistent@example.com',
            'password' => 'password123',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    });

    test('login fails with incorrect password', function () {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('correct-password'),
        ]);

        $response = $this->post(route('login.store'), [
            'email' => 'test@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    });
});

describe('Logout', function () {
    test('authenticated user can logout', function () {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->delete(route('logout'));

        $response->assertRedirect(route('welcome'));
        $this->assertGuest();
    });

    test('user is redirected to welcome page after logout', function () {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->delete(route('logout'));

        $response->assertRedirect(route('welcome'));
    });

    test('user session is cleared after logout', function () {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->delete(route('logout'));

        $this->assertGuest();
    });
});
