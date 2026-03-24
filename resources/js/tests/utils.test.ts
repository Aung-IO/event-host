import { describe, expect, test } from 'vitest';
import { cn } from '../lib/utils';

describe('cn', () => {
    test('merges simple classes', () => {
        expect(cn('px-2 py-1', 'bg-red-500')).toBe('px-2 py-1 bg-red-500');
    });

    test('handles conditionally applied classes', () => {
        expect(cn('px-2', true && 'bg-red-500', false && 'text-white')).toBe('px-2 bg-red-500');
    });

    test('merges conflicting tailwind classes using tailwind-merge', () => {
        expect(cn('bg-red-500 px-2', 'bg-blue-500')).toBe('px-2 bg-blue-500');
        expect(cn('p-2', 'px-4')).toBe('p-2 px-4'); // tailwind-merge handles this correctly based on tailwind specific rules
        expect(cn('px-4', 'p-2')).toBe('p-2');
    });

    test('handles deeply nested arrays and objects', () => {
        expect(
            cn('px-2', ['py-1', { 'bg-red-500': true, 'text-white': false }])
        ).toBe('px-2 py-1 bg-red-500');
    });

    test('handles undefined and null inputs', () => {
        expect(cn('px-2', undefined, null, 'bg-red-500')).toBe('px-2 bg-red-500');
    });
});
