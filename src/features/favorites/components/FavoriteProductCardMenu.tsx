'use client';

import { useState } from 'react';
import { BookmarkPlus, MoreVertical, ScanSearch, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AddToCollectionDialog } from '@/features/user-collections/components/AddToCollectionDialog';
import { cn } from '@/lib/utils';

type FavoriteProductCardMenuProps = {
    urunKodu: string;
    hasCollectionAccess?: boolean;
    isRemovePending?: boolean;
    onRemoveFromFavorites: () => void | Promise<void>;
};

export function FavoriteProductCardMenu({
    urunKodu,
    hasCollectionAccess = false,
    isRemovePending = false,
    onRemoveFromFavorites,
}: FavoriteProductCardMenuProps) {
    const [collectionDialogOpen, setCollectionDialogOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        aria-label="Ürün işlemleri"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        className={cn(
                            'flex size-9 items-center justify-center rounded-full border border-neutral-200',
                            'bg-white/95 text-neutral-600 shadow-sm transition-colors hover:bg-white hover:text-neutral-900',
                        )}
                    >
                        <MoreVertical className="size-4" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    {hasCollectionAccess ? (
                        <DropdownMenuItem
                            onSelect={(e) => {
                                e.preventDefault();
                                setCollectionDialogOpen(true);
                            }}
                        >
                            <BookmarkPlus className="size-4" />
                            Koleksiyona Ekle
                        </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuItem disabled className="justify-between opacity-100">
                        <span className="flex items-center gap-2">
                            <ScanSearch className="size-4" />
                            Benzer Ürünler
                        </span>
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500">
                            Yakında
                        </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        variant="destructive"
                        disabled={isRemovePending}
                        onSelect={(e) => {
                            e.preventDefault();
                            void onRemoveFromFavorites();
                        }}
                    >
                        <Trash2 className="size-4" />
                        Favorilerden Kaldır
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {hasCollectionAccess ? (
                <AddToCollectionDialog
                    urunKodu={urunKodu}
                    open={collectionDialogOpen}
                    onOpenChange={setCollectionDialogOpen}
                />
            ) : null}
        </>
    );
}
