'use client';

import Link from 'next/link';
import { MoreVertical, Pencil, Plus, Share2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { collectionPublicHref } from '@/features/user-collections/lib/collection-href';
import type { B2bUserCollectionDTO } from '@/features/cart/api/cart-types';

type CollectionCardProps = {
    collection: Pick<
        B2bUserCollectionDTO,
        'id' | 'ad' | 'itemCount' | 'previewImageUrls'
    >;
    onEdit: () => void;
    onDelete: () => void;
    onAddProduct: () => void;
    isDeleting?: boolean;
};

export function CollectionCard({
    collection,
    onEdit,
    onDelete,
    onAddProduct,
    isDeleting = false,
}: CollectionCardProps) {
    const href = collectionPublicHref(collection.ad, collection.id);
    const slots = Array.from({ length: 6 }, (_, index) => collection.previewImageUrls?.[index]);

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const url = `${window.location.origin}${href}`;
        try {
            await navigator.clipboard.writeText(url);
            toast.success('Koleksiyon linki kopyalandı');
        } catch {
            toast.error('Link kopyalanamadı');
        }
    };

    return (
        <article
            className={cn(
                'group relative overflow-hidden rounded-xl border bg-white transition-colors',
                'hover:border-[#0769e9]',
            )}
        >
            <Link href={href} className="block px-4 pb-4 pt-3">
                <p className="truncate pr-16 text-base font-semibold text-neutral-900">
                    {collection.ad}
                </p>

                <div className="mt-3 grid grid-cols-3 gap-1.5">
                    {slots.map((url, index) => (
                        <div
                            key={index}
                            className="aspect-square overflow-hidden rounded-md bg-neutral-100"
                        >
                            {url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={url} alt="" className="size-full object-cover" />
                            ) : null}
                        </div>
                    ))}
                </div>

                <p className="mt-3 text-sm text-neutral-500">{collection.itemCount} Ürün</p>
            </Link>

            <div className="absolute right-3 top-3 flex items-center gap-0.5">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-neutral-500 hover:text-neutral-800"
                    onClick={handleShare}
                >
                    <Share2 className="size-4" />
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8 text-neutral-500 hover:text-neutral-800"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            <MoreVertical className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onAddProduct();
                            }}
                        >
                            <Plus className="mr-2 size-4" />
                            Yeni Ürün Ekle
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onEdit();
                            }}
                        >
                            <Pencil className="mr-2 size-4" />
                            Koleksiyon Adı Düzenle
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            disabled={isDeleting}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDelete();
                            }}
                        >
                            <Trash2 className="mr-2 size-4" />
                            Koleksiyonu Sil
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </article>
    );
}
