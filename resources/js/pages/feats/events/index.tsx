import EventCard from '@/components/event-card';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function EventList({ allEvents }: { allEvents: any }) {
    return (
        <div>
            <Header />

            <div className="px-10 py-3">
                <div className="space-y-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Discover Events</h1>
                            <p className="text-muted-foreground">Find workshops, conferences, and meetups near you.</p>
                        </div>

                        <div className="flex gap-2">
                            <Input placeholder="Search events..." className="w-64" />
                            <Button variant="outline">Filter</Button>
                        </div>
                    </div>
                </div>
                {/* event card */}
                <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                    {allEvents.map((event: any) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </div>
        </div>
    );
}
