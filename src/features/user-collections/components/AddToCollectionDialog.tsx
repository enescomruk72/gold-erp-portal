'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserCollections } from '@/features/user-collections/hooks/use-user-collections';
import { useUserCollectionMutations } from '@/features/user-collections/api/use-user-collection-mutations';
import type { B2bUserCollectionDTO } from '@/features/cart/api/cart-types';
import { portalPrimaryButtonClass } from '@/constants/storefront/brand';
import {
    CollectionSuggestedNames,
    isSuggestedCollectionName,
} from './collection-suggested-names';
import { CollectionAddedSuccessDialog } from './CollectionAddedSuccessDialog';
import { cn } from '@/lib/utils';

type AddToCollectionDialogProps = {
    urunKodu: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

type CollectionPreview = Pick<B2bUserCollectionDTO, 'id' | 'ad' | 'itemCount' | 'previewImageUrls'>;

type ViewState = 'pick' | 'create' | 'success';

type SuccessState = {
    collectionId: string;
    collectionName: string;
} | null;

function CollectionPreviewThumbnail({
    previewImageUrls,
}: {
    previewImageUrls?: string[];
}) {
    const url = previewImageUrls?.[0];

    return (
        <div className="size-10 shrink-0 overflow-hidden rounded-full bg-neutral-100">
            {url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt="" className="size-full object-cover" />
            ) : null}
        </div>
    );
}

function CreateCollectionForm({
    newName,
    setNewName,
    isMutating,
    onSubmit,
}: {
    newName: string;
    setNewName: (value: string) => void;
    isMutating: boolean;
    onSubmit: () => void;
}) {
    const trimmed = newName.trim();
    const isSuggested = isSuggestedCollectionName(trimmed);

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <div className="space-y-2 px-5 py-4">
                <Label htmlFor="new-collection-name" className="text-sm font-semibold">
                    Koleksiyon İsmi
                </Label>
                <Input
                    id="new-collection-name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Koleksiyon ismi yazabilirsin"
                    maxLength={50}
                    autoFocus
                    disabled={isMutating}
                    className={cn(
                        'h-11 bg-white',
                        isSuggested && 'border-[#0769e9] ring-1 ring-[#0769e9]'
                    )}
                />
                <p className="text-right text-xs text-neutral-500">{newName.length}/50</p>
                <CollectionSuggestedNames
                    value={newName}
                    onSelect={setNewName}
                    disabled={isMutating}
                    className="pt-2"
                />
            </div>
            <div className="mt-auto px-5 pb-5">
                <Button
                    type="button"
                    className={cn('h-12 w-full rounded-lg font-semibold', portalPrimaryButtonClass)}
                    disabled={!trimmed || isMutating}
                    onClick={onSubmit}
                >
                    {isMutating ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                    {isMutating ? 'Kaydediliyor…' : 'Kaydet ve Ürün Seç'}
                </Button>
            </div>
        </div>
    );
}

