import { show as showEvent } from '@/routes/events';
import hostEvents from '@/routes/host/events';
import { Link, router, usePage } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export default function EventCard({ event }: { event: any }) {
    const { auth } = usePage().props as any;
    const isOwner = auth?.user?.id === event.host_id;

    function handleDelete(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this event?')) {
            router.delete(hostEvents.destroy(event.id).url);
        }
    }

    return (
        <Link href={showEvent(event.id).url}>
            <div className="group cursor-pointer">
                {/* Image */}
                <div className="relative aspect-3/2 overflow-hidden rounded-lg">
                    <img
                        src={`/storage/${event.image}`}
                        alt={event.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />

                    <Badge className="absolute top-3 right-3 bg-gray-600">{event.category}</Badge>

                    {/* Edit / Delete buttons — visible only to the owner */}
                    {isOwner && (
                        <div className="absolute right-2 bottom-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <Link href={hostEvents.edit(event.id).url} onClick={(e) => e.stopPropagation()}>
                                <Button size="icon" variant="secondary" className="h-7 w-7">
                                    <Pencil className="h-3.5 w-3.5" />
                                </Button>
                            </Link>
                            <Button size="icon" variant="destructive" className="h-7 w-7" onClick={handleDelete}>
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    )}
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
