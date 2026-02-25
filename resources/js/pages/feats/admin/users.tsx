import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import admin from '@/routes/admin';
import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AdminLayout from './admin-layout';
import RoleBadge from '@/components/role-badge';
import AvatarCircle from '@/components/avatar-circle';

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
    auth: { user: { id: number; name: string; email: string; role: string; avatar: string | null } };
    users: User[];
    flash?: { resetInfo?: ResetInfo; success?: string };
    errors?: { role?: string };
};

const ROLES = ['user', 'host', 'admin'] as const;
type Role = (typeof ROLES)[number];


function RoleSelect({
    user,
    currentUserId,
    changingId,
    onChangeRole,
}: {
    user: User;
    currentUserId: number;
    changingId: number | null;
    onChangeRole: (userId: number, role: Role) => void;
}) {
    const isSelf = user.id === currentUserId;

    return (
        <select
            value={user.role}
            disabled={isSelf || changingId === user.id}
            onChange={(e) => onChangeRole(user.id, e.target.value as Role)}
            className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 shadow-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            title={isSelf ? 'You cannot change your own role' : 'Change role'}
        >
            {ROLES.map((r) => (
                <option key={r} value={r}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                </option>
            ))}
        </select>
    );
}

export default function AdminUsers() {
    const { users, flash, auth, errors } = usePage<PageProps>().props;
    const [resettingId, setResettingId] = useState<number | null>(null);
    const [changingRoleId, setChangingRoleId] = useState<number | null>(null);
    const resetInfo = flash?.resetInfo;

    // Show flash messages as toasts after render
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (errors?.role) toast.error(errors.role);
        if (resetInfo) {
            toast.info(`Temp password for ${resetInfo.name}`, {
                description: (
                    <span>
                        Share this — it will not be shown again:{' '}
                        <span className="rounded bg-muted px-1 py-0.5 font-mono text-xs font-bold tracking-widest">{resetInfo.password}</span>
                    </span>
                ),
                duration: Infinity,
                closeButton: true,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flash?.success, errors?.role, resetInfo?.password]);

    function handleChangeRole(userId: number, newRole: Role) {
        const user = users.find((u) => u.id === userId);
        if (!user || newRole === user.role) return;

        const ref = { id: undefined as string | number | undefined };
        ref.id = toast('Role updated', {
            description: `${user.name} is now ${newRole}.`,
            action: {
                label: 'Confirm',
                onClick: () => {
                    setChangingRoleId(userId);
                    router.post(admin.users.changeRole(userId).url, { role: newRole }, { onFinish: () => setChangingRoleId(null) });
                },
            },
            cancel: { label: 'Cancel', onClick: () => toast.dismiss(ref.id) },
            duration: 4000,
        });
    }

    function handleReset(userId: number) {
        const user = users.find((u) => u.id === userId);
        if (!user) return;

        const ref = { id: undefined as string | number | undefined };
        ref.id = toast(`Generate a new temporary password for ${user.name}?`, {
            action: {
                label: 'Confirm',
                onClick: () => {
                    setResettingId(userId);
                    router.post(admin.users.resetPassword(userId).url, {}, { onFinish: () => setResettingId(null) });
                },
            },
            cancel: { label: 'Cancel', onClick: () => toast.dismiss(ref.id) },
            duration: 8000,
        });
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

                {/* Users table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Users</CardTitle>
                        <CardDescription>Manage user accounts, change roles, and reset passwords if needed.</CardDescription>
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

                                        <RoleSelect
                                            user={user}
                                            currentUserId={auth.user.id}
                                            changingId={changingRoleId}
                                            onChangeRole={handleChangeRole}
                                        />

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