export function AddToCollectionDialog({
    urunKodu,
    open,
    onOpenChange,
}: AddToCollectionDialogProps) {
    const isMobile = useIsMobile(1024);
    const [view, setView] = useState<ViewState>('pick');
    const [newName, setNewName] = useState('');
    const [success, setSuccess] = useState<SuccessState>(null);

    const {
        collections,
        isLoading,
        isMutating,
        hasCollectionAccess,
        addProductToCollection,
    } = useUserCollections(open);
    const mutations = useUserCollectionMutations();

    useEffect(() => {
        if (!open) {
            setView('pick');
            setNewName('');
            setSuccess(null);
        }
    }, [open]);

    const handleDrawerOpenChange = (next: boolean) => {
        onOpenChange(next);
        if (!next) {
            setView('pick');
            setNewName('');
            setSuccess(null);
        }
    };

    const showSuccess = (collectionId: string, collectionName: string) => {
        if (isMobile) {
            setSuccess({ collectionId, collectionName });
            setView('success');
            setNewName('');
            return;
        }
        onOpenChange(false);
        setView('pick');
        setNewName('');
        setSuccess({ collectionId, collectionName });
    };

    const handleAdd = async (collection: CollectionPreview) => {
        try {
            await addProductToCollection(collection.id, urunKodu);
            showSuccess(collection.id, collection.ad);
        } catch {
            toast.error('Koleksiyona eklenemedi');
        }
    };

    const handleCreate = async () => {
        const ad = newName.trim();
        if (!ad) return;
        try {
            const res = await mutations.createCollectionMutation.mutateAsync({ ad });
            const collectionId = res.data?.id;
            if (collectionId) {
                await addProductToCollection(collectionId, urunKodu);
                showSuccess(collectionId, ad);
            }
        } catch {
            toast.error('Koleksiyon oluşturulamadı');
        }
    };

    const pickListContent =
        isLoading ? (
            <div className="flex justify-center py-12">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
        ) : isMobile ? (
            <div className="divide-y divide-border">
                <button
                    type="button"
                    onClick={() => setView('create')}
                    className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-accent/50"
                >
                    <span className="flex size-10 items-center justify-center rounded-full border border-border bg-muted/50">
                        <Plus className="size-5" aria-hidden />
                    </span>
                    <span className="flex-1 text-sm font-semibold">Yeni Koleksiyon Oluştur</span>
                    <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
                </button>
                {collections.map((collection: CollectionPreview) => (
                    <button
                        key={collection.id}
                        type="button"
                        disabled={isMutating}
                        onClick={() => void handleAdd(collection)}
                        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-accent/50 disabled:opacity-60"
                    >
                        <CollectionPreviewThumbnail previewImageUrls={collection.previewImageUrls} />
                        <span className="min-w-0 flex-1 truncate text-sm font-medium">
                            {collection.ad}
                        </span>
                        <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                    </button>
                ))}
            </div>
        ) : (
            <div className="grid auto-rows-fr grid-cols-2 gap-3 p-4">
                <button
                    type="button"
                    onClick={() => setView('create')}
                    className={cn(
                        'flex min-h-full flex-col items-center justify-center gap-2 rounded-xl',
                        'border border-dashed border-neutral-300 bg-neutral-50/60 p-4 text-center transition-colors',
                        'hover:border-[#0769e9] hover:bg-white'
                    )}
                >
                    <span className="flex size-11 items-center justify-center rounded-full border border-neutral-300 bg-white shadow-sm">
                        <Plus className="size-5 text-neutral-600" />
                    </span>
                    <span className="text-sm font-medium leading-snug text-neutral-700">
                        Yeni Koleksiyon
                        <br />
                        Oluştur
                    </span>
                </button>
                {collections.map((collection: CollectionPreview) => (
                    <CollectionPickCard
                        key={collection.id}
                        collection={collection}
                        disabled={isMutating}
                        onSelect={() => void handleAdd(collection)}
                    />
                ))}
            </div>
        );

    const createContent =
        view === 'create' && isMobile ? (
            <CreateCollectionForm
                newName={newName}
                setNewName={setNewName}
                isMutating={isMutating}
                onSubmit={handleCreate}
            />
        ) : view === 'create' ? (
            <div className="p-4">
                <CreateCollectionForm
                    newName={newName}
                    setNewName={setNewName}
                    isMutating={isMutating}
                    onSubmit={handleCreate}
                />
            </div>
        ) : null;

    if (!hasCollectionAccess) return null;

    return (
        <>
            {isMobile ? (
                <Drawer open={open} onOpenChange={handleDrawerOpenChange} dismissible modal>
                    <DrawerContent className="max-h-[92vh]">
                        {view === 'success' && success ? (
                            <>
                                <DrawerTitle className="sr-only">Ürün koleksiyona eklendi</DrawerTitle>
                                <CollectionAddedSuccessDialog
                                    embedded
                                    open
                                    collectionId={success.collectionId}
                                    collectionName={success.collectionName}
                                    onOpenChange={(next) => {
                                        if (!next) handleDrawerOpenChange(false);
                                    }}
                                />
                            </>
                        ) : view === 'pick' ? (
                            <>
                                <DrawerHeader className="border-b border-border text-left">
                                    <DrawerTitle className="text-base font-bold">
                                        Koleksiyona Ekle
                                    </DrawerTitle>
                                    <DrawerDescription className="text-sm leading-relaxed">
                                        Ürünü koleksiyonlarından birine ekleyebilir ya da yeni bir
                                        koleksiyon oluşturabilirsin.
                                    </DrawerDescription>
                                </DrawerHeader>
                                <div className="min-h-0 flex-1 overflow-y-auto pb-4">
                                    {pickListContent}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-2 border-b border-border px-2 py-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setView('pick');
                                            setNewName('');
                                        }}
                                        className="inline-flex size-10 items-center justify-center rounded-md hover:bg-accent"
                                        aria-label="Geri"
                                    >
                                        <ChevronLeft className="size-5" />
                                    </button>
                                    <DrawerTitle className="flex-1 text-center text-base font-semibold">
                                        Yeni Koleksiyon Oluştur
                                    </DrawerTitle>
                                    <DrawerClose className="inline-flex size-10 items-center justify-center rounded-md hover:bg-accent">
                                        <X className="size-5" />
                                    </DrawerClose>
                                </div>
                                {createContent}
                            </>
                        )}
                    </DrawerContent>
                </Drawer>
            ) : (
                <Dialog open={open} onOpenChange={onOpenChange}>
                    <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-2xl">
                        {view === 'pick' ? (
                            <>
                                <DialogHeader className="space-y-1.5 border-b border-neutral-100 px-5 py-4 pr-12 text-left">
                                    <DialogTitle className="text-base font-bold">
                                        Koleksiyona Ekle
                                    </DialogTitle>
                                    <DialogDescription className="text-sm leading-relaxed text-neutral-500">
                                        Ürünü koleksiyonlarından birine ekleyebilir ya da yeni bir
                                        koleksiyon oluşturabilirsin.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="max-h-[min(60vh,40rem)] overflow-y-auto">
                                    {pickListContent}
                                </div>
                            </>
                        ) : (
                            <>
                                <DialogHeader className="flex-row items-center gap-2 space-y-0 border-b px-5 py-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setView('pick');
                                            setNewName('');
                                        }}
                                        className="inline-flex size-9 items-center justify-center rounded-md hover:bg-accent"
                                        aria-label="Geri"
                                    >
                                        <ChevronLeft className="size-5" />
                                    </button>
                                    <DialogTitle className="flex-1 text-base font-semibold">
                                        Yeni Koleksiyon Oluştur
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="max-h-[min(60vh,40rem)] overflow-y-auto">
                                    {createContent}
                                </div>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            )}

            {success && !isMobile ? (
                <CollectionAddedSuccessDialog
                    open
                    onOpenChange={(next) => {
                        if (!next) setSuccess(null);
                    }}
                    collectionId={success.collectionId}
                    collectionName={success.collectionName}
                />
            ) : null}
        </>
    );
}

