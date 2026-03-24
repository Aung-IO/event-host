// @vitest-environment jsdom
import { router, usePage } from '@inertiajs/react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { type CardEvent } from '@/types';
import EventCard from '../components/event-card';

vi.mock('@inertiajs/react', () => ({
    usePage: vi.fn(),
    Link: ({ children, href, onClick, className }: { children: React.ReactNode; href: string; onClick?: React.MouseEventHandler; className?: string }) => (
        <a href={href} onClick={onClick} data-testid="inertia-link" className={className}>
            {children}
        </a>
    ),
    router: {
        delete: vi.fn(),
    },
}));

vi.mock('@/routes/events', () => ({
    show: vi.fn((id) => ({ url: `/events/${id}` })),
}));

vi.mock('@/routes/host/events', () => ({
    default: {
        edit: vi.fn((id) => ({ url: `/host/events/${id}/edit` })),
        destroy: vi.fn((id) => ({ url: `/host/events/${id}` })),
    },
}));

describe('EventCard', () => {
    const mockEvent: CardEvent = {
        id: 1,
        title: 'Awesome Tech Meetup',
        start_date: '2023-10-15T10:00:00Z',
        end_date: '2023-10-15T12:00:00Z',
        location: 'Tech Hub Building',
        available_spots: 10,
        tags: ['React', 'Technology'],
        host_id: 99,
        user: { name: 'Alice', id: 99 },
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Default to not logged in / not owner
        vi.mocked(usePage).mockReturnValue({
            props: {
                auth: { user: null },
            },
        });

        // Mock global confirm
        global.confirm = vi.fn(() => true);
    });

    afterEach(() => {
        cleanup();
    });

    test('renders event details correctly', () => {
        render(<EventCard event={mockEvent} />);

        expect(screen.getByText('Awesome Tech Meetup')).toBeDefined();
        expect(screen.getByText('Hosted by | Alice')).toBeDefined();
        expect(screen.getByText('Tech Hub Building')).toBeDefined();
        expect(screen.getByText('React')).toBeDefined();
        expect(screen.getByText('Technology')).toBeDefined();

        // Match text broken across elements
        expect(
            screen.getByText((content, element) => {
                return element?.textContent === '10 spots left';
            }),
        ).toBeDefined();

        expect(screen.getByRole('button', { name: 'View Details' })).toBeDefined();
    });

    test('shows sold out state correctly', () => {
        const soldOutEvent = { ...mockEvent, available_spots: 0 };
        render(<EventCard event={soldOutEvent} />);

        // Match 0 spot left which is broken across elements
        expect(
            screen.getByText((content, element) => {
                return element?.textContent === '0 spot left';
            }),
        ).toBeDefined();

        // Button should say "Sold Out" and be disabled
        const button = screen.getByRole('button', { name: 'Sold Out' }) as HTMLButtonElement;
        expect(button).toBeDefined();
        expect(button.disabled).toBe(true);
    });

    test('does not show edit and delete buttons for non-owner', () => {
        render(<EventCard event={mockEvent} />);

        // The edit Link acts as an anchor in our mock
        // Since both buttons use lucide icons we can query by button types or role if they exist
        // The component renders standard lucide icons. We can just check that extra buttons don't exist
        // There is 'View Details' button. The edit/delete are rendered only if isOwner
        const buttons = screen.getAllByRole('button');
        // Only the main 'View Details' button should exist if user is not the owner
        expect(buttons.length).toBe(1);
        expect(buttons[0].textContent).toBe('View Details');
    });

    test('shows edit and delete buttons for owner and handles delete', () => {
        vi.mocked(usePage).mockReturnValue({
            props: {
                auth: { user: { id: 99, role: 'host' } },
            },
        });

        // Using getByLabelText or similar is better, but since it's just svg inside, we rely on the buttons array.
        // Or we can find by parent tags, but let's see how many buttons are rendered.
        // View Details, Edit (Link wrapping Button), Delete (Button) -> total 3 standard buttons conceptually,
        // wait, CardCard has: <Link>...</Link> wrapping the whole card? No, wrapping the card.
        // <Link href={hostEvents.edit(event.id).url}> <Button/> </Link>
        // <Button onClick={handleDelete}> <Trash /> </Button>
        render(<EventCard event={mockEvent} />);

        const hostEditLink = screen.getAllByTestId('inertia-link').find((link) => link.getAttribute('href') === '/host/events/1/edit');
        expect(hostEditLink).toBeDefined();

        const allButtons = screen.getAllByRole('button');
        // View Details, Edit, Delete
        expect(allButtons.length).toBe(3);

        const deleteButton = allButtons[allButtons.length - 1]; // Delete is the last button

        fireEvent.click(deleteButton);

        expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this event?');
        expect(router.delete).toHaveBeenCalledWith('/host/events/1');
    });
});
