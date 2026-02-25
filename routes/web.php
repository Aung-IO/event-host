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

    // Admin Dashboard - Only accessible by admin role
    Route::middleware('admin')->group(function () {
        Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])
            ->name('admin.dashboard');
        Route::get('/admin/users', [AdminDashboardController::class, 'users'])
            ->name('admin.users');
        Route::post('/admin/users/{user}/reset-password', [AdminDashboardController::class, 'resetPassword'])
            ->name('admin.users.reset-password');
        Route::post('/admin/users/{user}/change-role', [AdminDashboardController::class, 'changeRole'])
            ->name('admin.users.change-role');
    });

    // Host Dashboard - Only accessible by host role
    Route::middleware('host')->prefix('host')->name('host.')->group(function () {
        Route::get('/dashboard', [HostDashboardController::class, 'index'])
            ->name('dashboard');                          // → host.dashboard
        Route::resource('events', EventController::class); // → host.events.*
        Route::get('/my-events', [EventController::class, 'myEvents'])
            ->name('my-events');
        
    });

    // User Dashboard - Accessible by all authenticated users
    Route::get('/dashboard', function () {
        return Inertia::render('feats/user/dashboard');
    })->name('dashboard');

    // Profile routes - accessible by all authenticated users
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar');
    Route::patch('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');
});
