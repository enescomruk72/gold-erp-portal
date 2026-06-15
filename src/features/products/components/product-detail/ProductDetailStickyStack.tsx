'use client';

import { PDP_STICKY_STACK_HEIGHT_PX } from '@/features/products/lib/product-detail-sections';
import type { ProductDetailDTO } from '@/features/products/types/product-detail.types';
import type { ProductDetailSectionDef, ProductDetailSectionId } from '@/features/products/lib/product-detail-sections';
import { ProductDetailStickyBar } from './ProductDetailStickyBar';
import { ProductDetailSectionNav } from './ProductDetailSectionNav';
import { cn } from '@/lib/utils';

type ProductDetailStickyStackProps = {
    detail: ProductDetailDTO;
    slug: string;
    vParam?: string | null;
    listingQuery?: string;
    visible: boolean;
    sections: ProductDetailSectionDef[];
    activeSectionId: ProductDetailSectionId | null;
    onSectionClick: (id: ProductDetailSectionId) => void;
    onAddToCart?: () => void;
};

export function ProductDetailStickyStack({
    detail,
    slug,
    vParam,
    listingQuery,
    visible,
    sections,
    activeSectionId,
    onSectionClick,
    onAddToCart,
}: ProductDetailStickyStackProps) {
    return (
        <div
            style={{ height: PDP_STICKY_STACK_HEIGHT_PX }}
            className={cn(
                'fixed left-0 right-0 top-0 z-60 overflow-visible bg-white shadow-md transition-transform duration-300 ease-out',
                visible
                    ? 'translate-y-0 opacity-100'
                    : '-translate-y-full pointer-events-none opacity-0'
            )}
            aria-hidden={!visible}
        >
            <ProductDetailStickyBar
                detail={detail}
                slug={slug}
                vParam={vParam}
                listingQuery={listingQuery}
                onAddToCart={onAddToCart}
            />
            <ProductDetailSectionNav
                sections={sections}
                activeId={activeSectionId}
                onSectionClick={onSectionClick}
            />
        </div>
    );
}
