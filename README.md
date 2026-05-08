# 🎉 Event Host

A full-stack event management platform built with **Laravel 12**, **Inertia.js**, and **React 19**. The app supports three roles — **Admin**, **Host**, and **User** — each with dedicated dashboards and workflows.

---

## 🗂️ Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Backend    | PHP 8.2+, Laravel 12, Inertia.js 2      |
| Frontend   | React 19, TypeScript, Tailwind CSS v4   |
| UI         | shadcn/ui, Radix UI, Lucide React       |
| Database   | SQLite (default) / MySQL                |
| Build Tool | Vite 7                                  |
| Testing    | Pest (PHP), Vitest (JS)                 |

---

## ✨ Features

- **Role-based access control** — `admin`, `host`, `user`
- **Public event listing** — browse and join approved events
- **Host dashboard** — create, edit, delete events with image upload, tags, pricing, and capacity
- **Admin dashboard** — approve/reject events, manage users, reset passwords
- **User dashboard** — view and manage event registrations
- **Profile management** — update name, email, avatar, and password
- **SQLite out of the box** — no database server required for development

---

## ⚙️ Prerequisites

Make sure you have the following installed before cloning:

- **PHP** `>= 8.2` — [php.net](https://www.php.net/downloads)
- **Composer** `>= 2` — [getcomposer.org](https://getcomposer.org/)
- **Node.js** `>= 20` — [nodejs.org](https://nodejs.org/)
- **npm** or **bun** (bun recommended)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Aung-IO/event-host.git
cd event-host
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install Node Dependencies

```bash
npm install
# or
bun install
```

### 4. Set Up Environment

```bash
cp .env.example .env
php artisan key:generate
```

> **Note:** The default database is SQLite. No extra configuration is required.

### 5. Create the SQLite Database File

```bash
touch database/database.sqlite
```

### 6. Run Migrations

```bash
php artisan migrate
```

### 7. (Optional) Seed the Database with Test Users

This will create three ready-to-use accounts (admin, host, and regular user):

```bash
php artisan db:seed --class=RoleBasedUserSeeder
```

| Role  | Email               | Password   |
|-------|---------------------|------------|
| Admin | admin@example.com   | `password` |
| Host  | host@example.com    | `password` |
| User  | user@example.com    | `password` |

### 8. Create a Storage Symlink (for file uploads)

```bash
php artisan storage:link
```

---

## ▶️ Running the Project

Use the all-in-one dev command that starts the Laravel server, Vite, queue worker, and log watcher concurrently:

```bash
composer dev
```

Then open your browser at: **[http://localhost:8000](http://localhost:8000)**

Alternatively, you can run each service separately:

```bash
# Terminal 1 — Laravel
php artisan serve

# Terminal 2 — Vite (React frontend)
npm run dev

# Terminal 3 — Queue worker (for background jobs)
php artisan queue:listen --tries=1
```

---

## 👑 Creating an Admin User via Command Line

### Option A — Using Tinker (Interactive Shell)

```bash
php artisan tinker
```

Inside tinker, run:

```php
\App\Models\User::create([
    'name'     => 'Your Admin Name',
    'email'    => 'admin@yourdomain.com',
    'password' => bcrypt('your-secure-password'),
    'role'     => 'admin',
]);
```

Type `exit` to quit tinker.

---

### Option B — Using a One-Liner (Non-Interactive)

```bash
php artisan tinker --execute="
\App\Models\User::create([
    'name'     => 'Admin',
    'email'    => 'admin@yourdomain.com',
    'password' => bcrypt('your-secure-password'),
    'role'     => 'admin',
]);
echo 'Admin user created successfully.';
"
```

---

### Option C — Using the Database Seeder (Development Only)

```bash
php artisan db:seed --class=RoleBasedUserSeeder
```

This creates `admin@example.com` with password `password`. **Change the password after first login in production.**

---

## 🛠️ Other Useful Commands

```bash
# Run PHP tests
php artisan test

# Run JavaScript tests
npm run test

# Format PHP code
composer lint

# Format JS/TS code
npm run format

# Type-check TypeScript
npm run types

# Clear all caches
php artisan optimize:clear
```

---

## 🗄️ Using MySQL Instead of SQLite

1. Create a MySQL database (e.g., `event_host`).
2. Update `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=event_host
DB_USERNAME=root
DB_PASSWORD=your_password
```

3. Re-run migrations:

```bash
php artisan migrate
```

---

## 📁 Project Structure

```
app/
  Models/         User, Event, EventRegistration
  Http/
    Controllers/  EventController, AdminDashboardController,
                  HostDashboardController, ProfileController, Auth/*
    Middleware/   AdminMiddleware, HostMiddleware, ...

database/
  migrations/     All schema definitions
  seeders/        RoleBasedUserSeeder

resources/js/
  pages/
    feats/
      events/     index, show, create, edit, my-events
      admin/      admin-dashboard, users, event-approvals
      host/       host-dashboard, host-profile
      user/       dashboard, my-registrations, user-profile
    auth/         login, register
    welcome.tsx

routes/web.php    Route groups: public, guest, auth, admin, host, user
```

---

## 🔐 Role Permissions Summary

| Feature                  | Admin | Host | User |
|--------------------------|:-----:|:----:|:----:|
| Browse events            |  ✅   |  ✅  |  ✅  |
| Join/Leave events        |  —    |  —   |  ✅  |
| Create/Edit/Delete events|  —    |  ✅  |  —   |
| Approve/Reject events    |  ✅   |  —   |  —   |
| Manage users             |  ✅   |  —   |  —   |

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
