'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ChevronLeft, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { SEARCH_ACCENT_COLOR } from '@/constants/storefront/mock-search-panel';
import { StorefrontSearchPanelContent } from './storefront-search-panel-content';

type StorefrontSearchOverlayProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialQuery?: string;
};

function buildProductsSearchHref(query: string): string {
    const trimmed = query.trim();
    if (!trimmed) return '/products';
    return `/products?q=${encodeURIComponent(trimmed)}`;
}

export function StorefrontSearchOverlay({
    open,
    onOpenChange,
    initialQuery = '',
}: StorefrontSearchOverlayProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const [query, setQuery] = React.useState(initialQuery);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const user = session?.user as { firstName?: string } | undefined;
    const firstName = user?.firstName?.trim();
    const personalizedTitle = firstName
        ? `${firstName}, Sana Özel Ürünler`
        : 'Sana Özel Ürünler';

    React.useEffect(() => {
        if (open) {
            setQuery(initialQuery);
            const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
            return () => window.clearTimeout(timer);
        }
    }, [open, initialQuery]);

    React.useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    const handleClose = () => onOpenChange(false);

    const handleSubmit = (value?: string) => {
        const next = (value ?? query).trim();
        handleClose();
        router.push(buildProductsSearchHref(next));
    };

    const handleQueryPick = (value: string) => {
        setQuery(value);
        handleSubmit(value);
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-200 flex flex-col bg-background lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Arama"
        >
            <div className="flex shrink-0 items-center gap-2 border-b border-border px-3 py-2">
                <button
                    type="button"
                    onClick={handleClose}
                    className="inline-flex size-10 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-accent"
                    aria-label="Geri"
                >
                    <ChevronLeft className="size-5" aria-hidden />
                </button>

                <div className="relative flex min-w-0 flex-1 items-center">
                    <Search
                        className="pointer-events-none absolute left-3 size-4"
                        style={{ color: SEARCH_ACCENT_COLOR }}
                        aria-hidden
                    />
                    <Input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSubmit();
                        }}
                        placeholder="Ürün, kategori veya ürün kodu ara"
                        className="h-10 rounded-full border-0 bg-muted pl-9 pr-9 text-sm shadow-none focus-visible:ring-0"
                    />
                    {query.length > 0 && (
                        <button
                            type="button"
                            onClick={() => {
                                setQuery('');
                                inputRef.current?.focus();
                            }}
                            className="absolute right-2 inline-flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-accent"
                            aria-label="Temizle"
                        >
                            <X className="size-4" aria-hidden />
                        </button>
                    )}
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
                <StorefrontSearchPanelContent
                    onQueryPick={handleQueryPick}
                    onNavigate={handleClose}
                    personalizedTitle={personalizedTitle}
                />
            </div>
        </div>
    );
}
