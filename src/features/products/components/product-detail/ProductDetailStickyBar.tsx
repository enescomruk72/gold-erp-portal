'use client';

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavoritesStore } from '@/features/favorites/store/favorites.store';
import { STOREFRONT_CONTENT_CONTAINER_CLASS } from '@/constants/storefront/layout';
import {
    PDP_STICKY_BAR_HEIGHT_PX,
} from '@/features/products/lib/product-detail-sections';
import type { ProductDetailDTO } from '@/features/products/types/product-detail.types';
import { ProductDetailVariantSelect } from './ProductDetailVariantSelect';
import { cn } from '@/lib/utils';

type ProductDetailStickyBarProps = {
    detail: ProductDetailDTO;
    slug: string;
    vParam?: string | null;
    listingQuery?: string;
    onAddToCart?: () => void;
};

function pickThumbnailUrl(detail: ProductDetailDTO): string | null {
    const sorted = [...(detail.product.images ?? [])]
        .filter((img) => img.url)
        .sort((a, b) => {
            if (a.varsayilanMi && !b.varsayilanMi) return -1;
            if (!a.varsayilanMi && b.varsayilanMi) return 1;
            return a.siraNo - b.siraNo;
        });
    return sorted[0]?.url ?? null;
}

export function ProductDetailStickyBar({
    detail,
    slug,
    vParam,
    listingQuery,
    onAddToCart,
}: ProductDetailStickyBarProps) {
    const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
    const isFavorite = useFavoritesStore((s) => s.isFavorite);

    const { product } = detail;
    const favorited = isFavorite(product.id);
    const thumb = pickThumbnailUrl(detail);
    const hasVariants =
        detail.varianterAxes.length > 0 || detail.slicerAxes.length > 0;

    return (
        <div
            role="region"
            aria-label="Hızlı satın alma"
            style={{ height: PDP_STICKY_BAR_HEIGHT_PX }}
            className="border-b border-neutral-200 bg-white shadow-sm"
        >
            <div
                className={cn(
                    STOREFRONT_CONTENT_CONTAINER_CLASS,
                    'flex h-full items-center gap-4 py-2'
                )}
            >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    {thumb ? (
                        <div className="size-12 shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-neutral-50">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={thumb}
                                alt={product.urunAdi}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="size-12 shrink-0 rounded-md bg-neutral-100" />
                    )}
                    <div className="min-w-0">
                        <p className="line-clamp-1 text-sm font-semibold text-neutral-900">
                            {product.urunAdi}
                        </p>
                        <p className="text-xs text-neutral-600">
                            Ort.{' '}
                            <span className="font-semibold tabular-nums text-neutral-900">
                                {(product.ortalamaAgirlik ?? 0).toLocaleString('tr-TR', {
                                    maximumFractionDigits: 2,
                                })}{' '}
                                gr
                            </span>
                        </p>
                    </div>
                </div>

                <div className="relative z-70 flex shrink-0 items-center gap-2 overflow-visible sm:gap-3">
                    {hasVariants ? (
                        <ProductDetailVariantSelect
                            detail={detail}
                            slug={slug}
                            vParam={vParam}
                            listingQuery={listingQuery}
                            compact
                        />
                    ) : null}
                    <Button
                        type="button"
                        size="sm"
                        className="h-12 shrink-0 bg-[#0b57d0] px-5 font-semibold hover:bg-[#0b57d0]/90"
                        onClick={() => onAddToCart?.()}
                    >
                        Sepete Ekle
                    </Button>
                    <button
                        type="button"
                        aria-label={favorited ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                        onClick={() => toggleFavorite(product.id)}
                        className={cn(
                            'group/favorite flex size-12 shrink-0 border items-center justify-center rounded-full bg-white hover:bg-neutral-100 hover:border-transparent transition-colors',
                            favorited
                                ? 'text-rose-500'
                                : 'text-neutral-600'
                        )}
                    >
                        <Heart className={cn('size-5 group-hover/favorite:text-rose-500', favorited && 'fill-rose-500')} />
                    </button>
                </div>
            </div>
        </div>
    );
}
