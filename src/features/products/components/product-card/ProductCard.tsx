"use client";

import { useState, useCallback, useRef } from "react";
import { Info, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { IProductDTO } from "@/features/products/types";
import { useCartStore } from "@/features/cart";
import { cn } from "@/lib/utils";

interface ProductCardProps {
    product: IProductDTO;
    onDetailClick?: (product: IProductDTO) => void;
}

function getCardImageUrls(product: IProductDTO): string[] {
    return (product.images ?? [])
        .filter((image) => image.url)
        .sort((a, b) => {
            if (a.varsayilanMi && !b.varsayilanMi) return -1;
            if (!a.varsayilanMi && b.varsayilanMi) return 1;
            return a.siraNo - b.siraNo;
        })
        .map((image) => image.url as string);
}

export function ProductCard({
    product,
    onDetailClick,
}: ProductCardProps) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const addItem = useCartStore((s) => s.addItem);
    const isInCart = useCartStore((s) => s.isInCart);
    const getItemQuantity = useCartStore((s) => s.getItemQuantity);
    const touchStartX = useRef<number | null>(null);

    const imageUrls = getCardImageUrls(product);
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

    const primaryImageUrl = imageUrls[activeImageIndex] || imageUrls[0];

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.stopPropagation();
        addItem(product, 1);
    };

    const inCart = isInCart(product.id);
    const cartQty = getItemQuantity(product.id);

    const toplamIscilikMilyem =
        (product.iscilikMilyem ?? 0) + (product.karMilyem ?? 0);
    const isIscilikVisible =
        product.iscilikMilyem != null || product.karMilyem != null;

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
            {(product.marka?.markaAdi || inCart) && (
                <div className="absolute left-2 top-2 z-10 flex max-w-[calc(100%-4rem)] flex-col items-start gap-1">
                    {product.marka?.markaAdi ? (
                        <Badge variant="secondary" className="text-xs shadow-sm">
                            {product.marka.markaAdi}
                        </Badge>
                    ) : null}
                    {inCart ? (
                        <Badge
                            variant="outline"
                            className="border-primary/30 bg-background/95 text-xs shadow-sm backdrop-blur-sm"
                        >
                            Sepette · {cartQty}
                        </Badge>
                    ) : null}
                </div>
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
                        {product.urunModelKodu ? (
                            <p className="line-clamp-1 text-xs font-medium tabular-nums text-muted-foreground">
                                MODEL {product.urunModelKodu}
                            </p>
                        ) : null}
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                            {product.urunKodu}
                        </p>
                    </div>

                    {/* Alt: mantıksal ürün bilgileri */}
                    <div className="mt-2 flex flex-col gap-0.5 md:mt-0 md:gap-1.5 md:pt-2">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs">
                            {isIscilikVisible ? (
                                <span className="text-muted-foreground">
                                    İşçilik {toplamIscilikMilyem}‰
                                </span>
                            ) : null}
                            {product.materyal?.milyemKatsayisi != null ? (
                                <span className="text-muted-foreground">
                                    Has {product.materyal.milyemKatsayisi}‰
                                </span>
                            ) : null}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            <Badge variant="outline" className="text-[11px] font-normal tabular-nums">
                                Ort. {product.ortalamaAgirlik ?? 0}
                            </Badge>
                            {product.materyal?.materyalAdi ? (
                                <Badge variant="outline" className="max-w-full truncate text-[11px] font-normal">
                                    {product.materyal.materyalAdi}
                                </Badge>
                            ) : null}

                            <Badge variant="outline" className="max-w-full truncate text-[11px] font-normal">
                                {(product.materyal?.milyemKatsayisi ?? 0) * 1000}‰ Milyem
                            </Badge>
                        </div>
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
