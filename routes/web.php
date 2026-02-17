<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\Auth\RegisterUserController;
use App\Http\Controllers\Auth\SessionsController;
use App\Http\Controllers\HostDashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('welcome');

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
    Route::middleware('host')->group(function () {
        Route::get('/host/dashboard', [HostDashboardController::class, 'index'])
            ->name('host.dashboard');
    });

    // User Dashboard - Accessible by all authenticated users
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Protected routes for authenticated users can be defined here
});
