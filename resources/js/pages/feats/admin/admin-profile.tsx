import { usePage } from '@inertiajs/react';
import ProfileForm from '@/components/profile-form';
import AdminLayout from './admin-layout';

type User = { id: number; name: string; email: string; avatar: string | null; role: string };
type PageProps = { auth: { user: User }; user: User; flash?: { success?: string } };

export default function AdminProfile() {
    const { user, flash } = usePage<PageProps>().props;
    return (
        <AdminLayout>
            <ProfileForm user={user} flash={flash} />
        </AdminLayout>
    );
}
