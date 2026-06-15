'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ProductDetailSectionId } from '@/features/products/lib/product-detail-sections';

type UseProductDetailSectionSpyOptions = {
    sectionIds: ProductDetailSectionId[];
    /** Sticky bar + bölüm menüsü görünürken scroll offset */
    stickyStackHeight: number;
    enabled: boolean;
};

export function useProductDetailSectionSpy({
    sectionIds,
    stickyStackHeight,
    enabled,
}: UseProductDetailSectionSpyOptions) {
    const [activeId, setActiveId] = useState<ProductDetailSectionId | null>(
        sectionIds[0] ?? null
    );

    useEffect(() => {
        if (!enabled || sectionIds.length === 0) return;

        const elements = sectionIds
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => el != null);

        if (elements.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

                if (visible[0]?.target.id) {
                    setActiveId(visible[0].target.id as ProductDetailSectionId);
                    return;
                }

                const scrollY = window.scrollY + stickyStackHeight + 8;
                let current: ProductDetailSectionId | null = sectionIds[0] ?? null;
                for (const el of elements) {
                    if (el.offsetTop <= scrollY) {
                        current = el.id as ProductDetailSectionId;
                    }
                }
                if (current) setActiveId(current);
            },
            {
                root: null,
                rootMargin: `-${stickyStackHeight + 8}px 0px -55% 0px`,
                threshold: [0, 0.1, 0.25, 0.5],
            }
        );

        for (const el of elements) observer.observe(el);
        return () => observer.disconnect();
    }, [sectionIds, stickyStackHeight, enabled]);

    const scrollToSection = useCallback(
        (id: ProductDetailSectionId) => {
            const el = document.getElementById(id);
            if (!el) return;

            const offset = enabled ? stickyStackHeight + 12 : 12;
            const top = el.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
            setActiveId(id);
        },
        [stickyStackHeight, enabled]
    );

    return { activeId, scrollToSection };
}

export function useVisibleProductDetailSections(
    sectionIds: ProductDetailSectionId[]
): ProductDetailSectionId[] {
    const [visible, setVisible] = useState<ProductDetailSectionId[]>(sectionIds);

    useEffect(() => {
        const sync = () => {
            setVisible(
                sectionIds.filter((id) => document.getElementById(id) != null)
            );
        };
        sync();
        const t = window.setTimeout(sync, 100);
        return () => window.clearTimeout(t);
    }, [sectionIds]);

    return visible;
}
