'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Loader2, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useGetCategoryNavigation } from '@/features/catalog-navigation';
import { StorefrontProductCard } from '@/features/products/components/storefront-product-card';
import {
    buildIdentifierOzellikMap,
    getIdentifierOzellikIdsForProduct,
} from '@/features/products/lib/identifier-ozellik-map';
import { useFavorites } from '@/features/favorites/hooks/use-favorites';
import { useGetFavoritesListing } from '@/features/favorites/api/use-get-favorites-listing';
import { useFavoritesPageSearchParams } from '@/features/favorites/lib/favorites-page-search-params';
import { FavoriteProductCardMenu } from '@/features/favorites/components/FavoriteProductCardMenu';
import { FavoritesCollectionsTabNav } from '@/features/favorites/components/FavoritesCollectionsTabNav';
import { FavoritesEmptyState } from '@/features/favorites/components/FavoritesEmptyState';
import { useUserCollections } from '@/features/user-collections';
import { CollectionCategoryFilter } from '@/features/user-collections/components/CollectionFilters';

function useDebouncedValue<T>(value: T, delayMs = 400): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = window.setTimeout(() => setDebounced(value), delayMs);
        return () => window.clearTimeout(timer);
    }, [value, delayMs]);
    return debounced;
}

export function FavoritesCollectionsPage() {
    const { hasFavoriteAccess, toggleFavorite, isMutating } = useFavorites();
    const { hasCollectionAccess, collections } = useUserCollections();
    const { parents } = useGetCategoryNavigation();
    const identifierOzellikMap = useMemo(
        () => buildIdentifierOzellikMap(parents, null, null),
        [parents],
    );

    const [params, setParams] = useFavoritesPageSearchParams();
    const [searchInput, setSearchInput] = useState(params.search);
    const debouncedSearch = useDebouncedValue(searchInput);

    useEffect(() => {
        if (debouncedSearch === params.search) return;
        void setParams({ search: debouncedSearch, page: 1 });
    }, [debouncedSearch, params.search, setParams]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchInput(params.search);
        }, 100);
        return () => clearTimeout(timer);
    }, [params.search]);

    const { items, total, kategoriOptions, isLoading, isFetching, isError, refetch } =
        useGetFavoritesListing(
            {
                search: params.search,
                kategoriId: params.kategoriId,
                page: params.page,
                limit: params.limit,
            },
            hasFavoriteAccess,
        );

    const totalPages = Math.max(1, Math.ceil(total / params.limit));
    const hasActiveFilters = Boolean(params.search.trim()) || params.kategoriId != null;
    const visibleItems = items.filter((item) => item.product);

    const handleClearFilters = () => {
        setSearchInput('');
        void setParams({ search: '', kategoriId: null, page: 1 });
    };

    if (!hasFavoriteAccess && !hasCollectionAccess) {
        return (
            <div className="mx-auto flex min-h-[50vh] max-w-7xl flex-col items-center justify-center gap-4 px-4 py-16">
                <p className="text-muted-foreground">Favori erişiminiz bulunmuyor.</p>
                <Button asChild variant="outline">
                    <Link href="/products">Ürünlere Git</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-0 pb-6 sm:px-6 sm:py-8 lg:px-4">
            <FavoritesCollectionsTabNav
                activeTab="favorites"
                favoritesCount={total}
                collectionsCount={collections.length}
                showCollections={hasCollectionAccess}
                desktopTrailing={
                    <div className="relative w-full max-w-sm">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#0769e9]" />
                        <Input
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Favorilerimde Ara"
                            className="h-10 rounded-md border-neutral-200 bg-neutral-100 pl-9 pr-9"
                        />
                        {searchInput.length > 0 && (
                            <button
                                type="button"
                                onClick={() => setSearchInput('')}
                                className="absolute right-3 top-1/2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
                                aria-label="Aramayı temizle"
                            >
                                <X className="size-4" aria-hidden />
                            </button>
                        )}
                    </div>
                }
            />

            <div className="space-y-3 px-4 pt-3 lg:px-0 lg:pt-4">
                <div className="relative w-full lg:hidden">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#0769e9]" />
                    <Input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Favorilerimde Ara"
                        className="h-11 rounded-full border-neutral-200 bg-white pl-9 pr-9"
                    />
                    {searchInput.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setSearchInput('')}
                            className="absolute right-3 top-1/2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
                            aria-label="Aramayı temizle"
                        >
                            <X className="size-4" aria-hidden />
                        </button>
                    )}
                </div>

                {kategoriOptions.length > 0 ? (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        <CollectionCategoryFilter
                            value={params.kategoriId}
                            options={kategoriOptions}
                            onChange={(kategoriId) => void setParams({ kategoriId, page: 1 })}
                        />
                    </div>
                ) : null}
            </div>

            {!hasFavoriteAccess ? (
                <div className="mt-12 px-4 text-center text-sm text-muted-foreground">
                    Favori erişiminiz bulunmuyor.
                </div>
            ) : (
                <div className="mt-2 px-4 lg:px-0">
                    <p className="mb-3 text-sm text-muted-foreground">{total} ürün</p>

                    {isError ? (
                        <div className="mt-8 rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
                            <p className="text-sm text-destructive">Favoriler yüklenemedi.</p>
                            <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
                                Tekrar dene
                            </Button>
                        </div>
                    ) : isLoading && visibleItems.length === 0 ? (
                        <div className="mt-12 flex justify-center">
                            <Loader2 className="size-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : visibleItems.length === 0 ? (
                        <FavoritesEmptyState
                            hasActiveFilters={hasActiveFilters}
                            onClearFilters={handleClearFilters}
                        />
                    ) : (
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
                            {visibleItems.map((item) => (
                                <StorefrontProductCard
                                    key={item.id}
                                    product={item.product!}
                                    linkTarget="_self"
                                    topActions={
                                        <FavoriteProductCardMenu
                                            urunKodu={item.product!.urunKodu}
                                            hasCollectionAccess={hasCollectionAccess}
                                            isRemovePending={isMutating}
                                            onRemoveFromFavorites={async () => {
                                                try {
                                                    await toggleFavorite(
                                                        item.product!.urunKodu,
                                                        item.product!.id,
                                                    );
                                                    toast.success('Ürün favorilerden kaldırıldı');
                                                } catch {
                                                    toast.error('Ürün favorilerden kaldırılamadı');
                                                }
                                            }}
                                        />
                                    }
                                    identifierOzellikIds={getIdentifierOzellikIdsForProduct(
                                        item.product!.kategoriId,
                                        identifierOzellikMap,
                                    )}
                                />
                            ))}
                        </div>
                    )}

                    {totalPages > 1 ? (
                        <div className="mt-8 flex items-center justify-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={params.page <= 1 || isFetching}
                                onClick={() =>
                                    void setParams({ page: Math.max(1, params.page - 1) })
                                }
                            >
                                Önceki
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                {params.page} / {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={params.page >= totalPages || isFetching}
                                onClick={() => void setParams({ page: params.page + 1 })}
                            >
                                Sonraki
                            </Button>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
