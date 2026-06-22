'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Layers, Loader2, Pencil, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useGetCategoryNavigation } from '@/features/catalog-navigation';
import { StorefrontProductCard } from '@/features/products/components/storefront-product-card';
import {
    buildIdentifierOzellikMap,
    getIdentifierOzellikIdsForProduct,
} from '@/features/products/lib/identifier-ozellik-map';
import { useGetUserCollection } from '@/features/user-collections/api/use-get-user-collections';
import { useUserCollections } from '@/features/user-collections/hooks/use-user-collections';
import { parseCollectionIdFromSlug, collectionPublicHref } from '@/features/user-collections/lib/collection-href';
import { useCollectionDetailSearchParams } from '@/features/user-collections/lib/collection-detail-search-params';
import { CollectionSearchInput, CollectionCategoryFilter, CollectionMarkaFilter } from './CollectionFilters';
import { AddProductsFromFavoritesModal } from './AddProductsFromFavoritesModal';
import { EditCollectionDialog } from './EditCollectionDialog';
import { cn } from '@/lib/utils';
import { portalPrimaryButtonClass, portalPrimaryTextClass } from '@/constants/storefront/brand';

function useDebouncedValue<T>(value: T, delayMs = 400): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = window.setTimeout(() => setDebounced(value), delayMs);
        return () => window.clearTimeout(timer);
    }, [value, delayMs]);
    return debounced;
}

