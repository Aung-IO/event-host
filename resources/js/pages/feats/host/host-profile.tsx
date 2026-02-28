import { useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import profile from '@/routes/profile';
import HostLayout from './host-layout';

type User = {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    role: string;
};

type PageProps = {
    auth: { user: User };
    user: User;
    flash?: { success?: string };
};

function AvatarPreview({ src, name }: { src: string | null; name: string }) {
    const initial = name.charAt(0).toUpperCase();
    return src ? (
        <img src={`/storage/${src}`} alt={name} className="h-full w-full rounded-full object-cover" />
    ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-3xl font-bold text-white">
            {initial}
        </div>
    );
}

export default function HostProfile() {
    const { user, flash } = usePage<PageProps>().props;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const infoForm = useForm({ name: user.name, email: user.email });

    const avatarForm = useForm<{ avatar: File | null }>({ avatar: null });
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);

    function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        avatarForm.setData('avatar', file);
        if (file) setAvatarPreviewUrl(URL.createObjectURL(file));
    }

    function submitAvatar(e: React.FormEvent) {
        e.preventDefault();
        avatarForm.post(profile.avatar.url(), {
            forceFormData: true,
            onSuccess: () => setAvatarPreviewUrl(null),
        });
    }

    const pwForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    function submitPassword(e: React.FormEvent) {
        e.preventDefault();
        pwForm.patch(profile.password.url(), {
            onSuccess: () => pwForm.reset(),
        });
    }

    const displayAvatar = avatarPreviewUrl ? null : user.avatar;

    return (
        <HostLayout>
            <div>
                <div className="mb-8">
                    <h1 className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
                        My Profile
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">Manage your account information and security settings.</p>
                </div>

                {flash?.success && (
                    <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
                        ✓ {flash.success}
                    </div>
                )}

                <Card className="mb-6 shadow-sm">
                    <CardHeader>
                        <CardTitle>Profile Picture</CardTitle>
                        <CardDescription>Upload a photo to personalise your account.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submitAvatar} encType="multipart/form-data">
                            <div className="flex items-center gap-6">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-2 ring-indigo-200 transition hover:ring-indigo-400 focus:outline-none"
                                >
                                    {avatarPreviewUrl ? (
                                        <img src={avatarPreviewUrl} alt="Preview" className="h-full w-full rounded-full object-cover" />
                                    ) : (
                                        <AvatarPreview src={displayAvatar} name={user.name} />
                                    )}
                                    <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
                                        Change
                                    </span>
                                </button>

                                <div className="flex flex-col gap-3">
                                    <p className="text-sm text-muted-foreground">JPG, PNG, WEBP or GIF — max 2 MB</p>
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                    <div className="flex gap-2">
                                        <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                                            Choose file
                                        </Button>
                                        <Button
                                            type="submit"
                                            size="sm"
                                            disabled={!avatarForm.data.avatar || avatarForm.processing}
                                            className="bg-linear-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
                                        >
                                            {avatarForm.processing ? 'Uploading...' : 'Upload'}
                                        </Button>
                                    </div>
                                    {avatarForm.errors.avatar && <p className="text-sm text-red-500">{avatarForm.errors.avatar}</p>}
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card className="mb-6 shadow-sm">
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your name and email address.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                infoForm.patch(profile.update.url());
                            }}
                            className="space-y-5"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={infoForm.data.name}
                                    onChange={(e) => infoForm.setData('name', e.target.value)}
                                    placeholder="Your name"
                                />
                                {infoForm.errors.name && <p className="text-sm text-red-500">{infoForm.errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={infoForm.data.email}
                                    onChange={(e) => infoForm.setData('email', e.target.value)}
                                    placeholder="you@example.com"
                                />
                                {infoForm.errors.email && <p className="text-sm text-red-500">{infoForm.errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Role</Label>
                                <div className="flex h-10 items-center">
                                    <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 capitalize dark:bg-indigo-900/30 dark:text-indigo-300">
                                        {user.role}
                                    </span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={infoForm.processing}
                                className="bg-linear-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
                            >
                                {infoForm.processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>Choose a strong password with at least 8 characters.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submitPassword} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="current_password">Current Password</Label>
                                <Input
                                    id="current_password"
                                    type="password"
                                    value={pwForm.data.current_password}
                                    onChange={(e) => pwForm.setData('current_password', e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                                {pwForm.errors.current_password && <p className="text-sm text-red-500">{pwForm.errors.current_password}</p>}
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={pwForm.data.password}
                                    onChange={(e) => pwForm.setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                />
                                {pwForm.errors.password && <p className="text-sm text-red-500">{pwForm.errors.password}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={pwForm.data.password_confirmation}
                                    onChange={(e) => pwForm.setData('password_confirmation', e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={pwForm.processing}
                                className="bg-linear-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
                            >
                                {pwForm.processing ? 'Updating...' : 'Update Password'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </HostLayout>
    );
}
