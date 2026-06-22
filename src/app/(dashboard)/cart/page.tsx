"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart";
import { CartWeightDisclaimer } from "@/features/cart/components/CartWeightDisclaimer";
import { CartItemList } from "@/features/cart/components/CartItemList";
import { CartOrderSummary } from "@/features/cart/components/CartOrderSummary";
import { getCartGroupCount } from "@/features/cart/lib/cart-group-items";

export default function CartPage() {
    const router = useRouter();
    const {
        items,
        siparisNotu,
        isLoading,
        hasCartAccess,
        updateQuantity,
        removeItem,
        updateItemNote,
        setSiparisNotu,
    } = useCart();
    const totalQuantity = items.reduce((sum, item) => sum + item.miktar, 0);
    const displayGroupCount = getCartGroupCount(items);

    if (!hasCartAccess) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 py-20">
                <p className="text-muted-foreground">Sepet erişiminiz bulunmuyor.</p>
                <Button asChild variant="outline">
                    <Link href="/products">Ürünlere Git</Link>
                </Button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-20">
                <div className="flex size-24 items-center justify-center rounded-2xl bg-muted/50">
                    <ShoppingCart className="size-12 text-muted-foreground" />
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-semibold">Sepetiniz boş</h2>
                    <p className="mt-2 text-muted-foreground">
                        Ürün eklemek için kataloğa gidin
                    </p>
                </div>
                <Button asChild size="lg" className="rounded-full px-8">
                    <Link href="/products">Ürünlere Git</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                        Sepetim
                    </h1>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        {displayGroupCount} çeşit · {totalQuantity} ürün
                    </p>
                </div>
                <Button asChild variant="link" className="w-fit rounded-full px-base!">
                    <Link href="/products">
                        <ShoppingCart className="mr-2 size-4" />
                        Alışverişe Devam Et
                    </Link>
                </Button>
            </div>

            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:gap-8">
                <div className="min-w-0 flex-1 space-y-4">
                    <CartWeightDisclaimer />

                    <CartItemList
                        items={items}
                        showNoteEditor
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeItem}
                        onUpdateNote={updateItemNote}
                    />
                </div>

                <aside className="w-full shrink-0 xl:sticky xl:top-20 xl:w-96">
                    <CartOrderSummary
                        items={items}
                        totalQuantity={totalQuantity}
                        siparisNotu={siparisNotu}
                        onSiparisNotuChange={setSiparisNotu}
                        showSiparisNotu
                        showCheckoutButton
                        onCheckout={() => router.push('/cart/payment')}
                    />
                </aside>
            </div>
        </div>
    );
}
