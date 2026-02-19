<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\Auth\RegisterUserController;
use App\Http\Controllers\Auth\SessionsController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\HostDashboardController;
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
    });

    // Host Dashboard - Only accessible by host role
    Route::middleware('host')->prefix('host')->name('host.')->group(function () {
        Route::get('/dashboard', [HostDashboardController::class, 'index'])
            ->name('dashboard');                          // → host.dashboard
        Route::resource('events', EventController::class); // → host.events.*
    });

    // User Dashboard - Accessible by all authenticated users
    Route::get('/dashboard', function () {
        return Inertia::render('feats/user/dashboard');
    })->name('dashboard');
    
    // Protected routes for authenticated users can be defined here
});
