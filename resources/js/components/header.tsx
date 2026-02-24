import { logout, welcome } from '@/routes';
import admin from '@/routes/admin';
import events from '@/routes/events';
import host from '@/routes/host';
import login from '@/routes/login';
import profile from '@/routes/profile';
import register from '@/routes/register';
import { Link, usePage } from '@inertiajs/react';
import { Button } from './ui/button';

type PageProps = {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        } | null;
    };
};
export default function Header() {
    const { auth } = usePage<PageProps>().props;

    return (
        <nav className="flex items-center justify-between border-b px-4 py-3">
            <Link href={welcome()}>
                <h1 className="text-2xl font-bold tracking-tight">EventHost</h1>
            </Link>

            <div className="flex items-center gap-4">
                {auth.user && auth.user.role === 'host' && (
                    <Button variant="ghost" asChild>
                        <Link href={host.dashboard.url()}>My Dashboard</Link>
                    </Button>
                )}
                {auth.user && auth.user.role === 'admin' && (
                    <Button variant="ghost" asChild>
                        <Link href={admin.dashboard.url()}>Admin Dashboard</Link>
                    </Button>
                )}
                <Button variant="ghost" asChild>
                    <Link href={events.index()}>Explore Events</Link>
                </Button>

                {auth.user ? (
                    <>
                       

                        <Link href={logout()} method="post" as="button">
                            <Button variant="destructive">Logout</Button>
                        </Link>
                    </>
                ) : (
                    <>
                        <Button variant="ghost" asChild>
                            <Link href={login.create()}>Login</Link>
                        </Button>

                        <Button asChild>
                            <Link href={register.create()}>Register</Link>
                        </Button>
                    </>
                )}
            </div>
        </nav>
    );
}
