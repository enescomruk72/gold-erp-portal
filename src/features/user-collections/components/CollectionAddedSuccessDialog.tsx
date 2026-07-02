'use client';

import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Drawer,
    DrawerContent,
    DrawerTitle,
} from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { portalPrimaryButtonClass } from '@/constants/storefront/brand';
import { collectionPublicHref } from '@/features/user-collections/lib/collection-href';
import { cn } from '@/lib/utils';

type CollectionAddedSuccessProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    collectionName: string;
    collectionId: string;
    /** Drawer içinde gösterim — arka plan karartması korunur */
    embedded?: boolean;
};

function SuccessBody({
    collectionName,
    collectionId,
    onClose,
}: {
    collectionName: string;
    collectionId: string;
    onClose: () => void;
}) {
    const href = collectionPublicHref(collectionName, collectionId);

    return (
        <div className="flex flex-col items-center px-6 py-8 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle2 className="size-9 text-emerald-500" aria-hidden />
            </div>
            <h2 className="text-lg font-bold text-foreground">Ürün Koleksiyona Eklendi</h2>
            <p className="mt-2 text-sm text-muted-foreground">
                Ürün{' '}
                <span className="font-semibold text-foreground">{collectionName}</span>{' '}
                koleksiyonuna eklendi.
            </p>

            <div className="mt-6 flex w-full flex-col gap-2">
                <Button
                    type="button"
                    className={cn('h-11 w-full rounded-lg font-semibold', portalPrimaryButtonClass)}
                    onClick={onClose}
                >
                    Tamam
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-full rounded-lg font-semibold"
                    asChild
                >
                    <Link href={href} onClick={onClose}>
                        Koleksiyonu Görüntüle
                    </Link>
                </Button>
            </div>
        </div>
    );
}

export function CollectionAddedSuccessDialog({
    open,
    onOpenChange,
    collectionName,
    collectionId,
    embedded = false,
}: CollectionAddedSuccessProps) {
    const isMobile = useIsMobile(1024);

    if (embedded) {
        return (
            <SuccessBody
                collectionName={collectionName}
                collectionId={collectionId}
                onClose={() => onOpenChange(false)}
            />
        );
    }

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange} dismissible>
                <DrawerContent className="max-h-[85vh]">
                    <DrawerTitle className="sr-only">Ürün koleksiyona eklendi</DrawerTitle>
                    <SuccessBody
                        collectionName={collectionName}
                        collectionId={collectionId}
                        onClose={() => onOpenChange(false)}
                    />
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="z-[102] max-w-sm gap-0 overflow-hidden p-0">
                <DialogTitle className="sr-only">Ürün koleksiyona eklendi</DialogTitle>
                <SuccessBody
                    collectionName={collectionName}
                    collectionId={collectionId}
                    onClose={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
