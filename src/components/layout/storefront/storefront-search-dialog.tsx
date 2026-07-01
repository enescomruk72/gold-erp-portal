'use client';

import * as React from 'react';
import Link from 'next/link';
import { Clock, Flame, History, Search, TrendingUp } from 'lucide-react';
import {
    Popover,
    PopoverAnchor,
    PopoverContent,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import {
    SEARCH_ACCENT_COLOR,
    SEARCH_POPULAR_QUERIES,
    SEARCH_RECENT_PRODUCTS,
    SEARCH_RECENT_QUERIES,
    type SearchRecentProduct,
} from '@/constants/storefront/mock-search-panel';

type StorefrontSearchDialogProps = {
    className?: string;
};

const accentRing = 'ring-2 ring-[#0769e9] border-[#0769e9]';

export function StorefrontSearchDialog({ className }: StorefrontSearchDialogProps) {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);
    const anchorRef = React.useRef<HTMLDivElement>(null);

    const isWithinAnchor = (target: EventTarget | null) =>
        target instanceof Node && anchorRef.current?.contains(target);

    React.useEffect(() => {
        if (open) {
            const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
            return () => window.clearTimeout(timer);
        }
    }, [open]);

    const handleQueryPick = (value: string) => {
        setQuery(value);
        inputRef.current?.focus();
    };

    const handleOpenChange = (next: boolean) => {
        setOpen(next);
        if (!next) {
            window.requestAnimationFrame(() => inputRef.current?.blur());
        }
    };

    const handleAnchorActivate = () => {
        setOpen(true);
        inputRef.current?.focus();
    };

    return (
        <Popover open={open} onOpenChange={handleOpenChange} modal={false}>
            <div className={cn('relative w-full max-w-3xl', className)}>
                <PopoverAnchor asChild>
                    <div
                        ref={anchorRef}
                        onPointerDown={() => {
                            if (!open) handleAnchorActivate();
                        }}
                        className={cn(
                            'relative flex h-12 w-full items-center gap-2 rounded-md border border-transparent bg-muted px-3 transition-[box-shadow,border-color,border-radius]',
                            open && cn(accentRing, 'rounded-b-none border-b-0')
                        )}
                    >
                        <Search
                            className="size-6 shrink-0"
                            style={{ color: open ? SEARCH_ACCENT_COLOR : undefined }}
                            aria-hidden
                        />
                        <Input
                            ref={inputRef}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setOpen(true)}
                            onClick={() => {
                                if (!open) handleAnchorActivate();
                            }}
                            placeholder="Ürün, kategori veya ürün kodu ara"
                            className="h-full border-0 bg-transparent! px-0 text-base shadow-none focus-visible:ring-0"
                        />
                    </div>
                </PopoverAnchor>

                <PopoverContent
                    side="bottom"
                    align="start"
                    sideOffset={0}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onPointerDownOutside={(e) => {
                        if (isWithinAnchor(e.target)) e.preventDefault();
                    }}
                    onFocusOutside={(e) => {
                        if (isWithinAnchor(e.target)) e.preventDefault();
                    }}
                    className={cn(
                        'w-(--radix-popover-trigger-width) max-h-[min(70vh,520px)] overflow-y-auto rounded-t-none rounded-b-md border-2 border-t-0 p-0 shadow-md',
                        accentRing
                    )}
                >
                    <div className="divide-y divide-border">
                        <SearchPanelSection
                            icon={Clock}
                            title="Geçmiş Aramalar"
                        >
                            <ul className="space-y-0.5">
                                {SEARCH_RECENT_QUERIES.map((item) => (
                                    <li key={item.id}>
                                        <button
                                            type="button"
                                            onClick={() => handleQueryPick(item.query)}
                                            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-muted"
                                        >
                                            <History className="size-4 shrink-0 text-muted-foreground" />
                                            <span className="truncate">{item.query}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </SearchPanelSection>

                        <SearchPanelSection
                            icon={Search}
                            title="Önceden Gezdiklerim"
                            className="px-0"
                        >
                            <SearchRecentProductsRail onNavigate={() => setOpen(false)} />
                        </SearchPanelSection>

                        <SearchPanelSection
                            icon={TrendingUp}
                            title="Popüler Aramalar"
                        >
                            <div className="flex flex-wrap gap-2">
                                {SEARCH_POPULAR_QUERIES.map((item, index) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => handleQueryPick(item.label)}
                                        className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-sm transition-colors hover:border-[#0769e9]/40 hover:bg-muted"
                                    >
                                        {index < 3 && (
                                            <Flame
                                                className="size-3.5 shrink-0 text-orange-500"
                                                aria-hidden
                                            />
                                        )}
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </SearchPanelSection>
                    </div>
                </PopoverContent>
            </div>
        </Popover>
    );
}

function SearchPanelSection({
    icon: Icon,
    title,
    children,
    className,
}: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <section className={cn('px-3 py-3', className)}>
            <h3 className="mb-2 flex items-center gap-1.5 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Icon className="size-3.5" aria-hidden />
                {title}
            </h3>
            {children}
        </section>
    );
}

function SearchRecentProductsRail({ onNavigate }: { onNavigate: () => void }) {
    return (
        <Carousel
            opts={{ align: 'start', dragFree: true, containScroll: 'trimSnaps' }}
            className="group/rail relative w-full"
        >
            <CarouselContent className="-ml-2 px-1">
                {SEARCH_RECENT_PRODUCTS.map((product) => (
                    <CarouselItem
                        key={product.id}
                        className="basis-[112px] pl-2 sm:basis-[120px]"
                    >
                        <SearchRecentProductCard
                            product={product}
                            onNavigate={onNavigate}
                        />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious
                variant="secondary"
                className="left-1 top-[52px] size-7 -translate-y-1/2 border bg-card/95 shadow-sm disabled:opacity-0"
            />
            <CarouselNext
                variant="secondary"
                className="right-1 top-[52px] size-7 -translate-y-1/2 border bg-card/95 shadow-sm disabled:opacity-0"
            />
        </Carousel>
    );
}

function SearchRecentProductCard({
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
            className="block w-[104px] sm:w-[112px]"
        >
            <article className="overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md">
                <div className="flex aspect-square items-center justify-center bg-muted text-[10px] text-muted-foreground">
                    Görsel
                </div>
                <div className="space-y-0.5 p-2">
                    <p className="line-clamp-2 text-[11px] font-medium leading-snug">
                        {product.title}
                    </p>
                    <p className="text-[11px] font-semibold text-[#0769e9]">
                        {product.price}
                    </p>
                </div>
            </article>
        </Link>
    );
}
