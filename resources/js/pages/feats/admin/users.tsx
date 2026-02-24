import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import admin from '@/routes/admin';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from './admin-layout';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar: string | null;
    created_at: string;
};

type ResetInfo = {
    name: string;
    password: string;
};

type PageProps = {
    auth: { user: { name: string; email: string; role: string; avatar: string | null } };
    users: User[];
    flash?: { resetInfo?: ResetInfo };
};

function RoleBadge({ role }: { role: string }) {
    const styles: Record<string, string> = {
        host: 'bg-indigo-100 text-indigo-700',
        user: 'bg-green-100 text-green-700',
    };
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[role] ?? 'bg-gray-100 text-gray-700'}`}
        >
            {role}
        </span>
    );
}

function AvatarCircle({ user }: { user: User }) {
    return user.avatar ? (
        <img src={`/storage/${user.avatar}`} alt={user.name} className="h-9 w-9 rounded-full object-cover ring-2 ring-indigo-200" />
    ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white ring-2 ring-indigo-200">
            {user.name.charAt(0).toUpperCase()}
        </div>
    );
}

export default function AdminUsers() {
    const { users, flash } = usePage<PageProps>().props;
    const [resettingId, setResettingId] = useState<number | null>(null);
    const resetInfo = flash?.resetInfo;

    function handleReset(userId: number) {
        if (!confirm('Generate a new temporary password for this user?')) return;
        setResettingId(userId);
        router.post(admin.users.resetPassword(userId).url, {}, { onFinish: () => setResettingId(null) });
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Header />

            <AdminLayout>
                {/* Header */}
                <div className="mb-8">
                    <h1 className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">Users</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {users.length} user{users.length !== 1 ? 's' : ''} registered
                    </p>
                </div>

                {/* Temp password banner */}
                {resetInfo && (
                    <div className="mb-6 flex items-start gap-4 rounded-lg border border-amber-200 bg-amber-50 px-5 py-4 dark:border-amber-700 dark:bg-amber-900/20">
                        <span className="text-2xl">🔑</span>
                        <div>
                            <p className="font-semibold text-amber-800 dark:text-amber-300">
                                Temporary password set for <span className="font-bold">{resetInfo.name}</span>
                            </p>
                            <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">Share this with the user — it will not be shown again:</p>
                            <code className="mt-2 inline-block rounded bg-white px-3 py-1.5 font-mono text-base font-bold tracking-widest text-amber-800 shadow-sm ring-1 ring-amber-300 dark:bg-amber-900 dark:text-amber-100">
                                {resetInfo.password}
                            </code>
                        </div>
                    </div>
                )}

                {/* Users table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Users</CardTitle>
                        <CardDescription>Manage user accounts and reset passwords if needed.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {users.length === 0 ? (
                            <p className="py-12 text-center text-sm text-muted-foreground">No users found.</p>
                        ) : (
                            <div className="divide-y">
                                {users.map((user) => (
                                    <div key={user.id} className="flex items-center gap-4 px-6 py-4">
                                        <AvatarCircle user={user} />

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">{user.name}</p>
                                            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                                        </div>

                                        <RoleBadge role={user.role} />

                                        <span className="hidden text-xs text-muted-foreground sm:block">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </span>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={resettingId === user.id}
                                            onClick={() => handleReset(user.id)}
                                            className="shrink-0 border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                                        >
                                            {resettingId === user.id ? 'Resetting…' : 'Reset Password'}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </AdminLayout>
        </div>
    );
}
