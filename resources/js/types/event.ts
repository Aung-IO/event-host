export interface EventHost {
    id: number;
    name: string;
    email?: string;
    avatar?: string | null;
}

export type EventStatus = 'pending' | 'approved' | 'rejected';

/** Full event shape (show page, admin approvals, my-events) */
export interface Event {
    id: number;
    host_id?: number;
    title: string;
    description: string;
    image: string;
    location: string;
    start_date: string;
    end_date: string;
    capacity: number;
    price: number;
    available_spots: number;
    tags?: string[];
    status: EventStatus;
    reject_reason?: string | null;
    created_at?: string;
    user?: EventHost | null;
}

/** Lightweight shape used by EventCard on the listing page */
export interface CardEvent {
    id: number;
    title: string;
    location: string;
    start_date: string;
    end_date: string;
    tags?: string[];
    available_spots: number;
    host_id?: number;
}

/** Registration entry for the My Registrations page */
export interface Registration {
    id: number;
    joined_at: string;
    event: Pick<Event, 'id' | 'title' | 'location' | 'start_date' | 'image' | 'status'>;
}

/** Filters used on the Events index page */
export interface EventFilters {
    search?: string;
    tag?: string;
}
