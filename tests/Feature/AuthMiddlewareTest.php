<?php

use App\Models\User;

describe('Auth Middleware', function () {
    test('unauthenticated user cannot access dashboard', function () {
        $response = $this->get(route('dashboard'));

        $response->assertRedirect(route('login.create'));
    });

    test('unauthenticated user is redirected to login page', function () {
        $response = $this->get(route('dashboard'));

        $response->assertRedirect(route('login.create'));
        $this->assertGuest();
    });

    test('authenticated user can access dashboard', function () {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('dashboard'));
    });

    test('authenticated user can access protected routes', function () {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('dashboard'));

        $response->assertOk();
        $this->assertAuthenticatedAs($user);
    });
});

describe('Guest Middleware', function () {
    test('authenticated user cannot access login page', function () {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('login.create'));

        $response->assertRedirect(route('welcome'));
    });

    test('authenticated user cannot access register page', function () {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('register.create'));

        $response->assertRedirect(route('welcome'));
    });

    test('authenticated user is redirected to welcome page', function () {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('login.create'));

        $response->assertRedirect(route('welcome'));
        $this->assertAuthenticatedAs($user);
    });

    test('unauthenticated user can access login page', function () {
        $response = $this->get(route('login.create'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('auth/login'));
    });

    test('unauthenticated user can access register page', function () {
        $response = $this->get(route('register.create'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('auth/register'));
    });
});
