'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bookmark, Heart, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { portalPrimaryButtonClass, portalPrimaryTextClass } from '@/constants/storefront/brand';
import { useUserCollections } from '@/features/user-collections/hooks/use-user-collections';
import { useCollectionListSearchParams } from '@/features/user-collections/lib/collection-list-search-params';
import { collectionPublicHref } from '@/features/user-collections/lib/collection-href';
import { CollectionCard } from './CollectionCard';
import { CreateCollectionDialog } from './CreateCollectionDialog';
import { EditCollectionDialog } from './EditCollectionDialog';
import { CollectionSearchInput } from './CollectionFilters';

function useDebouncedValue<T>(value: T, delayMs = 400): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = window.setTimeout(() => setDebounced(value), delayMs);
        return () => window.clearTimeout(timer);
    }, [value, delayMs]);
    return debounced;
}

export function CollectionsListPage() {
    const router = useRouter();
    const [params, setParams] = useCollectionListSearchParams();
    const [searchInput, setSearchInput] = useState(params.search);
    const debouncedSearch = useDebouncedValue(searchInput);

    const [createOpen, setCreateOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<{ id: string; ad: string } | null>(null);

    const {
        collections,
        isLoading,
        hasCollectionAccess,
        createCollection,
        updateCollection,
        deleteCollection,
        isMutating,
    } = useUserCollections();

    useEffect(() => {
        if (debouncedSearch === params.search) return;
        void setParams({ search: debouncedSearch });
    }, [debouncedSearch, params.search, setParams]);

    useEffect(() => {
        setSearchInput(params.search);
    }, [params.search]);

    const filtered = useMemo(() => {
        if (!params.search.trim()) return collections;
        const term = params.search.trim().toLocaleLowerCase('tr-TR');
        return collections.filter((c) => c.ad.toLocaleLowerCase('tr-TR').includes(term));
    }, [collections, params.search]);

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
            <div className="flex flex-col gap-4 border-b pb-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex gap-6">
                    <Link
                        href="/favorites"
                        className="inline-flex items-center gap-2 border-b-2 border-transparent pb-2 text-sm font-semibold text-neutral-500 hover:text-neutral-800"
                    >
                        <Heart className="size-4" />
                        Favorilerim
                    </Link>
                    <span
                        className={cn(
                            'inline-flex items-center gap-2 border-b-2 border-[#0769e9] pb-2 text-sm font-semibold',
                            portalPrimaryTextClass,
                        )}
                    >
                        <Bookmark className="size-4" />
                        Koleksiyonlarım ({collections.length})
                    </span>
                </div>
                <CollectionSearchInput
                    value={searchInput}
                    onChange={setSearchInput}
                    placeholder="Koleksiyonlarımda Ara"
                />
            </div>

            <div className="mt-4 flex justify-end">
                <Button
                    size="sm"
                    className={cn('rounded-full', portalPrimaryButtonClass)}
                    onClick={() => setCreateOpen(true)}
                >
                    <Plus className="mr-1 size-4" />
                    Koleksiyon Oluştur
                </Button>
            </div>

            {isLoading ? (
                <div className="mt-12 flex justify-center">
                    <Loader2 className="size-8 animate-spin text-muted-foreground" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="mt-12 flex flex-col items-center gap-4 rounded-xl border border-dashed py-16">
                    <Bookmark className="size-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                        {params.search.trim()
                            ? 'Aramanıza uygun koleksiyon bulunamadı.'
                            : 'Henüz koleksiyon oluşturmadınız.'}
                    </p>
                </div>
            ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((collection) => (
                        <CollectionCard
                            key={collection.id}
                            collection={collection}
                            isDeleting={isMutating}
                            onEdit={() => setEditTarget({ id: collection.id, ad: collection.ad })}
                            onAddProduct={() => {
                                router.push(`${collectionPublicHref(collection.ad, collection.id)}?add=1`);
                            }}
                            onDelete={async () => {
                                try {
                                    await deleteCollection(collection.id);
                                    toast.success('Koleksiyon silindi');
                                } catch {
                                    toast.error('Koleksiyon silinemedi');
                                }
                            }}
                        />
                    ))}
                </div>
            )}

            <CreateCollectionDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                isSubmitting={isMutating}
                onSubmit={async (ad) => {
                    try {
                        await createCollection(ad);
                        toast.success('Koleksiyon oluşturuldu');
                        setCreateOpen(false);
                    } catch {
                        toast.error('Koleksiyon oluşturulamadı');
                    }
                }}
            />

            {editTarget ? (
                <EditCollectionDialog
                    open
                    onOpenChange={(open) => {
                        if (!open) setEditTarget(null);
                    }}
                    initialName={editTarget.ad}
                    isSubmitting={isMutating}
                    onSubmit={async (ad) => {
                        try {
                            await updateCollection(editTarget.id, ad);
                            toast.success('Koleksiyon adı güncellendi');
                            setEditTarget(null);
                        } catch {
                            toast.error('Koleksiyon adı güncellenemedi');
                        }
                    }}
                />
            ) : null}
        </div>
    );
}
