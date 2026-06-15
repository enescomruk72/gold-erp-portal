'use client';

import * as React from 'react';

type HeaderPinState = {
    topBarRef: React.RefObject<HTMLDivElement | null>;
    navShellRef: React.RefObject<HTMLDivElement | null>;
    sentinelRef: React.RefObject<HTMLDivElement | null>;
    isPinned: boolean;
    navHeight: number;
};

/**
 * Topbar document flow'da kayar; main+bottom nav topbar geçilince viewport üstüne sabitlenir.
 * `position: sticky` bazı overflow / scroll-container kombinasyonlarında kırıldığı için sentinel + fixed kullanılır.
 */
export function useStorefrontHeaderPin(enabled = true): HeaderPinState {
    const topBarRef = React.useRef<HTMLDivElement>(null);
    const navShellRef = React.useRef<HTMLDivElement>(null);
    const sentinelRef = React.useRef<HTMLDivElement>(null);
    const [isPinned, setIsPinned] = React.useState(false);
    const [navHeight, setNavHeight] = React.useState(0);

    React.useEffect(() => {
        if (!enabled) {
            setIsPinned(false);
            return;
        }

        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsPinned(!entry.isIntersecting);
            },
            { threshold: 0, root: null, rootMargin: '0px' }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [enabled]);

    React.useEffect(() => {
        const navShell = navShellRef.current;
        if (!navShell) return;

        const measure = () => {
            setNavHeight(navShell.offsetHeight);
        };

        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(navShell);
        return () => observer.disconnect();
    }, []);

    return {
        topBarRef,
        navShellRef,
        sentinelRef,
        isPinned,
        navHeight,
    };
}
