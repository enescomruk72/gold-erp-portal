'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronRight, Flame, Sparkles, TrendingUp } from 'lucide-react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import {
    SEARCH_POPULAR_QUERIES,
    SEARCH_RECENT_PRODUCTS,
    type SearchRecentProduct,
} from '@/constants/storefront/mock-search-panel';

type StorefrontSearchPanelContentProps = {
    onQueryPick: (value: string) => void;
    onNavigate: () => void;
    personalizedTitle?: string;
    className?: string;
};

export function StorefrontSearchPanelContent({
    onQueryPick,
    onNavigate,
    personalizedTitle = 'Sana Özel Ürünler',
    className,
}: StorefrontSearchPanelContentProps) {
    return (
        <div className={cn('divide-y divide-border', className)}>
            <section className="px-4 py-4">
                <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <Flame className="size-4 text-orange-500" aria-hidden />
                    Popüler Aramalar
                </h3>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {SEARCH_POPULAR_QUERIES.map((item, index) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => onQueryPick(item.label)}
                            className={cn(
                                'inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1.5 text-sm transition-colors',
                                index === 0
                                    ? 'border-orange-200 bg-orange-50 text-foreground'
                                    : 'border-border bg-card text-foreground hover:border-[#0769e9]/40 hover:bg-muted/50'
                            )}
                        >
                            {index < 3 && (
                                <Flame className="size-3.5 shrink-0 text-orange-500" aria-hidden />
                            )}
                            {item.label}
                        </button>
                    ))}
                </div>
            </section>

            <section className="px-4 py-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                    <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                        <Sparkles className="size-4 text-orange-500" aria-hidden />
                        {personalizedTitle}
                    </h3>
                    <Link
                        href="/products"
                        onClick={onNavigate}
                        className="inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold text-[#0769e9]"
                    >
                        Tümünü Gör
                        <ChevronRight className="size-3.5" aria-hidden />
                    </Link>
                </div>
                <SearchPersonalizedProductsRail onNavigate={onNavigate} />
            </section>
        </div>
    );
}

function SearchPersonalizedProductsRail({ onNavigate }: { onNavigate: () => void }) {
    return (
        <Carousel
            opts={{ align: 'start', dragFree: true, containScroll: 'trimSnaps' }}
            className="group/rail relative w-full"
        >
            <CarouselContent className="-ml-2">
                {SEARCH_RECENT_PRODUCTS.slice(0, 8).map((product) => (
                    <CarouselItem
                        key={product.id}
                        className="basis-[140px] pl-2 sm:basis-[152px]"
                    >
                        <SearchPersonalizedProductCard
                            product={product}
                            onNavigate={onNavigate}
                        />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious
                variant="secondary"
                className="left-0 top-[72px] size-7 -translate-y-1/2 border bg-card/95 shadow-sm disabled:opacity-0"
            />
            <CarouselNext
                variant="secondary"
                className="right-0 top-[72px] size-7 -translate-y-1/2 border bg-card/95 shadow-sm disabled:opacity-0"
            />
        </Carousel>
    );
}

function SearchPersonalizedProductCard({
    product,
    onNavigate,
}: {
    product: SearchRecentProduct;
    onNavigate: () => void;
}) {
    return (
        <Link
            href={`/products?highlight=${product.id}`}
            onClick={onNavigate}
            className="block"
        >
            <article className="overflow-hidden rounded-lg border border-border bg-card">
                <div className="relative aspect-square bg-muted">
                    <div className="flex size-full items-center justify-center text-[10px] text-muted-foreground">
                        Görsel
                    </div>
                    <span className="absolute inset-x-0 bottom-0 bg-emerald-500 px-1 py-0.5 text-center text-[9px] font-semibold text-white">
                        Hızlı Teslimat
                    </span>
                </div>
                <div className="space-y-1 p-2">
                    <p className="line-clamp-2 text-[11px] font-medium leading-snug text-foreground">
                        {product.title}
                    </p>
                    <p className="text-sm font-bold text-[#0769e9]">{product.price}</p>
                </div>
            </article>
        </Link>
    );
}

export function SearchPopularTags({
    onQueryPick,
    className,
}: {
    onQueryPick: (value: string) => void;
    className?: string;
}) {
    return (
        <div className={cn('flex gap-2 overflow-x-auto pb-1 scrollbar-none', className)}>
            {SEARCH_POPULAR_QUERIES.map((item, index) => (
                <button
                    key={item.id}
                    type="button"
                    onClick={() => onQueryPick(item.label)}
                    className={cn(
                        'inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1.5 text-sm transition-colors',
                        index === 0
                            ? 'border-orange-200 bg-orange-50'
                            : 'border-border bg-card hover:border-[#0769e9]/40'
                    )}
                >
                    {index < 3 && (
                        <TrendingUp className="size-3.5 shrink-0 text-orange-500" aria-hidden />
                    )}
                    {item.label}
                </button>
            ))}
        </div>
    );
}
