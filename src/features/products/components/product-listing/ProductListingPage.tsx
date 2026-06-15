'use client';

import { useCallback, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { StorefrontContainer } from '@/components/layout/storefront/storefront-container';
import { Button } from '@/components/ui/button';
import { useGetCategoryNavigation } from '@/features/catalog-navigation';
import { useGetProducts } from '@/features/products/api/use-get-products';
import { useGetProductFilters } from '@/features/products/api/use-get-product-filters';
import { StorefrontProductCard } from '@/features/products/components/storefront-product-card';
import {
    serializeListingSearchParams,
    useProductListingSearchParams,
} from '@/features/products/lib/listing-search-params';
import {
    buildIdentifierOzellikMap,
    getIdentifierOzellikIdsForProduct,
} from '@/features/products/lib/identifier-ozellik-map';
import { ProductListingSidebar } from './ProductListingSidebar';
import { ProductListingToolbar } from './ProductListingToolbar';

export function ProductListingPage() {
    const { parents, isLoading: navLoading } = useGetCategoryNavigation();
    const [params, setParams] = useProductListingSearchParams();

    const effectiveDegerIds = params.degerIds ?? [];

    const { filters, isLoading: filtersLoading } = useGetProductFilters(params.kategoriId);

    const {
        data: products,
        total,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useGetProducts({
        page: params.page,
        limit: params.limit,
        kategoriId: params.kategoriId ?? undefined,
        markaId: params.markaId ?? undefined,
        search: params.search || undefined,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
        minGram: params.minGram ?? undefined,
        maxGram: params.maxGram ?? undefined,
        yeni: params.yeni ?? undefined,
        indirimli: params.indirimli ?? undefined,
        ozellikDegerIds: effectiveDegerIds.length > 0 ? effectiveDegerIds : undefined,
    });

    const handleToggleDeger = useCallback(
        (degerId: number) => {
            const current = params.degerIds ?? [];
            const next = current.includes(degerId)
                ? current.filter((id) => id !== degerId)
                : [...current, degerId];
            void setParams({ degerIds: next.length > 0 ? next : [], page: 1 });
        },
        [params.degerIds, setParams]
    );

    const handleClearFilters = useCallback(() => {
        void setParams({
            degerIds: [],
            minGram: null,
            maxGram: null,
            markaId: null,
            yeni: null,
            indirimli: null,
            page: 1,
        });
    }, [setParams]);

    const pageSize = params.limit;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const identifierOzellikMap = useMemo(
        () => buildIdentifierOzellikMap(parents, filters, params.kategoriId),
        [parents, filters, params.kategoriId]
    );

    const listingQuery = useMemo(() => serializeListingSearchParams(params), [params]);

    return (
        <div className="w-full bg-white">
            <StorefrontContainer variant="content" className="bg-white">
                <div className="flex flex-col gap-base lg:flex-row">
                    <ProductListingSidebar
                        navigationParents={parents}
                        selectedKategoriId={params.kategoriId}
                        filters={filters}
                        selectedDegerIds={effectiveDegerIds}
                        minGram={params.minGram}
                        maxGram={params.maxGram}
                        onToggleDeger={handleToggleDeger}
                        onMinGramChange={(v) => void setParams({ minGram: v, page: 1 })}
                        onMaxGramChange={(v) => void setParams({ maxGram: v, page: 1 })}
                        onClearFilters={handleClearFilters}
                    />

                    <div className="min-w-0 flex-1 py-base">
                        <div className="mb-3 border-b border-neutral-200 pb-3">
                            <p className="text-sm font-semibold text-neutral-900">
                                {isLoading || isFetching ? (
                                    <span className="inline-flex items-center gap-1.5">
                                        <Loader2 className="size-3.5 animate-spin" />
                                        Yükleniyor…
                                    </span>
                                ) : (
                                    <>{total.toLocaleString('tr-TR')}+ Ürün</>
                                )}
                            </p>
                        </div>

                        <ProductListingToolbar
                            yeni={params.yeni}
                            indirimli={params.indirimli}
                            sortBy={params.sortBy}
                            sortOrder={params.sortOrder}
                            onYeniChange={(v) => void setParams({ yeni: v, page: 1 })}
                            onIndirimliChange={(v) => void setParams({ indirimli: v, page: 1 })}
                            onSortChange={(sortBy, sortOrder) =>
                                void setParams({ sortBy, sortOrder, page: 1 })
                            }
                        />

                        {isError ? (
                            <div className="mt-8 rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
                                <p className="text-sm text-destructive">
                                    Ürünler yüklenemedi.
                                    {error?.message ? ` ${error.message}` : ''}
                                </p>
                                <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
                                    Tekrar dene
                                </Button>
                            </div>
                        ) : isLoading && products.length === 0 ? (
                            <div className="mt-12 flex justify-center">
                                <Loader2 className="size-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : products.length === 0 ? (
                            <div className="mt-12 p-8 text-center text-sm text-neutral-500">
                                Bu filtrelere uygun ürün bulunamadı.
                            </div>
                        ) : (
                            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5 lg:grid-cols-3">
                                {products.map((product) => (
                                    <StorefrontProductCard
                                        key={product.id}
                                        product={product}
                                        listingQuery={listingQuery}
                                        linkTarget="_self"
                                        identifierOzellikIds={getIdentifierOzellikIdsForProduct(
                                            product.kategoriId,
                                            identifierOzellikMap
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
                                    onClick={() => void setParams({ page: Math.max(1, params.page - 1) })}
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
                                    onClick={() =>
                                        void setParams({ page: Math.min(totalPages, params.page + 1) })
                                    }
                                >
                                    Sonraki
                                </Button>
                            </div>
                        ) : null}
                    </div>
                </div>

                {(navLoading || filtersLoading) && params.kategoriId != null ? (
                    <span className="sr-only">Filtreler yükleniyor</span>
                ) : null}
            </StorefrontContainer>
        </div>
    );
}
