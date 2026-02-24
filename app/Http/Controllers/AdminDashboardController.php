<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(): Response
    {
        return Inertia::render('feats/admin/admin-dashboard');
    }

    /**
     * List all non-admin users.
     */
    public function users(): Response
    {
        $users = User::where('role', '!=', 'admin')
            ->select('id', 'name', 'email', 'role', 'avatar', 'created_at')
            ->latest()
            ->get();

        return Inertia::render('feats/admin/users', ['users' => $users]);
    }

    /**
     * Generate and set a temporary password for a user.
     */
    public function resetPassword(User $user)
    {
        $temp = Str::random(10);

        $user->update(['password' => Hash::make($temp)]);

        return back()->with('resetInfo', [
            'name' => $user->name,
            'password' => $temp,
        ]);
    }
}