function CollectionPickCard({
    collection,
    disabled,
    onSelect,
}: {
    collection: CollectionPreview;
    disabled?: boolean;
    onSelect: () => void;
}) {
    const slots = Array.from({ length: 4 }, (_, index) => collection.previewImageUrls?.[index]);
    const hasAnyImage = slots.some(Boolean);

    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onSelect}
            className={cn(
                'flex h-full flex-col rounded-xl border border-neutral-200 bg-white p-2.5 text-left transition-colors',
                'hover:border-[#0769e9] hover:shadow-sm disabled:pointer-events-none disabled:opacity-60'
            )}
        >
            <div className="aspect-square w-full">
                {hasAnyImage ? (
                    <div className="grid size-full grid-cols-2 gap-1">
                        {slots.map((url, index) => (
                            <div key={index} className="overflow-hidden rounded-md bg-neutral-100">
                                {url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={url} alt="" className="size-full object-contain p-0.5" />
                                ) : null}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex size-full items-center justify-center rounded-lg bg-neutral-100 text-[11px] text-neutral-400">
                        Boş
                    </div>
                )}
            </div>
            <div className="mt-2 min-h-10 space-y-0.5">
                <p className="line-clamp-2 text-sm font-semibold leading-snug text-neutral-900">
                    {collection.ad}
                </p>
                <p className="text-xs text-neutral-500">{collection.itemCount} ürün</p>
            </div>
        </button>
    );
}
