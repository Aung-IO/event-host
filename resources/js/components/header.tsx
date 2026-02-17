import { Link, usePage } from '@inertiajs/react';
import { Button } from './ui/button';
import register from '@/routes/register';
import { logout } from '@/routes';
import login from '@/routes/login';

type PageProps = {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
};
export default function Header() {
    const { auth } = usePage<PageProps>().props;

    return (
        <nav className="flex items-center justify-between border-b px-4 py-3">
            <h1 className="text-2xl font-bold tracking-tight">EventHost</h1>

            <div className="flex items-center gap-4">
                {auth.user ? (
                    <>
                        <span className="text-sm text-muted-foreground">{auth.user.name}</span>

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
