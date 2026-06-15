'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Heart, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { IProductDTO } from '@/features/products/types';
import { productPublicHref } from '@/features/products/lib/product-href';
import {
    getProductMiniCategory,
    getProductPrimaryAttributeLabel,
} from '@/features/products/lib/product-card-meta';
import { useFavoritesStore } from '@/features/favorites/store/favorites.store';
import { ProductCardGramaj } from './ProductCardGramaj';
import { cn } from '@/lib/utils';

function getCardImageUrls(product: IProductDTO): string[] {
    return (product.images ?? [])
        .filter((image) => image.url)
        .sort((a, b) => {
            if (a.varsayilanMi && !b.varsayilanMi) return -1;
            if (!a.varsayilanMi && b.varsayilanMi) return 1;
            return a.siraNo - b.siraNo;
        })
        .map((image) => image.url as string);
}

type CardBodyProps = {
    product: IProductDTO;
    primaryImageUrl: string | undefined;
    imageUrls: string[];
    hasMultipleImages: boolean;
    activeImageIndex: number;
    miniCategory: string | null;
    identifierLabel: string | null;
    onImageAreaMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
    onImageAreaMouseLeave: () => void;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
};

function CardBody({
    product,
    primaryImageUrl,
    imageUrls,
    hasMultipleImages,
    activeImageIndex,
    miniCategory,
    identifierLabel,
    onImageAreaMouseMove,
    onImageAreaMouseLeave,
    onTouchStart,
    onTouchEnd,
}: CardBodyProps) {
    return (
        <>
            <div
                className="relative aspect-square w-full overflow-hidden bg-neutral-50 touch-pan-y"
                onMouseMove={onImageAreaMouseMove}
                onMouseLeave={onImageAreaMouseLeave}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
                    {product.yeni ? (
                        <Badge className="bg-emerald-600 text-[11px] hover:bg-emerald-600">
                            Yeni
                        </Badge>
                    ) : null}
                    {product.indirimli ? (
                        <Badge variant="destructive" className="text-[11px]">
                            İndirimli
                        </Badge>
                    ) : null}
                </div>

                {primaryImageUrl ? (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={primaryImageUrl}
                            alt={product.urunAdi}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        {hasMultipleImages ? (
                            <div className="absolute bottom-2.5 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                                {imageUrls.map((_, i) => (
                                    <span
                                        key={i}
                                        className={cn(
                                            'h-1.5 w-1.5 rounded-full transition-colors',
                                            activeImageIndex === i
                                                ? 'bg-neutral-800'
                                                : 'bg-neutral-300'
                                        )}
                                    />
                                ))}
                            </div>
                        ) : null}
                    </>
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <Info className="h-12 w-12 text-neutral-300" />
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-1.5 p-base">
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-neutral-900">
                    {product.urunAdi}
                </h3>

                {miniCategory ? (
                    <p className="text-xs text-neutral-500">{miniCategory}</p>
                ) : null}

                {identifierLabel ? (
                    <p className="text-xs font-medium text-neutral-700">{identifierLabel}</p>
                ) : null}

                {product.ayar?.ayarAdi ? (
                    <p className="text-xs text-neutral-500">{product.ayar.ayarAdi}</p>
                ) : null}

                <div className="mt-auto pt-1">
                    <ProductCardGramaj
                        gramajOzeti={product.gramajOzeti}
                        fallbackGram={product.ortalamaAgirlik}
                    />
                </div>
            </div>
        </>
    );
}

interface StorefrontProductCardProps {
    product: IProductDTO;
    identifierOzellikIds?: number[];
    /** Liste sayfası query (`cid=5&f=81,46`) — detay breadcrumb geri dönüşü için */
    listingQuery?: string;
    /** Liste sayfasında yeni sekme; PDP benzer ürünlerde aynı sekme */
    linkTarget?: '_blank' | '_self';
    /** Ana sayfa mock kartları — tıklamada yönlendirme yok */
    disableLink?: boolean;
}

export function StorefrontProductCard({
    product,
    identifierOzellikIds,
    listingQuery,
    linkTarget = '_blank',
    disableLink = false,
}: StorefrontProductCardProps) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
    const isFavorite = useFavoritesStore((s) => s.isFavorite);
    const touchStartX = useRef<number | null>(null);

    const imageUrls = getCardImageUrls(product);
    const imageCount = imageUrls.length;
    const hasMultipleImages = imageCount > 1;
    const href = productPublicHref(product.publicSlug, product.id, { listingQuery });

    const miniCategory = getProductMiniCategory(product);
    const identifierLabel = getProductPrimaryAttributeLabel(product, identifierOzellikIds);
    const favorited = isFavorite(product.id);

    const handleImageAreaMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!hasMultipleImages) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const index = Math.min(imageCount - 1, Math.floor(x * imageCount));
            setActiveImageIndex(index);
        },
        [hasMultipleImages, imageCount]
    );

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    }, []);

    const handleTouchEnd = useCallback(
        (e: React.TouchEvent) => {
            if (touchStartX.current === null || !hasMultipleImages) return;
            const endX = e.changedTouches[0].clientX;
            const delta = touchStartX.current - endX;
            touchStartX.current = null;
            if (Math.abs(delta) < 50) return;
            if (delta > 0) {
                setActiveImageIndex((i) => Math.min(imageCount - 1, i + 1));
            } else {
                setActiveImageIndex((i) => Math.max(0, i - 1));
            }
            e.preventDefault();
        },
        [hasMultipleImages, imageCount]
    );

    const primaryImageUrl = imageUrls[activeImageIndex] || imageUrls[0];

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(product.id);
    };

    return (
        <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white transition-shadow hover:shadow-md">
            <button
                type="button"
                aria-label={favorited ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                onClick={handleToggleFavorite}
                className={cn(
                    'absolute right-2 top-2 z-20 flex size-9 items-center justify-center rounded-full bg-white/95 shadow-sm transition-all',
                    'opacity-0 group-hover:opacity-100',
                    favorited && 'opacity-100'
                )}
            >
                <Heart
                    className={cn(
                        'size-4 transition-colors',
                        favorited ? 'fill-rose-500 text-rose-500' : 'text-neutral-600'
                    )}
                />
            </button>

            {disableLink ? (
                <div className="flex flex-1 flex-col">
                    <CardBody
                        product={product}
                        primaryImageUrl={primaryImageUrl}
                        imageUrls={imageUrls}
                        hasMultipleImages={hasMultipleImages}
                        activeImageIndex={activeImageIndex}
                        miniCategory={miniCategory}
                        identifierLabel={identifierLabel}
                        onImageAreaMouseMove={handleImageAreaMouseMove}
                        onImageAreaMouseLeave={() => setActiveImageIndex(0)}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    />
                </div>
            ) : (
                <Link
                    href={href}
                    {...(linkTarget === '_blank'
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    className="flex flex-1 flex-col"
                >
                    <CardBody
                        product={product}
                        primaryImageUrl={primaryImageUrl}
                        imageUrls={imageUrls}
                        hasMultipleImages={hasMultipleImages}
                        activeImageIndex={activeImageIndex}
                        miniCategory={miniCategory}
                        identifierLabel={identifierLabel}
                        onImageAreaMouseMove={handleImageAreaMouseMove}
                        onImageAreaMouseLeave={() => setActiveImageIndex(0)}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    />
                </Link>
            )}
        </article>
    );
}
