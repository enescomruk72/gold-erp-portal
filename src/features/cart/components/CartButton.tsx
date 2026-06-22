"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart";

export function CartButton() {
    const { items, hasCartAccess } = useCart();
    const totalQuantity = items.reduce((sum, item) => sum + item.miktar, 0);

    if (!hasCartAccess) return null;

    return (
        <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/cart" aria-label="Sepet">
                <ShoppingCart className="size-5" />
                {totalQuantity > 0 && (
                    <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary px-1 py-0 text-xs font-medium text-primary-foreground">
                        {totalQuantity > 99 ? "99+" : totalQuantity}
                    </span>
                )}
            </Link>
        </Button>
    );
}