function CollectionEmptyState({ onAddProduct }: { onAddProduct: () => void }) {
    return (
        <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-16 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-[#0769e9]/10">
                <Layers className={cn('size-8', portalPrimaryTextClass)} />
            </div>
            <h3 className={cn('text-lg font-semibold', portalPrimaryTextClass)}>
                Koleksiyonda Ürün Bulunmuyor
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Yeni ürün ekleyerek koleksiyonunu tamamlayabilirsin.
            </p>
            <Button
                className={cn('mt-6 rounded-full px-8', portalPrimaryButtonClass)}
                onClick={onAddProduct}
            >
                Ürün Ekle
            </Button>
        </div>
    );
}

export function CollectionDetailPage() {
    const params = useParams<{ slug: string }>();
    const router = useRouter();
    const slug = params.slug ?? '';
    const collectionId = parseCollectionIdFromSlug(slug);

    const [queryParams, setQueryParams] = useCollectionDetailSearchParams();
    const [searchInput, setSearchInput] = useState(queryParams.search);
    const debouncedSearch = useDebouncedValue(searchInput);
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const {
        hasCollectionAccess,
        addProductToCollection,
        removeProductFromCollection,
        updateCollection,
        isMutating,
    } = useUserCollections(Boolean(collectionId));

    const { parents } = useGetCategoryNavigation();
    const identifierOzellikMap = useMemo(
        () => buildIdentifierOzellikMap(parents, null, null),
        [parents],
    );

    useEffect(() => {
        if (debouncedSearch === queryParams.search) return;
        void setQueryParams({ search: debouncedSearch, page: 1 });
    }, [debouncedSearch, queryParams.search, setQueryParams]);

    useEffect(() => {
        setSearchInput(queryParams.search);
    }, [queryParams.search]);

    useEffect(() => {
        if (queryParams.add) {
            setAddOpen(true);
            void setQueryParams({ add: null });
        }
    }, [queryParams.add, setQueryParams]);

    const { collection, total, isLoading, isFetching, isError, refetch } = useGetUserCollection(
        collectionId,
        {
            search: queryParams.search,
            kategoriId: queryParams.kategoriId,
            markaId: queryParams.markaId,
            page: queryParams.page,
            limit: queryParams.limit,
        },
        Boolean(collectionId) && hasCollectionAccess,
    );

    const { collection: collectionForAdd } = useGetUserCollection(
        collectionId,
        { page: 1, limit: 500 },
        addOpen && Boolean(collectionId) && hasCollectionAccess,
    );

    const existingUrunIds = useMemo(
        () => new Set((collectionForAdd?.items ?? []).map((item) => item.urunId)),
        [collectionForAdd?.items],
    );

    const hasActiveFilters = Boolean(
        queryParams.search.trim() || queryParams.kategoriId || queryParams.markaId,
    );

    const showEmptyCollection =
        !isLoading &&
        collection != null &&
        collection.itemCount === 0 &&
        !hasActiveFilters;

    const showFilteredEmpty =
        !isLoading &&
        collection != null &&
        !showEmptyCollection &&
        (collection.items ?? []).filter((i) => i.product).length === 0;

    const totalPages = Math.max(1, Math.ceil(total / queryParams.limit));
    const kategoriOptions =
        collection?.filterOptions?.kategoriler?.map((k) => ({
            id: k.id,
            label: k.kategoriAdi,
        })) ?? [];
    const markaOptions = collection?.filterOptions?.markalar ?? [];

    const handleAddProducts = async (urunKodlari: string[]) => {
        if (!collectionId) return;
        try {
            for (const urunKodu of urunKodlari) {
                await addProductToCollection(collectionId, urunKodu);
            }
            toast.success(`${urunKodlari.length} ürün koleksiyona eklendi`);
            setAddOpen(false);
        } catch {
            toast.error('Ürünler eklenemedi');
        }
    };

    const handleRename = async (ad: string) => {
        if (!collectionId) return;
        try {
            await updateCollection(collectionId, ad);
            toast.success('Koleksiyon adı güncellendi');
            setEditOpen(false);
            router.replace(collectionPublicHref(ad, collectionId));
        } catch {
            toast.error('Koleksiyon adı güncellenemedi');
        }
    };

    if (!collectionId) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-16 text-center">
                <p className="text-muted-foreground">Koleksiyon bulunamadı.</p>
                <Button asChild variant="outline" className="mt-4">
                    <Link href="/collections">Koleksiyonlarıma dön</Link>
                </Button>
            </div>
        );
    }

    if (!hasCollectionAccess) {
        return (
            <div className="mx-auto flex min-h-[50vh] max-w-7xl flex-col items-center justify-center gap-4 px-4 py-16">
                <p className="text-muted-foreground">Koleksiyon erişiminiz bulunmuyor.</p>
                <Button asChild variant="outline">
                    <Link href="/products">Ürünlere Git</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
            <div className="flex flex-col gap-4 border-b pb-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                    <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="mt-0.5 shrink-0 rounded-full"
                    >
                        <Link href="/collections">
                            <ArrowLeft className="size-5" />
                        </Link>
                    </Button>
                    <div className="min-w-0">
                        <div className="flex items-center gap-1">
                            <h1 className="truncate text-xl font-bold">{collection?.ad ?? '…'}</h1>
                            {collection ? (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 shrink-0"
                                    onClick={() => setEditOpen(true)}
                                >
                                    <Pencil className="size-4" />
                                </Button>
                            ) : null}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {collection?.itemCount ?? 0} Ürün
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <CollectionSearchInput value={searchInput} onChange={setSearchInput} />
                    <Button
                        className={cn('shrink-0 rounded-full', portalPrimaryButtonClass)}
                        onClick={() => setAddOpen(true)}
                    >
                        <Plus className="mr-1 size-4" />
                        Ürün Ekle
                    </Button>
                </div>
            </div>

            {!showEmptyCollection ? (
                <div className="mt-4 flex flex-wrap gap-2">
                    <CollectionCategoryFilter
                        value={queryParams.kategoriId}
                        options={kategoriOptions}
                        onChange={(kategoriId) => void setQueryParams({ kategoriId, page: 1 })}
                    />
                    <CollectionMarkaFilter
                        value={queryParams.markaId}
                        options={markaOptions}
                        onChange={(markaId) => void setQueryParams({ markaId, page: 1 })}
                    />
                </div>
            ) : null}

            {isError ? (
                <div className="mt-8 rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
                    <p className="text-sm text-destructive">Koleksiyon yüklenemedi.</p>
                    <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
                        Tekrar dene
                    </Button>
                </div>
            ) : isLoading && !collection ? (
                <div className="mt-12 flex justify-center">
                    <Loader2 className="size-8 animate-spin text-muted-foreground" />
                </div>
            ) : showEmptyCollection ? (
                <CollectionEmptyState onAddProduct={() => setAddOpen(true)} />
            ) : showFilteredEmpty ? (
                <div className="mt-12 p-8 text-center text-sm text-neutral-500">
                    Bu filtrelere uygun ürün bulunamadı.
                </div>
            ) : (
                <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
                    {(collection?.items ?? [])
                        .filter((item) => item.product)
                        .map((item) => (
                            <StorefrontProductCard
                                key={item.id}
                                product={item.product!}
                                linkTarget="_self"
                                isRemovePending={isMutating}
                                onRemoveFromCollection={async () => {
                                    try {
                                        await removeProductFromCollection(
                                            collectionId,
                                            item.urunKodu,
                                        );
                                        toast.success('Ürün koleksiyondan kaldırıldı');
                                    } catch {
                                        toast.error('Ürün kaldırılamadı');
                                    }
                                }}
                                identifierOzellikIds={getIdentifierOzellikIdsForProduct(
                                    item.product!.kategoriId,
                                    identifierOzellikMap,
                                )}
                            />
                        ))}
                </div>
            )}

            {!showEmptyCollection && totalPages > 1 ? (
                <div className="mt-8 flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={queryParams.page <= 1 || isFetching}
                        onClick={() =>
                            void setQueryParams({ page: Math.max(1, queryParams.page - 1) })
                        }
                    >
                        Önceki
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        {queryParams.page} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={queryParams.page >= totalPages || isFetching}
                        onClick={() => void setQueryParams({ page: queryParams.page + 1 })}
                    >
                        Sonraki
                    </Button>
                </div>
            ) : null}

            <AddProductsFromFavoritesModal
                open={addOpen}
                onOpenChange={setAddOpen}
                collectionId={collectionId}
                existingUrunIds={existingUrunIds}
                onAdd={handleAddProducts}
                isSubmitting={isMutating}
            />

            {collection ? (
                <EditCollectionDialog
                    open={editOpen}
                    onOpenChange={setEditOpen}
                    initialName={collection.ad}
                    onSubmit={handleRename}
                    isSubmitting={isMutating}
                />
            ) : null}
        </div>
    );
}
