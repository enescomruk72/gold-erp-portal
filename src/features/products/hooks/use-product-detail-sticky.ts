'use client';

import { useEffect, useState, type RefObject } from 'react';

/**
 * Sepete ekle alanı viewport'tan çıkınca sticky bar gösterilir.
 */
export function useProductDetailSticky(
    purchaseSectionRef: RefObject<HTMLElement | null>,
    enabled = true
): boolean {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!enabled) return;

        let observer: IntersectionObserver | null = null;

        const attach = () => {
            const target = purchaseSectionRef.current;
            if (!target) return false;

            observer = new IntersectionObserver(
                ([entry]) => {
                    setVisible(!entry.isIntersecting);
                },
                { threshold: 0, root: null, rootMargin: '0px' }
            );
            observer.observe(target);
            return true;
        };

        if (!attach()) {
            const id = window.requestAnimationFrame(() => {
                attach();
            });
            return () => {
                window.cancelAnimationFrame(id);
                observer?.disconnect();
            };
        }

        return () => observer?.disconnect();
    }, [purchaseSectionRef, enabled]);

    return enabled ? visible : false;
}
