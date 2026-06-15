'use client';

import { ShoppingBag, ShoppingCart, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useCartStore, useCartTotalQuantity } from '@/features/cart/store';
import { CartSheetPanel } from '@/features/cart/components/CartSheetPanel';
import { cn } from '@/lib/utils';

export function StorefrontCartNav({ className }: { className?: string }) {
    const items = useCartStore((s) => s.items);
    const totalQuantity = useCartTotalQuantity();
    const isEmpty = items.length === 0;

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="lg"
                    className={cn(
                        'inline-flex shrink-0 flex-col items-center gap-0.5 rounded-md px-2 py-1.5 text-foreground transition-colors hover:text-primary',
                        className
                    )}
                >
                    <span className="relative inline-flex">
                        <ShoppingBag className="size-5" aria-hidden />
                        {totalQuantity > 0 && (
                            <span className="absolute -right-2.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-primary px-0.5 text-[10px] font-semibold text-primary-foreground">
                                {totalQuantity > 99 ? '99+' : totalQuantity}
                            </span>
                        )}
                    </span>
                    <span className="text-[11px] font-medium leading-none">Sepetim</span>
                </Button>
            </SheetTrigger>
            <SheetContent
                side="right"
                showCloseButton={false}
                className="flex h-full w-full flex-col gap-0 p-0 sm:max-w-lg"
            >
                <SheetHeader className="shrink-0 border-b border-border px-4 py-4">
                    <div className="flex h-full flex-row items-center justify-between gap-4">
                        <SheetTitle className="flex flex-1 items-center gap-4 pr-0">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="size-6" />
                                <span className="text-xl font-semibold">Sepetim</span>
                            </div>
                            {!isEmpty && (
                                <Badge variant="secondary" className="text-xs">
                                    {items.length} çeşit · {totalQuantity} adet
                                </Badge>
                            )}
                        </SheetTitle>
                        <SheetClose asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <XIcon className="size-4" />
                            </Button>
                        </SheetClose>
                    </div>
                </SheetHeader>

                {isEmpty ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
                        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                            <ShoppingCart className="size-8 text-muted-foreground" />
                        </div>
                        <p className="text-center text-sm text-muted-foreground">
                            Sepetinizde ürün bulunmuyor
                        </p>
                    </div>
                ) : (
                    <CartSheetPanel />
                )}
            </SheetContent>
        </Sheet>
    );
}
