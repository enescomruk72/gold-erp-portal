"use client";

import { useState, useCallback, useRef } from "react";
import { Info, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { IProductDTO } from "@/features/products/types";
import { getMockProductImageUrl } from "@/features/products/lib/mock-product-images";
import {
    getHasFromUrunAdi,
    getIscilikFromProductId,
} from "@/features/products/lib/milyem-utils";
import { useCartStore } from "@/features/cart";
import { cn } from "@/lib/utils";

interface ProductCardProps {
    product: IProductDTO;
    /** Liste indeksi - mock görsel seçimi için (product.images yoksa) */
    index?: number;
    onDetailClick?: (product: IProductDTO) => void;
}

function getCardImageUrls(_product: IProductDTO, index: number = 0): string[] {
    return [getMockProductImageUrl(index)];
}

export function ProductCard({
    product,
    index = 0,
    onDetailClick,
}: ProductCardProps) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const addItem = useCartStore((s) => s.addItem);
    const isInCart = useCartStore((s) => s.isInCart);
    const getItemQuantity = useCartStore((s) => s.getItemQuantity);
    const touchStartX = useRef<number | null>(null);

    const imageUrls = getCardImageUrls(product, index);
    const imageCount = imageUrls.length;
    const hasMultipleImages = imageCount > 1;

    const handleImageAreaMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!hasMultipleImages) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const index = Math.min(
                imageCount - 1,
                Math.floor(x * imageCount)
            );
            setActiveImageIndex(index);
        },
        [hasMultipleImages, imageCount]
    );

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    }, []);

    const handleTouchEnd = useCallback(
        (e: React.TouchEvent) => {
            if (touchStartX.current === null || !hasMultipleImages) return;
            const endX = e.changedTouches[0].clientX;
            const delta = touchStartX.current - endX;
            touchStartX.current = null;
            if (Math.abs(delta) < 50) return;
            if (delta > 0) {
                setActiveImageIndex((i) => Math.min(imageCount - 1, i + 1));
            } else {
                setActiveImageIndex((i) => Math.max(0, i - 1));
            }
            e.preventDefault();
        },
        [hasMultipleImages, imageCount]
    );

    const formatPrice = (price?: number) => {
        if (price == null) return "Fiyat belirtilmemiş";
        return new Intl.NumberFormat("tr-TR", {
            style: "decimal",
        }).format(price);
    };

    const primaryImageUrl = imageUrls[activeImageIndex] || imageUrls[0];

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.stopPropagation();
        addItem(product, 1);
    };

    const inCart = isInCart(product.id);
    const cartQty = getItemQuantity(product.id);

    const hasMilyem = getHasFromUrunAdi(product.urunAdi);
    const iscilikMilyem = getIscilikFromProductId(product.id);

    return (
        <Card
            className="group relative cursor-pointer overflow-hidden rounded-xl py-0 transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-lg"
            onClick={() => onDetailClick?.(product)}
        >
            {/* Hızlı sepete ekle butonu */}
            <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 top-2 z-10 size-9 rounded-full opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                onClick={handleQuickAdd}
                title="Sepete ekle"
            >
                <ShoppingCart className="size-4" />
            </Button>
            {inCart && (
                <Badge
                    variant="secondary"
                    className="absolute left-2 top-2 z-10 text-xs"
                >
                    Sepette · {cartQty}
                </Badge>
            )}
            {!product.aktifMi && (
                <Badge
                    variant="destructive"
                    className="absolute right-2 top-2 z-10"
                >
                    Pasif
                </Badge>
            )}

            {/* md altı: görsel sol, içerik sağ (yatay). md+: görsel üst, içerik alt (dikey) */}
            <div className="flex flex-row md:flex-col">
                {/* Görsel - sol (md altı) / üst (md+) */}
                <div
                    className="relative shrink-0 w-28 aspect-square overflow-hidden rounded-l-xl rounded-r-none bg-muted touch-pan-y md:w-full md:aspect-square md:rounded-l-none md:rounded-t-xl"
                    onMouseMove={handleImageAreaMouseMove}
                    onMouseLeave={() => setActiveImageIndex(0)}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {primaryImageUrl ? (
                        <>
                            <img
                                src={primaryImageUrl}
                                alt={product.urunAdi}
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                            {hasMultipleImages && (
                                <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1 rounded-full border border-border bg-background/90 px-2 py-1 backdrop-blur-sm">
                                    {imageUrls.map((_, i) => (
                                        <span
                                            key={i}
                                            className={cn(
                                                "h-1.5 w-1.5 rounded-full transition-colors",
                                                activeImageIndex === i
                                                    ? "bg-primary"
                                                    : "bg-muted-foreground/40"
                                            )}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <Info className="h-12 w-12 text-muted-foreground" />
                        </div>
                    )}
                </div>

                <CardContent className="flex min-w-0 flex-1 flex-col justify-center gap-0 py-3 md:py-4 md:gap-1.5">
                    {/* Üst: ürün adı, kodu, marka (md altı sol blok) */}
                    <div className="space-y-0.5 md:space-y-1.5">
                        <h3 className="line-clamp-2 font-semibold leading-tight text-foreground">
                            {product.urunAdi}
                        </h3>
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                            {product.urunKodu}
                        </p>
                        {product.marka?.markaAdi && (
                            <span className="inline-block rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs font-medium">
                                {product.marka.markaAdi}
                            </span>
                        )}
                    </div>

                    {/* Alt: has maliyet, fiyat, kategori */}
                    <div className="mt-2 flex flex-col gap-0.5 md:mt-0 md:gap-1.5 md:pt-2">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
                            <span className="font-medium text-amber-700 dark:text-amber-400">
                                Has {hasMilyem}‰
                            </span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground">
                                İşçilik {iscilikMilyem}‰
                            </span>
                        </div>
                        <p className="text-base font-bold text-primary md:text-lg">
                            {formatPrice(product.satisFiyati)}{" "}
                            <span className="text-xs font-normal text-muted-foreground">
                                TL
                            </span>
                        </p>
                        {product.kategori?.kategoriAdi && (
                            <p className="line-clamp-1 text-[11px] text-muted-foreground">
                                {product.kategori.kategoriAdi}
                            </p>
                        )}
                    </div>
                </CardContent>
            </div>
        </Card>
    );
}
