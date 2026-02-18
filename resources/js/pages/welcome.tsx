import Header from '@/components/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


type Event = {
    id: number;
    title: string;
    date: string;
    location: string;
    category: string;
};

const events: Event[] = [
    {
        id: 1,
        title: 'Tech Networking Night',
        date: 'March 28, 2026',
        location: 'San Francisco, CA',
        category: 'Networking',
    },
    {
        id: 2,
        title: 'Startup Pitch Competition',
        date: 'April 5, 2026',
        location: 'New York, NY',
        category: 'Startup',
    },
    {
        id: 3,
        title: 'Frontend Developer Meetup',
        date: 'April 12, 2026',
        location: 'Remote',
        category: 'Meetup',
    },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Navbar */}
            
            <Header />
 
            {/* Hero Section */}
            <section className="mx-auto max-w-4xl px-8 py-24 text-center">
                <h2 className="text-5xl leading-tight font-bold tracking-tight">Discover. Join. Host.</h2>
                <p className="mt-6 text-lg text-muted-foreground">Find amazing events around you or create your own and bring people together.</p>
                <div className="mt-8 flex justify-center gap-4">
                    <Button size="lg">Explore Events</Button>
                    <Button size="lg" variant="outline">
                        Become a Host
                    </Button>
                </div>
            </section>

            {/* Featured Events */}
            <section className="bg-muted/30 px-8 py-20">
                <div className="mx-auto max-w-6xl">
                    <h3 className="mb-10 text-center text-3xl font-semibold">Featured Events</h3>

                    <div className="grid gap-6 md:grid-cols-3">
                        {events.map((event) => (
                            <Card key={event.id} className="transition hover:shadow-lg">
                                <CardHeader>
                                    <Badge className="mb-2 w-fit">{event.category}</Badge>
                                    <CardTitle>{event.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{event.date}</p>
                                    <p className="text-sm text-muted-foreground">{event.location}</p>
                                    <Button className="mt-4 w-full">View Details</Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="px-8 py-24">
                <div className="mx-auto max-w-5xl text-center">
                    <h3 className="mb-16 text-3xl font-semibold">How It Works</h3>

                    <div className="grid gap-10 md:grid-cols-3">
                        <div>
                            <h4 className="mb-3 text-xl font-semibold">1. Sign Up</h4>
                            <p className="text-muted-foreground">Create an account to join or host events.</p>
                        </div>

                        <div>
                            <h4 className="mb-3 text-xl font-semibold">2. Join Events</h4>
                            <p className="text-muted-foreground">Discover events that match your interests.</p>
                        </div>

                        <div>
                            <h4 className="mb-3 text-xl font-semibold">3. Host Your Own</h4>
                            <p className="text-muted-foreground">Create events and manage attendees easily.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Host CTA */}
            <section className="bg-primary px-8 py-20 text-center text-primary-foreground">
                <h3 className="text-3xl font-semibold">Ready to Host Your Own Event?</h3>
                <p className="mt-4 opacity-90">Create and manage events effortlessly with our platform.</p>
                <Button size="lg" variant="secondary" className="mt-8">
                    Create Event
                </Button>
            </section>

            {/* Footer */}
            <footer className="border-t px-8 py-6 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} EventHost. All rights reserved.
            </footer>
        </div>
    );
}
