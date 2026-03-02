<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\Auth\RegisterUserController;
use App\Http\Controllers\Auth\SessionsController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\HostDashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('welcome');

// Public event routes — viewable by everyone
Route::get('events', [EventController::class, 'index'])
    ->name('events.index');

Route::get('events/{event}', [EventController::class, 'show'])
    ->name('events.show');

Route::middleware('guest')->group(function () {

    Route::get('login', [SessionsController::class, 'create'])
        ->name('login.create');

    Route::post('login', [SessionsController::class, 'store'])
        ->name('login.store');

    Route::get('register', [RegisterUserController::class, 'create'])
        ->name('register.create');

    Route::post('register', [RegisterUserController::class, 'store'])
        ->name('register.store');
});

Route::middleware('auth')->group(function () {
    Route::delete('logout', [SessionsController::class, 'destroy'])
        ->name('logout');

    // Shared profile mutation routes — accessible by all authenticated users
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar');
    Route::patch('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');

    // Admin routes — only accessible by admin role
    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])
            ->name('dashboard');                              // → admin.dashboard
        Route::get('/users', [AdminDashboardController::class, 'users'])
            ->name('users');                                  // → admin.users
        Route::post('/users/{user}/reset-password', [AdminDashboardController::class, 'resetPassword'])
            ->name('users.reset-password');                   // → admin.users.reset-password
        Route::post('/users/{user}/change-role', [AdminDashboardController::class, 'changeRole'])
            ->name('users.change-role');                      // → admin.users.change-role
        Route::get('/profile', [ProfileController::class, 'showAdmin'])
            ->name('profile');                                // → admin.profile
    });

    // Host routes — only accessible by host role
    Route::middleware('host')->prefix('host')->name('host.')->group(function () {
        Route::get('/dashboard', [HostDashboardController::class, 'index'])
            ->name('dashboard');                              // → host.dashboard
        Route::resource('events', EventController::class);   // → host.events.*
        Route::get('/my-events', [EventController::class, 'myEvents'])
            ->name('my-events');                              // → host.my-events
        Route::get('/profile', [ProfileController::class, 'showHost'])
            ->name('profile');                                // → host.profile
    });

    // User routes — accessible by regular users
    Route::prefix('user')->name('user.')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('feats/user/dashboard');
        })->name('dashboard');                                // → user.dashboard
        Route::get('/profile', [ProfileController::class, 'showUser'])
            ->name('profile');                                // → user.profile
    });
});
