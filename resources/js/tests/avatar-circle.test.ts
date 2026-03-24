// @vitest-environment jsdom
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import { describe, expect, test, afterEach } from 'vitest';
import AvatarCircle from '../components/avatar-circle';

describe('AvatarCircle', () => {
    afterEach(() => {
        cleanup();
    });

    const baseUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        created_at: '2023-01-01T00:00:00.000000Z',
        avatar: null,
    };

    test('renders the avatar image when user.avatar is provided', () => {
        const user = { ...baseUser, avatar: 'avatars/john.png' };
        render(React.createElement(AvatarCircle, { user }));

        const img = screen.getByRole('img');
        expect(img).toBeDefined();
        expect(img.getAttribute('src')).toBe('/storage/avatars/john.png');
        expect(img.getAttribute('alt')).toBe('John Doe');
    });

    test('renders the first letter of the name when user.avatar is null', () => {
        const user = { ...baseUser, avatar: null };
        render(React.createElement(AvatarCircle, { user }));

        const fallbackEl = screen.getByText('J');
        expect(fallbackEl).toBeDefined();
        expect(fallbackEl.tagName.toLowerCase()).toBe('div');
        expect(fallbackEl.className).toContain('bg-linear-to-br');
    });
});
