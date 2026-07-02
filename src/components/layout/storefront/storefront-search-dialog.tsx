'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import {
    Popover,
    PopoverAnchor,
    PopoverContent,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { SEARCH_ACCENT_COLOR } from '@/constants/storefront/mock-search-panel';
import { StorefrontSearchPanelContent } from './storefront-search-panel-content';
import { StorefrontSearchOverlay } from './storefront-search-overlay';

type StorefrontSearchDialogProps = {
    className?: string;
    variant?: 'default' | 'compact';
};

const accentRing = 'ring-2 ring-[#0769e9] border-[#0769e9]';

function buildProductsSearchHref(query: string): string {
    const trimmed = query.trim();
    if (!trimmed) return '/products';
    return `/products?q=${encodeURIComponent(trimmed)}`;
}

export function StorefrontSearchDialog({
    className,
    variant = 'default',
}: StorefrontSearchDialogProps) {
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [desktopOpen, setDesktopOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);
    const anchorRef = React.useRef<HTMLDivElement>(null);

    const isWithinAnchor = (target: EventTarget | null) =>
        target instanceof Node && anchorRef.current?.contains(target);

    React.useEffect(() => {
        if (desktopOpen) {
            const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
            return () => window.clearTimeout(timer);
        }
    }, [desktopOpen]);

    const handleDesktopSubmit = () => {
        setDesktopOpen(false);
        router.push(buildProductsSearchHref(query));
    };

    const handleDesktopQueryPick = (value: string) => {
        setQuery(value);
        setDesktopOpen(false);
        router.push(buildProductsSearchHref(value));
    };

    const handleDesktopOpenChange = (next: boolean) => {
        setDesktopOpen(next);
        if (!next) {
            window.requestAnimationFrame(() => inputRef.current?.blur());
        }
    };

    const triggerClassName = cn(
        'relative flex w-full items-center gap-2 border border-transparent bg-muted px-3 transition-[box-shadow,border-color,border-radius]',
        variant === 'compact' ? 'h-10 rounded-full' : 'h-12 rounded-md'
    );

    return (
        <>
            {/* Mobil: tıklanınca tam ekran overlay */}
            <div className={cn('relative w-full max-w-3xl lg:hidden', className)}>
                <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    className={cn(triggerClassName, 'cursor-text text-left')}
                    aria-label="Ara"
                >
                    <Search
                        className={cn('shrink-0 text-muted-foreground', variant === 'compact' ? 'size-5' : 'size-6')}
                        aria-hidden
                    />
                    <span className="truncate text-sm text-muted-foreground">
                        Ürün, kategori veya ürün kodu ara
                    </span>
                </button>

                <StorefrontSearchOverlay open={mobileOpen} onOpenChange={setMobileOpen} />
            </div>

            {/* Masaüstü: popover */}
            <Popover open={desktopOpen} onOpenChange={handleDesktopOpenChange} modal={false}>
                <div className={cn('relative hidden w-full max-w-3xl lg:block', className)}>
                    <PopoverAnchor asChild>
                        <div
                            ref={anchorRef}
                            onPointerDown={() => {
                                if (!desktopOpen) setDesktopOpen(true);
                            }}
                            className={cn(
                                triggerClassName,
                                desktopOpen && cn(accentRing, 'rounded-b-none border-b-0')
                            )}
                        >
                            <Search
                                className="size-6 shrink-0"
                                style={{ color: desktopOpen ? SEARCH_ACCENT_COLOR : undefined }}
                                aria-hidden
                            />
                            <Input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={() => setDesktopOpen(true)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleDesktopSubmit();
                                }}
                                onClick={() => {
                                    if (!desktopOpen) setDesktopOpen(true);
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
                        <StorefrontSearchPanelContent
                            onQueryPick={handleDesktopQueryPick}
                            onNavigate={() => setDesktopOpen(false)}
                        />
                    </PopoverContent>
                </div>
            </Popover>
        </>
    );
}
