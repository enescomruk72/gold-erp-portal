'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Bookmark, Heart, Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { portalPrimaryTextClass } from '@/constants/storefront/brand';
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
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
            <div className="flex flex-col gap-4 border-b pb-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex gap-6">
                    <span
                        className={cn(
                            'inline-flex items-center gap-2 border-b-2 border-[#0769e9] pb-2 text-sm font-semibold',
                            portalPrimaryTextClass,
                        )}
                    >
                        <Heart className="size-4" />
                        Favorilerim
                    </span>
                    {hasCollectionAccess ? (
                        <Link
                            href="/collections"
                            className="inline-flex items-center gap-2 border-b-2 border-transparent pb-2 text-sm font-semibold text-neutral-500 hover:text-neutral-800"
                        >
                            <Bookmark className="size-4" />
                            Koleksiyonlarım ({collections.length})
                        </Link>
                    ) : null}
                </div>
                <div className="relative w-full max-w-sm">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Favorilerimde Ara"
                        className="h-10 rounded-full border-neutral-200 bg-white pl-9 pr-4"
                    />
                </div>
            </div>

            {!hasFavoriteAccess ? (
                <div className="mt-12 text-center text-sm text-muted-foreground">
                    Favori erişiminiz bulunmuyor.
                </div>
            ) : (
                <div className="mt-4">
                    <div className="mb-base flex flex-wrap items-center justify-between gap-base">
                        {kategoriOptions.length > 0 ? (
                            <CollectionCategoryFilter
                                value={params.kategoriId}
                                options={kategoriOptions}
                                onChange={(kategoriId) =>
                                    void setParams({ kategoriId, page: 1 })
                                }
                            />
                        ) : null}
                        <p className="text-sm text-muted-foreground">{total} ürün</p>
                    </div>

                    {isError ? (
                        <div className="mt-8 rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
                            <p className="text-sm text-destructive">Favoriler yüklenemedi.</p>
                            <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
                                Tekrar dene
                            </Button>
                        </div>
                    ) : isLoading && items.length === 0 ? (
                        <div className="mt-12 flex justify-center">
                            <Loader2 className="size-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : items.filter((i) => i.product).length === 0 ? (
                        <div className="mt-12 p-8 text-center text-sm text-neutral-500">
                            Bu filtrelere uygun favori ürün bulunamadı.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
                            {items
                                .filter((item) => item.product)
                                .map((item) => (
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
                                                        toast.success(
                                                            'Ürün favorilerden kaldırıldı',
                                                        );
                                                    } catch {
                                                        toast.error(
                                                            'Ürün favorilerden kaldırılamadı',
                                                        );
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
