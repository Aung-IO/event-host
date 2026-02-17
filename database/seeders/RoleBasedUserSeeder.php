<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RoleBasedUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin User
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        // Create Host User
        User::firstOrCreate(
            ['email' => 'host@example.com'],
            [
                'name' => 'Host User',
                'password' => Hash::make('password'),
                'role' => 'host',
            ]
        );

        // Create Regular User
        User::firstOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'Regular User',
                'password' => Hash::make('password'),
                'role' => 'user',
            ]
        );

        $this->command->info('Test users created successfully!');
        $this->command->info('Admin: admin@example.com / password');
        $this->command->info('Host: host@example.com / password');
        $this->command->info('User: user@example.com / password');
    }
}
