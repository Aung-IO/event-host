import { Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { store } from '@/routes/register'; // adjust to your route

export default function Register() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-center text-2xl font-bold">Create Account</CardTitle>
                    <CardDescription className="text-center text-muted-foreground">Enter your details to register</CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...store.form()} resetOnSuccess={['password']}>
                        {({ processing, errors }) => (
                            <div className="space-y-5">
                                {/* Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" name="name" type="text" placeholder="John Doe" required autoFocus/>
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" name="password" type="password" placeholder="••••••••" required />
                                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                                </div>

                                <Button type="submit" className="w-full" disabled={processing}>
                                    {processing ? 'Creating account...' : 'Register'}
                                </Button>
                            </div>
                        )}
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
