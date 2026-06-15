'use client';

import { STOREFRONT_CONTENT_CONTAINER_CLASS } from '@/constants/storefront/layout';
import {
    PDP_SECTION_NAV_HEIGHT_PX,
    type ProductDetailSectionDef,
    type ProductDetailSectionId,
} from '@/features/products/lib/product-detail-sections';
import { cn } from '@/lib/utils';

type ProductDetailSectionNavProps = {
    sections: ProductDetailSectionDef[];
    activeId: ProductDetailSectionId | null;
    onSectionClick: (id: ProductDetailSectionId) => void;
};

export function ProductDetailSectionNav({
    sections,
    activeId,
    onSectionClick,
}: ProductDetailSectionNavProps) {
    if (sections.length === 0) return null;

    return (
        <nav
            aria-label="Ürün sayfası bölümleri"
            style={{ height: PDP_SECTION_NAV_HEIGHT_PX }}
            className="border-b border-neutral-200 bg-white"
        >
            <div
                className={cn(
                    STOREFRONT_CONTENT_CONTAINER_CLASS,
                    'flex h-full items-center gap-1 overflow-x-auto scrollbar-none'
                )}
            >
                {sections.map((section) => (
                    <button
                        key={section.id}
                        type="button"
                        onClick={() => onSectionClick(section.id)}
                        className={cn(
                            'shrink-0 border-b-2 px-3 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors sm:text-sm',
                            activeId === section.id
                                ? 'border-[#0b57d0] text-[#0b57d0]'
                                : 'border-transparent text-neutral-600 hover:text-neutral-900'
                        )}
                    >
                        {section.label}
                    </button>
                ))}
            </div>
        </nav>
    );
}
