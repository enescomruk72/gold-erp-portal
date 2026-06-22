"use client";

import { useRouter } from "next/navigation";
import { ShoppingBag, ShoppingCart, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/features/cart";
import { getCartGroupCount } from "@/features/cart/lib/cart-group-items";
import { CartSheetPanel } from "./CartSheetPanel";

export function CartDrawer() {
    const router = useRouter();
    const { items, hasCartAccess } = useCart();
    const totalQuantity = items.reduce((sum, item) => sum + item.miktar, 0);
    const isEmpty = items.length === 0;
    const groupCount = getCartGroupCount(items);

    if (!hasCartAccess) return null;

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="lg" className="relative gap-2">
                    <span className="text-sm font-medium">SEPET</span>
                    <span className="relative">
                        <ShoppingBag className="size-5" />
                        {totalQuantity > 0 && (
                            <span className="absolute -right-3 -top-2 flex size-5 items-center justify-center rounded-full bg-primary px-1 py-0 text-xs font-medium text-primary-foreground">
                                {totalQuantity > 99 ? "99+" : totalQuantity}
                            </span>
                        )}
                    </span>
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
                                    {groupCount} çeşit · {totalQuantity} adet
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
                        <Button variant="outline" onClick={() => router.push("/products")}>
                            Ürünlere Git
                        </Button>
                    </div>
                ) : (
                    <CartSheetPanel />
                )}
            </SheetContent>
        </Sheet>
    );
}
