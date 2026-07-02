'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { portalPrimaryButtonClass } from '@/constants/storefront/brand';

type FavoritesEmptyStateProps = {
    hasActiveFilters?: boolean;
    onClearFilters?: () => void;
    className?: string;
};

export function FavoritesEmptyState({
    hasActiveFilters = false,
    onClearFilters,
    className,
}: FavoritesEmptyStateProps) {
    return (
        <div
            className={cn(
                'mx-auto mt-8 flex max-w-sm flex-col items-center rounded-xl border border-border bg-card px-6 py-10 text-center',
                className
            )}
        >
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-orange-50">
                <Search className="size-7 text-orange-400" aria-hidden />
            </div>
            <h3 className="text-base font-bold text-foreground">
                Aradığın Kriterlere Uygun Ürün Bulunamadı
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
                Filtrelerini kaldırabilir ya da arama kelimeni değiştirebilirsin.
            </p>
            {hasActiveFilters && onClearFilters ? (
                <Button
                    type="button"
                    className={cn('mt-5 h-11 w-full rounded-lg font-semibold', portalPrimaryButtonClass)}
                    onClick={onClearFilters}
                >
                    Filtreyi Temizle
                </Button>
            ) : null}
        </div>
    );
}
