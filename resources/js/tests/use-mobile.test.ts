// @vitest-environment jsdom
import { renderHook, act } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { useIsMobile } from '../hooks/use-mobile';

describe('useIsMobile', () => {
    let matchMediaMock: ReturnType<typeof vi.fn>;
    let mqlMock: any;
    let originalInnerWidth: number;
    
    beforeEach(() => {
        originalInnerWidth = window.innerWidth;
        
        mqlMock = {
            matches: false,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        };
        matchMediaMock = vi.fn().mockImplementation(() => mqlMock);
        vi.stubGlobal('matchMedia', matchMediaMock);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: originalInnerWidth });
    });

    test('returns false by default on desktop (innerWidth >= 768)', () => {
        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
        const { result } = renderHook(() => useIsMobile());
        
        expect(result.current).toBe(false);
    });

    test('returns true when mobile breakpoint is reached (innerWidth < 768)', () => {
        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });
        const { result } = renderHook(() => useIsMobile());
        
        expect(result.current).toBe(true);
    });

    test('updates correctly when window resize event triggers', () => {
        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
        const { result } = renderHook(() => useIsMobile());
        
        expect(result.current).toBe(false);
        
        act(() => {
            Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 600 });
            // Simulate matchMedia change event since the hook sets state on innerWidth directly inside the handler
            const changeHandler = mqlMock.addEventListener.mock.calls[0][1];
            changeHandler({ matches: true });
        });
        
        expect(result.current).toBe(true);
    });

    test('cleans up event listener on unmount', () => {
        const { unmount } = renderHook(() => useIsMobile());
        
        unmount();
        
        expect(mqlMock.removeEventListener).toHaveBeenCalledTimes(1);
        expect(mqlMock.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });
});
