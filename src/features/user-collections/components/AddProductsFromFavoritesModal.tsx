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
import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
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
                <Checkbox
                    checked={checked}
                    onCheckedChange={onToggle}
                    className="size-4 border-neutral-300 bg-white"
                />
            </div>
            <div className="aspect-square bg-neutral-50">
                {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageUrl} alt="" className="size-full object-contain p-2" />
                ) : null}
            </div>
            <div className="space-y-0.5 p-2">
                {product.marka?.markaAdi ? (
                    <p className="truncate text-xs font-bold uppercase">{product.marka.markaAdi}</p>
                ) : null}
                <p className="line-clamp-2 text-[11px] text-neutral-600">{product.urunAdi}</p>
                <p className="truncate text-[10px] text-neutral-400">{product.urunKodu}</p>
            </div>
        </label>
    );
}

function AddProductsFooter({
    selectedCount,
    isSubmitting,
    onAdd,
}: {
    selectedCount: number;
    isSubmitting: boolean;
    onAdd: () => void;
}) {
    return (
        <div className="flex w-full items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{selectedCount} ürün seçildi</p>
            <Button
                className={cn('min-w-[140px] rounded-lg', portalPrimaryButtonClass)}
                disabled={selectedCount === 0 || isSubmitting}
                onClick={onAdd}
            >
                {isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                Koleksiyona Ekle
            </Button>
        </div>
    );
}

export function AddProductsFromFavoritesModal({
    open,
    onOpenChange,
    existingUrunIds,
    onAdd,
    isSubmitting = false,
}: AddProductsFromFavoritesModalProps) {
    const isMobile = useIsMobile(1024);
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

    const handleOpenChange = (next: boolean) => {
        onOpenChange(next);
        if (!next) setSelected(new Set());
    };

    const handleAddProducts = async () => {
        const urunKodlari = available
            .filter((item) => selected.has(item.urunId))
            .map((item) => item.urunKodu);
        if (urunKodlari.length === 0) return;
        await onAdd(urunKodlari);
        setSelected(new Set());
    };

    const gridContent =
        isLoading ? (
            <div className="flex justify-center py-12">
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
        ) : available.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
                Eklenebilecek favori ürün bulunmuyor.
            </p>
        ) : (
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {available.map((item) => (
                    <FavoritePickCard
                        key={item.id}
                        product={item.product!}
                        checked={selected.has(item.urunId)}
                        onToggle={() => toggle(item.urunId)}
                    />
                ))}
            </div>
        );

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={handleOpenChange} dismissible modal>
                <DrawerContent className="max-h-[92vh]">
                    <DrawerHeader className="border-b border-neutral-200 text-left">
                        <DrawerTitle className="text-base font-semibold">
                            Favorilerinden Ürün Seç
                        </DrawerTitle>
                    </DrawerHeader>
                    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">{gridContent}</div>
                    <DrawerFooter className="border-t border-neutral-200 px-4 py-3">
                        <AddProductsFooter
                            selectedCount={selected.size}
                            isSubmitting={isSubmitting}
                            onAdd={handleAddProducts}
                        />
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="z-101 flex max-h-[85vh] max-w-3xl flex-col gap-0 overflow-hidden p-0">
                <DialogHeader className="border-b border-neutral-200 px-5 py-4">
                    <DialogTitle className="text-base font-semibold">
                        Favorilerinden Ürün Seç
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-5 py-4">{gridContent}</div>

                <DialogFooter className="flex-row items-center border-t border-neutral-200 px-5 py-4 sm:justify-between">
                    <AddProductsFooter
                        selectedCount={selected.size}
                        isSubmitting={isSubmitting}
                        onAdd={handleAddProducts}
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
