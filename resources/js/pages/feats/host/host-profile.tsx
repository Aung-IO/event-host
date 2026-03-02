import { usePage } from '@inertiajs/react';
import ProfileForm from '@/components/profile-form';
import HostLayout from './host-layout';

type User = { id: number; name: string; email: string; avatar: string | null; role: string };
type PageProps = { auth: { user: User }; user: User; flash?: { success?: string } };

export default function HostProfile() {
    const { user, flash } = usePage<PageProps>().props;
    return (
        <HostLayout>
            <ProfileForm user={user} flash={flash} />
        </HostLayout>
    );
}
