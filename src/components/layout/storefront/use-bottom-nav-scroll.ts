'use client';

import * as React from 'react';

/** Sayfa başında bottom bar her zaman görünür */
const TOP_LOCK_Y = 24;
/** Bu scrollY'den önce gizlenmez */
const MIN_Y_BEFORE_HIDE = 80;
/** Aşağı yönde bu kadar px kaydırınca gizle */
const HIDE_SCROLL_DISTANCE = 64;
/** Yukarı yönde bu kadar px kaydırınca göster */
const SHOW_SCROLL_DISTANCE = 48;

function getScrollY() {
    return (
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0
    );
}

export function useBottomNavScroll(enabled = true) {
    const [visible, setVisible] = React.useState(true);
    const lastScrollY = React.useRef(0);
    const accumulatedDistance = React.useRef(0);
    const lastDirection = React.useRef<'up' | 'down' | null>(null);
    const ticking = React.useRef(false);

    React.useEffect(() => {
        if (!enabled) return;

        lastScrollY.current = getScrollY();

        const onScroll = () => {
            if (ticking.current) return;
            ticking.current = true;

            requestAnimationFrame(() => {
                const currentY = getScrollY();
                const frameDelta = currentY - lastScrollY.current;

                if (currentY <= TOP_LOCK_Y) {
                    setVisible(true);
                    accumulatedDistance.current = 0;
                    lastDirection.current = null;
                    lastScrollY.current = currentY;
                    ticking.current = false;
                    return;
                }

                if (frameDelta === 0) {
                    ticking.current = false;
                    return;
                }

                const direction: 'up' | 'down' = frameDelta > 0 ? 'down' : 'up';

                if (lastDirection.current !== direction) {
                    accumulatedDistance.current = 0;
                    lastDirection.current = direction;
                }

                accumulatedDistance.current += Math.abs(frameDelta);

                if (direction === 'down') {
                    if (
                        currentY >= MIN_Y_BEFORE_HIDE &&
                        accumulatedDistance.current >= HIDE_SCROLL_DISTANCE
                    ) {
                        setVisible((prev) => {
                            if (!prev) return prev;
                            accumulatedDistance.current = 0;
                            return false;
                        });
                    }
                } else if (accumulatedDistance.current >= SHOW_SCROLL_DISTANCE) {
                    setVisible((prev) => {
                        if (prev) return prev;
                        accumulatedDistance.current = 0;
                        return true;
                    });
                }

                lastScrollY.current = currentY;
                ticking.current = false;
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [enabled]);

    return enabled ? visible : true;
}
