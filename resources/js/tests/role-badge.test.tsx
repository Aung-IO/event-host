// @vitest-environment jsdom
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import { describe, expect, test, afterEach } from 'vitest';
import RoleBadge from '../components/role-badge';

describe('RoleBadge', () => {
    afterEach(() => {
        cleanup();
    });

    test('renders host role with indigo styles', () => {
        render(<RoleBadge role="host" />);
        const badge = screen.getByText('host');
        
        expect(badge).toBeDefined();
        expect(badge.className).toContain('capitalize');
        expect(badge.className).toContain('bg-indigo-100 text-indigo-700');
    });

    test('renders user role with green styles', () => {
        render(<RoleBadge role="user" />);
        const badge = screen.getByText('user');
        
        expect(badge).toBeDefined();
        expect(badge.className).toContain('capitalize');
        expect(badge.className).toContain('bg-green-100 text-green-700');
    });

    test('renders admin role with red styles', () => {
        render(<RoleBadge role="admin" />);
        const badge = screen.getByText('admin');
        
        expect(badge).toBeDefined();
        expect(badge.className).toContain('capitalize');
        expect(badge.className).toContain('bg-red-100 text-red-700');
    });

});
