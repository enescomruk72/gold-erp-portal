'use client';

import { useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserCollections } from '@/features/user-collections/hooks/use-user-collections';
import { useUserCollectionMutations } from '@/features/user-collections/api/use-user-collection-mutations';
import type { B2bUserCollectionDTO } from '@/features/cart/api/cart-types';
import { cn } from '@/lib/utils';

type AddToCollectionDialogProps = {
    urunKodu: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

type CollectionPreview = Pick<B2bUserCollectionDTO, 'id' | 'ad' | 'itemCount' | 'previewImageUrls'>;

function CollectionPreviewMosaic({
    previewImageUrls,
    emptyLabel = 'Boş',
}: {
    previewImageUrls?: string[];
    emptyLabel?: string;
}) {
    const slots = Array.from({ length: 4 }, (_, index) => previewImageUrls?.[index]);
    const hasAnyImage = slots.some(Boolean);

    if (!hasAnyImage) {
        return (
            <div className="flex size-full items-center justify-center rounded-lg bg-neutral-100 text-[11px] text-neutral-400">
                {emptyLabel}
            </div>
        );
    }

    return (
        <div className="grid size-full grid-cols-2 gap-1">
            {slots.map((url, index) => (
                <div
                    key={index}
                    className="overflow-hidden rounded-md bg-neutral-100"
                >
                    {url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={url}
                            alt=""
                            className="size-full object-contain p-0.5"
                        />
                    ) : null}
                </div>
            ))}
        </div>
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
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onSelect}
            className={cn(
                'flex h-full flex-col rounded-xl border border-neutral-200 bg-white p-2.5 text-left transition-colors',
                'hover:border-[#0769e9] hover:shadow-sm disabled:pointer-events-none disabled:opacity-60',
            )}
        >
            <div className="aspect-square w-full">
                <CollectionPreviewMosaic previewImageUrls={collection.previewImageUrls} />
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

function CreateCollectionCard({ onClick }: { onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'flex h-full min-h-full flex-col items-center justify-center gap-2 rounded-xl',
                'border border-dashed border-neutral-300 bg-neutral-50/60 p-4 text-center transition-colors',
                'hover:border-[#0769e9] hover:bg-white',
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
    );
}

export function AddToCollectionDialog({
    urunKodu,
    open,
    onOpenChange,
}: AddToCollectionDialogProps) {
    const [newName, setNewName] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const {
        collections,
        isLoading,
        isMutating,
        hasCollectionAccess,
        addProductToCollection,
    } = useUserCollections(open);
    const mutations = useUserCollectionMutations();

    const handleOpenChange = (next: boolean) => {
        if (!next) {
            setShowCreate(false);
            setNewName('');
        }
        onOpenChange(next);
    };

    const handleAdd = async (collectionId: string) => {
        try {
            await addProductToCollection(collectionId, urunKodu);
            toast.success('Ürün koleksiyona eklendi');
            handleOpenChange(false);
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
                toast.success('Koleksiyon oluşturuldu ve ürün eklendi');
                handleOpenChange(false);
            } else {
                toast.success('Koleksiyon oluşturuldu');
            }
            setNewName('');
            setShowCreate(false);
        } catch {
            toast.error('Koleksiyon oluşturulamadı');
        }
    };

    if (!hasCollectionAccess) return null;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-2xl">
                <DialogHeader className="space-y-1.5 border-b border-neutral-100 px-5 py-4 pr-12 text-left">
                    <DialogTitle className="text-base font-bold">Koleksiyona Ekle</DialogTitle>
                    <DialogDescription className="text-sm leading-relaxed text-neutral-500">
                        Ürünü koleksiyonlarından birine ekleyebilir ya da yeni bir koleksiyon
                        oluşturabilirsin.
                    </DialogDescription>
                </DialogHeader>

                <div className="max-h-[min(60vh,40rem)] overflow-y-auto p-base">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="size-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : showCreate ? (
                        <div className="space-y-4 rounded-xl border border-neutral-200 bg-neutral-50/50 p-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-collection-name" className="text-sm font-medium">
                                    Koleksiyon adı
                                </Label>
                                <Input
                                    id="new-collection-name"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Örn. Yaz Koleksiyonum"
                                    maxLength={200}
                                    autoFocus
                                    className="bg-white"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    className="flex-1"
                                    onClick={handleCreate}
                                    disabled={!newName.trim() || isMutating}
                                >
                                    Oluştur ve ekle
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowCreate(false);
                                        setNewName('');
                                    }}
                                >
                                    Vazgeç
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid auto-rows-fr grid-cols-2 gap-3">
                            <CreateCollectionCard onClick={() => setShowCreate(true)} />

                            {collections.map((collection) => (
                                <CollectionPickCard
                                    key={collection.id}
                                    collection={collection}
                                    disabled={isMutating}
                                    onSelect={() => void handleAdd(collection.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
