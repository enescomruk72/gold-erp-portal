'use client';

import { useState } from 'react';
import { BookmarkPlus } from 'lucide-react';
import { AddToCollectionDialog } from './AddToCollectionDialog';
import { useUserCollections } from '@/features/user-collections/hooks/use-user-collections';
import { PDP_ICON_ACTION_CLASS } from '@/features/products/components/product-detail/product-detail-icon-action';
import { cn } from '@/lib/utils';

type AddToUserCollectionMenuProps = {
    urunKodu: string;
    className?: string;
};

export function AddToUserCollectionMenu({ urunKodu, className }: AddToUserCollectionMenuProps) {
    const [open, setOpen] = useState(false);
    const { hasCollectionAccess } = useUserCollections(open);

    if (!hasCollectionAccess) return null;

    return (
        <>
            <button
                type="button"
                aria-label="Koleksiyona ekle"
                onClick={() => setOpen(true)}
                className={cn(PDP_ICON_ACTION_CLASS, className)}
            >
                <BookmarkPlus className="size-5" />
            </button>
            <AddToCollectionDialog urunKodu={urunKodu} open={open} onOpenChange={setOpen} />
        </>
    );
}
