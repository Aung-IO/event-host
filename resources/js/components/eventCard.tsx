import { Link } from "@inertiajs/react";
import events from "@/routes/host/events";
import { Badge } from "./ui/badge";


export default function EventCard({ event }: { event: any }) {
    return (
       <Link href={events.show(event.id)}>
        <div className="group cursor-pointer">
            {/* Image */}
            <div className="relative aspect-3/2 overflow-hidden rounded-lg">
                <img
                    src={`/storage/${event.image}`}
                    alt={event.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />

                <Badge className="absolute top-3 right-3 bg-gray-600">{event.category}</Badge>
            </div>

            {/* Content */}
            <div>
                <span className="line-clamp-1 text-base font-semibold">{event.title}</span>
                <span className="text-xs text-muted-foreground">{event.location}</span>
            </div>
        </div>
       </Link>
    );
}
