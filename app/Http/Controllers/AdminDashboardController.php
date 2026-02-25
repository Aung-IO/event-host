<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
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
        $users = User::select('id', 'name', 'email', 'role', 'avatar', 'created_at')
            ->latest('id')
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

    /**
     * Change a user's role.
     */
    public function changeRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => ['required', 'in:user,host,admin'],
        ]);

        // Prevent changing one's own role from the UI
        if ($user->id === auth()->id()) {
            return back()->withErrors(['role' => 'You cannot change your own role.']);
        }

        $user->update(['role' => $validated['role']]);

        return back()->with('success', "Role updated to {$validated['role']} for {$user->name}.");
    }
}
