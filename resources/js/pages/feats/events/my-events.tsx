import EventCard from '@/components/event-card';
import Header from '@/components/header';
import HostLayout from '../host/host-layout';

export default function MyEvents({ myEvents }: { myEvents: any[] }) {
    return (
        <div>
            <Header />

            <HostLayout>
                {/* event card */}
                <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                    {myEvents.map((event: any) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </HostLayout>
        </div>
    );
}
