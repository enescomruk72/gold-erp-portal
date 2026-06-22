'use client';

import { useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
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

function CollectionPickCard({
    collection,
    disabled,
    onSelect,
}: {
    collection: Pick<B2bUserCollectionDTO, 'id' | 'ad' | 'itemCount' | 'previewImageUrls'>;
    disabled?: boolean;
    onSelect: () => void;
}) {
    const previewUrl = collection.previewImageUrls?.[0];

    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onSelect}
            className={cn(
                'flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white text-left transition-colors',
                'hover:border-[#0769e9] hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-60',
            )}
        >
            <div className="aspect-4/3 w-full bg-neutral-100">
                {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewUrl} alt="" className="size-full object-cover" />
                ) : (
                    <div className="flex size-full items-center justify-center text-xs text-neutral-400">
                        Boş koleksiyon
                    </div>
                )}
            </div>
            <div className="space-y-0.5 p-3">
                <p className="line-clamp-2 text-sm font-semibold text-neutral-900">{collection.ad}</p>
                <p className="text-xs text-neutral-500">{collection.itemCount} ürün</p>
            </div>
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
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Koleksiyona Ekle</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Ürünü koleksiyonlarından birine ekleyebilir ya da yeni bir koleksiyon
                        oluşturabilirsin.
                    </p>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="size-6 animate-spin text-muted-foreground" />
                    </div>
                ) : showCreate ? (
                    <div className="space-y-3 rounded-xl border p-4">
                        <Label htmlFor="new-collection-name">Koleksiyon adı</Label>
                        <Input
                            id="new-collection-name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Örn. Yaz Koleksiyonum"
                            maxLength={200}
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                onClick={handleCreate}
                                disabled={!newName.trim() || isMutating}
                            >
                                Oluştur ve ekle
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
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
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setShowCreate(true)}
                            className={cn(
                                'flex min-h-[148px] flex-col items-center justify-center gap-2 rounded-xl',
                                'border border-dashed border-neutral-300 bg-neutral-50/80 p-4 text-sm font-medium',
                                'text-neutral-700 transition-colors hover:border-[#0769e9] hover:bg-white',
                            )}
                        >
                            <span className="flex size-10 items-center justify-center rounded-full border border-neutral-300 bg-white">
                                <Plus className="size-5" />
                            </span>
                            Yeni Koleksiyon Oluştur
                        </button>

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
            </DialogContent>
        </Dialog>
    );
}
