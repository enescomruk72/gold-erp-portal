'use client';

import { useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useGetFavoritesListing } from '@/features/favorites/api/use-get-favorites-listing';
import type { IProductDTO } from '@/features/products/types';
import { portalPrimaryButtonClass } from '@/constants/storefront/brand';
import { cn } from '@/lib/utils';

type AddProductsFromFavoritesModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    collectionId: string;
    existingUrunIds: Set<string>;
    onAdd: (urunKodlari: string[]) => Promise<void>;
    isSubmitting?: boolean;
};

function FavoritePickCard({
    product,
    checked,
    onToggle,
}: {
    product: IProductDTO;
    checked: boolean;
    onToggle: () => void;
}) {
    const imageUrl = product.images.find((img) => img.url)?.url;

    return (
        <label className="relative block cursor-pointer overflow-hidden rounded-lg border border-neutral-200 bg-white">
            <div className="absolute left-2 top-2 z-10">
                <Checkbox checked={checked} onCheckedChange={onToggle} />
            </div>
            <div className="aspect-square bg-neutral-50">
                {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageUrl} alt="" className="size-full object-cover" />
                ) : null}
            </div>
            <div className="space-y-0.5 p-2">
                {product.marka?.markaAdi ? (
                    <p className="truncate text-xs font-semibold">{product.marka.markaAdi}</p>
                ) : null}
                <p className="line-clamp-2 text-[11px] text-neutral-600">{product.urunAdi}</p>
                <p className="text-[11px] text-neutral-400">{product.urunKodu}</p>
            </div>
        </label>
    );
}

export function AddProductsFromFavoritesModal({
    open,
    onOpenChange,
    existingUrunIds,
    onAdd,
    isSubmitting = false,
}: AddProductsFromFavoritesModalProps) {
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const { items, isLoading } = useGetFavoritesListing({ page: 1, limit: 100 }, open);

    const available = useMemo(
        () =>
            items.filter(
                (item) => item.product != null && !existingUrunIds.has(item.urunId),
            ),
        [items, existingUrunIds],
    );

    const toggle = (urunId: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(urunId)) next.delete(urunId);
            else next.add(urunId);
            return next;
        });
    };

    const handleAdd = async () => {
        const urunKodlari = available
            .filter((item) => selected.has(item.urunId))
            .map((item) => item.urunKodu);
        if (urunKodlari.length === 0) return;
        await onAdd(urunKodlari);
        setSelected(new Set());
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                onOpenChange(next);
                if (!next) setSelected(new Set());
            }}
        >
            <DialogContent className="z-101 flex max-h-[85vh] max-w-3xl flex-col gap-0 overflow-hidden p-0">
                <DialogHeader className="border-b border-neutral-200 px-5 py-4">
                    <DialogTitle className="text-base font-semibold">
                        Favorilerinden Ürün Seç
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-5 py-4">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="size-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : available.length === 0 ? (
                        <p className="py-12 text-center text-sm text-muted-foreground">
                            Eklenebilecek favori ürün bulunmuyor.
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {available.map((item) => (
                                <FavoritePickCard
                                    key={item.id}
                                    product={item.product!}
                                    checked={selected.has(item.urunId)}
                                    onToggle={() => toggle(item.urunId)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <DialogFooter className="flex-row items-center gap-2 border-t border-neutral-200 px-5 py-4 sm:justify-between">
                    <p className="text-sm text-muted-foreground">{selected.size} ürün seçildi</p>
                    <Button
                        className={cn('sm:min-w-[160px]', portalPrimaryButtonClass)}
                        disabled={selected.size === 0 || isSubmitting}
                        onClick={handleAdd}
                    >
                        {isSubmitting ? (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : null}
                        Koleksiyona Ekle
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
