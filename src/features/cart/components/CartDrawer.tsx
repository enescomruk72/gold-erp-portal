"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, ShoppingBag, Trash2, XIcon } from "lucide-react";
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    useCartStore,
    useCartTotalQuantity,
} from "@/features/cart/store";
import { getCartItemImageUrl } from "@/features/cart/lib/mock-cart-image";
import Image from "next/image";

function formatPrice(value: number) {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
    }).format(value);
}

export function CartDrawer() {
    const router = useRouter();
    const [clearCartOpen, setClearCartOpen] = useState(false);
    const items = useCartStore((s) => s.items);
    const totalQuantity = useCartTotalQuantity();
    const updateQuantity = useCartStore((s) => s.updateQuantity);
    const removeItem = useCartStore((s) => s.removeItem);
    const clearCart = useCartStore((s) => s.clearCart);

    const araToplam = items.reduce((s, i) => s + i.satirAraToplam, 0);
    const kdvToplam = items.reduce((s, i) => s + i.satirKdvTutari, 0);
    const genelToplam = items.reduce((s, i) => s + i.satirToplam, 0);
    const isEmpty = items.length === 0;

    const handleCheckout = () => {
        router.push("/cart");
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size={"lg"} className="relative gap-2">
                    <span className="text-sm font-medium">SEPET</span>
                    <span className="relative ">
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
                className="flex h-full w-full flex-col gap-0 sm:max-w-lg"
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
                        <Button variant="outline" onClick={() => router.push("/products")}>
                            Ürünlere Git
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 space-y-4 overflow-y-auto p-4">
                            {items.map((item) => (
                                <div
                                    key={item.productId}
                                    className="flex gap-4 rounded-lg border bg-card p-3"
                                >
                                    <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
                                        <Image
                                            src={getCartItemImageUrl(item.productId)}
                                            width={64}
                                            height={64}
                                            alt={item.urunAdi}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="truncate text-sm font-medium">
                                            {item.urunAdi}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            {item.urunKodu} · {item.miktar} {item.birimAdi}
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-primary">
                                            {formatPrice(item.satirToplam)}
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 flex-col items-end gap-1">
                                        <div className="flex items-center gap-0.5 rounded border">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-7"
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.productId,
                                                        Math.max(1, item.miktar - 1)
                                                    )
                                                }
                                            >
                                                −
                                            </Button>
                                            <span className="min-w-6 text-center text-xs">
                                                {item.miktar}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-7"
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.productId,
                                                        item.miktar + 1
                                                    )
                                                }
                                            >
                                                +
                                            </Button>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() => removeItem(item.productId)}
                                        >
                                            <Trash2 className="size-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="shrink-0 border-t border-border bg-card p-4">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Ara Toplam</span>
                                    <span>{formatPrice(araToplam)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">KDV</span>
                                    <span>{formatPrice(kdvToplam)}</span>
                                </div>
                                <div className="flex justify-between border-t border-border pt-2 font-semibold">
                                    <span>Genel Toplam</span>
                                    <span className="text-primary">
                                        {formatPrice(genelToplam)}
                                    </span>
                                </div>
                            </div>
                            <SheetClose asChild>
                                <Button
                                    className="mt-4 w-full"
                                    size="lg"
                                    onClick={handleCheckout}
                                >
                                    <ShoppingCart className="mr-2 size-4" />
                                    Siparişi Tamamla
                                </Button>
                            </SheetClose>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="mt-2 w-full justify-start"
                                onClick={() => setClearCartOpen(true)}
                            >
                                <Trash2 className="mr-2 size-4" />
                                Sepeti temizle
                            </Button>
                        </div>

                        <AlertDialog open={clearCartOpen} onOpenChange={setClearCartOpen}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Sepeti temizle</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Sepetteki tüm ürünler kaldırılacak. Emin misiniz?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => {
                                            clearCart();
                                            setClearCartOpen(false);
                                        }}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Evet, temizle
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
