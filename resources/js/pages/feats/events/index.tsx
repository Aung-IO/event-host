import { router } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import EventCard from '@/components/event-card';
import Header from '@/components/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type CardEvent, type EventFilters } from '@/types';

const ALL_TAGS = [
    'Music',
    'Technology',
    'Sports',
    'Arts & Culture',
    'Food & Drink',
    'Business',
    'Health & Wellness',
    'Education',
    'Networking',
    'Entertainment',
    'Outdoor',
    'Charity',
] as const;

interface Props {
    allEvents: CardEvent[];
    filters: EventFilters;
}

export default function EventList({ allEvents, filters = {} }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [activeTag, setActiveTag] = useState(filters.tag ?? '');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Push new filters to the server via Inertia (updates URL without full reload)
    const applyFilters = useCallback((newSearch: string, newTag: string) => {
        const params: Record<string, string> = {};
        if (newSearch) params.search = newSearch;
        if (newTag) params.tag = newTag;

        router.get('/events', params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }, []);

    // Debounce search input — waits 350 ms after user stops typing
    function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setSearch(value);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            applyFilters(value, activeTag);
        }, 350);
    }

    // Tag pill toggle
    function handleTagClick(tag: string) {
        const next = activeTag === tag ? '' : tag;
        setActiveTag(next);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        applyFilters(search, next);
    }

    // Clear all filters
    function handleClear() {
        setSearch('');
        setActiveTag('');
        if (debounceRef.current) clearTimeout(debounceRef.current);
        router.get('/events', {}, { preserveState: false, replace: true });
    }

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    const hasFilters = search.trim() !== '' || activeTag !== '';

    return (
        <div>
            <Header />

            <div className="px-10 py-3">
                <div className="space-y-5">
                    {/* Page heading + search bar */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Discover Events</h1>
                            <p className="text-muted-foreground">Find workshops, conferences, and meetups near you.</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Input id="event-search" placeholder="Search events..." className="w-64" value={search} onChange={handleSearchChange} />
                            {hasFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClear}
                                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-3.5 w-3.5" />
                                    Clear
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Tag filter pills */}
                    <div className="flex flex-wrap gap-2">
                        {ALL_TAGS.map((tag) => (
                            <button
                                key={tag}
                                id={`tag-filter-${tag.replace(/\s+/g, '-').toLowerCase()}`}
                                onClick={() => handleTagClick(tag)}
                                className="focus:outline-none"
                            >
                                <Badge
                                    variant={activeTag === tag ? 'default' : 'outline'}
                                    className={activeTag === tag ? 'cursor-pointer transition-all' : 'cursor-pointer transition-all hover:bg-muted'}
                                >
                                    {tag}
                                </Badge>
                            </button>
                        ))}
                    </div>

                    {/* Result count */}
                    <p className="text-sm text-muted-foreground">
                        {allEvents.length === 0 ? 'No events found' : `${allEvents.length} event${allEvents.length === 1 ? '' : 's'} found`}
                        {hasFilters && (
                            <span className="ml-1">
                                for
                                {search && <span className="font-medium text-foreground"> "{search}"</span>}
                                {search && activeTag && ' in '}
                                {activeTag && <span className="font-medium text-foreground"> {activeTag}</span>}
                            </span>
                        )}
                    </p>
                </div>

                {/* Event grid or empty state */}
                {allEvents.length > 0 ? (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                        {allEvents.map((event: CardEvent) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="mt-16 flex flex-col items-center justify-center gap-3 text-center">
                        <p className="text-5xl">🔍</p>
                        <p className="text-xl font-semibold">No events match your search</p>
                        <p className="text-sm text-muted-foreground">Try a different name or pick another tag.</p>
                        <Button variant="outline" onClick={handleClear} className="mt-2">
                            Clear filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
