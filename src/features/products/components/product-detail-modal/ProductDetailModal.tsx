"use client";

import { useState, useEffect } from "react";
import {
    ShoppingCart,
    Minus,
    Plus,
    Package,
    Tag,
    XIcon,
} from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { IProductDTO } from "@/features/products/types";
import {
    getHasFromUrunAdi,
    getIscilikFromProductId,
} from "@/features/products/lib/milyem-utils";
import { useCartStore } from "@/features/cart";
import { MOCK_PRODUCT_IMAGE_URLS } from "@/features/products/lib/mock-product-images";
import { cn } from "@/lib/utils";
import { ProductImageGallery } from "./ProductImageGallery";

/** Miktar birimleri */
const MIKTAR_BIRIMLERI = [
    { value: "ADET", label: "Adet" },
    { value: "GRAM", label: "Gram" },
    { value: "KG", label: "Kilogram" },
    { value: "METRE", label: "Metre" },
] as const;

interface ProductDetailModalProps {
    product: IProductDTO | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function formatPrice(price?: number) {
    if (!price && price !== 0) return "—";
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
    }).format(price);
}

/** Thumbnails için minimum görsel sayısı */
const MIN_THUMBNAIL_COUNT = 3;

/** Ürün görsel URL'lerini döner: ilk görsel mock, sonra product.images + ek mock */
function getProductImageUrls(product: IProductDTO): string[] {
    const baseIndex =
        Math.abs(
            product.id.split("").reduce((a, c) => (a + c.charCodeAt(0)) | 0, 0)
        ) % MOCK_PRODUCT_IMAGE_URLS.length;
    const mockUrls = MOCK_PRODUCT_IMAGE_URLS;
    const firstMock = mockUrls[baseIndex];
    const fromProduct = product.images?.length
        ? product.images.map((img) => img.url)
        : [];
    const combined = [firstMock, ...fromProduct];
    const needed = Math.max(MIN_THUMBNAIL_COUNT - combined.length, 0);
    const extras = Array.from({ length: needed }, (_, i) =>
        mockUrls[(baseIndex + 1 + i) % mockUrls.length]
    );
    return [...combined, ...extras];
}

export function ProductDetailModal({
    product,
    open,
    onOpenChange,
}: ProductDetailModalProps) {
    const { addItem, isInCart, getItemQuantity } = useCartStore();
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [indirimOrani, setIndirimOrani] = useState(0);
    const [ekMaliyet, setEkMaliyet] = useState(0);
    const [miktarBirimi, setMiktarBirimi] = useState<string>(
        () => product?.birim?.birimKodu ?? "ADET"
    );

    useEffect(() => {
        setQuantity(1);
        setIndirimOrani(0);
        setEkMaliyet(0);
        setMiktarBirimi(product?.birim?.birimKodu ?? "ADET");
    }, [product?.id, product?.birim?.birimKodu]);

    const birimFiyat = product?.satisFiyati ?? 0;
    const ara = quantity * birimFiyat;
    const indirim = ara * (indirimOrani / 100);
    const araToplam = Math.round(ara * 100) / 100;
    const indirimTutari = Math.round(indirim * 100) / 100;
    const toplam = Math.round((ara - indirim + ekMaliyet) * 100) / 100;

    const inCart = isInCart(product?.id ?? "");
    const cartQuantity = getItemQuantity(product?.id ?? "");
    const imageUrls = product ? getProductImageUrls(product) : [];

    if (!product) return null;

    const handleAddToCart = async () => {
        const birimFiyatHesaplanan =
            quantity > 0 ? toplam / quantity : birimFiyat;
        setIsAdding(true);
        try {
            addItem(product, quantity, birimFiyatHesaplanan);
            await new Promise((r) => setTimeout(r, 300));
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                className="max-h-[95dvh] w-[95vw] max-w-[calc(100%-2rem)] flex flex-col gap-0 overflow-x-hidden overflow-y-auto border-none bg-muted p-0 sm:max-w-6xl"
            >
                <div className="grid min-h-0 grid-cols-1 items-stretch gap-base lg:grid-cols-2">
                    {/* 1. Sütun: Görsel */}
                    <div className="relative flex shrink-0 flex-col p-base pb-0 lg:col-span-1 lg:min-h-0 lg:flex-1 lg:pb-base lg:pr-0">
                        <ProductImageGallery
                            imageUrls={imageUrls}
                            alt={product.urunAdi}
                            className="h-full"
                        />
                        {!product.aktifMi && (
                            <Badge
                                variant="destructive"
                                className="absolute right-4 top-4 z-10"
                            >
                                Pasif
                            </Badge>
                        )}
                    </div>

                    {/* 2. Sütun: Detaylar */}
                    <div className="flex min-h-0 flex-col p-base pt-0 lg:col-span-1 lg:pt-base lg:pl-0">
                        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg bg-card shadow-sm lg:rounded-l-2xl">
                            <div className="flex shrink-0 flex-row items-start justify-between gap-3 p-4 pb-2 lg:px-6">
                                <div className="min-w-0 flex-1">
                                    <h2 className="line-clamp-2 text-lg font-bold leading-tight sm:text-xl lg:text-2xl">
                                        {product.urunAdi}
                                    </h2>
                                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground sm:text-sm">
                                        {product.urunKodu}
                                    </p>
                                    <div className="mt-2 flex flex-wrap items-center gap-x-3 text-xs">
                                        <span className="font-medium text-amber-700 dark:text-amber-400">
                                            Has {getHasFromUrunAdi(product.urunAdi)}‰
                                        </span>
                                        <span className="text-muted-foreground">·</span>
                                        <span className="text-muted-foreground">
                                            İşçilik {getIscilikFromProductId(product.id)}‰
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="min-h-0 flex-1 space-y-4 overflow-x-hidden overflow-y-auto p-4 pt-0 sm:space-y-5 lg:p-6">
                                {product.aciklama && (
                                    <p className="line-clamp-3 text-sm text-muted-foreground">
                                        {product.aciklama}
                                    </p>
                                )}

                                <div className="flex flex-wrap items-center gap-2">
                                    {product.kategori && (
                                        <Badge
                                            variant="outline"
                                            className="gap-1 text-xs"
                                        >
                                            <Tag className="size-3" />
                                            {product.kategori.kategoriAdi}
                                        </Badge>
                                    )}
                                    {product.marka && (
                                        <Badge
                                            variant="outline"
                                            className="gap-1 text-xs"
                                        >
                                            <Package className="size-3" />
                                            {product.marka.markaAdi}
                                        </Badge>
                                    )}
                                    {inCart && (
                                        <Badge
                                            variant="secondary"
                                            className="ml-auto text-xs"
                                        >
                                            Sepette ({cartQuantity})
                                        </Badge>
                                    )}
                                </div>

                                <p className="text-2xl font-bold text-primary lg:text-3xl">
                                    {formatPrice(birimFiyat)}
                                    <span className="ml-1 text-sm font-normal text-muted-foreground">
                                        / {product.birim?.birimAdi ?? "Adet"}
                                    </span>
                                </p>

                                {/* Miktar + Miktar birimi */}
                                <div className="flex items-end gap-3">
                                    <div className="w-fit space-y-1.5">
                                        <Label className="text-xs">
                                            Miktar
                                        </Label>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-9 w-9"
                                                onClick={() =>
                                                    setQuantity((q) =>
                                                        Math.max(0, q - 1)
                                                    )
                                                }
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <Input
                                                type="number"
                                                min={0}
                                                value={quantity}
                                                onChange={(e) =>
                                                    setQuantity(
                                                        Math.max(
                                                            0,
                                                            parseFloat(
                                                                e.target.value
                                                            ) || 0
                                                        )
                                                    )
                                                }
                                                className="h-9 w-16 text-center"
                                            />
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-9 w-9"
                                                onClick={() =>
                                                    setQuantity((q) => q + 1)
                                                }
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <Label className="mb-1.5 block text-xs">
                                            Miktar birimi
                                        </Label>
                                        <Select
                                            value={miktarBirimi}
                                            onValueChange={setMiktarBirimi}
                                        >
                                            <SelectTrigger className="h-9">
                                                <SelectValue placeholder="Birim seçin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {MIKTAR_BIRIMLERI.map((b) => (
                                                    <SelectItem
                                                        key={b.value}
                                                        value={b.value}
                                                    >
                                                        {b.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Özet */}
                                <div className="space-y-2 rounded-lg bg-muted/60 p-4 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Ara Toplam
                                        </span>
                                        <span className="tabular-nums">
                                            {formatPrice(araToplam)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            İndirim
                                        </span>
                                        <span className="tabular-nums text-destructive">
                                            -{formatPrice(indirimTutari)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Ek Maliyet
                                        </span>
                                        <span className="tabular-nums">
                                            +{formatPrice(ekMaliyet)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-t border-border pt-2 font-semibold">
                                        <span>Toplam</span>
                                        <span className="tabular-nums text-foreground">
                                            {formatPrice(toplam)}
                                        </span>
                                    </div>
                                </div>

                                {/* Sepete ekle – desktop */}
                                <div className="hidden pt-2 lg:block">
                                    <Button
                                        className={cn(
                                            "w-full",
                                            inCart &&
                                            "bg-green-600 hover:bg-green-700"
                                        )}
                                        size="lg"
                                        onClick={handleAddToCart}
                                        disabled={
                                            !product.aktifMi ||
                                            quantity <= 0 ||
                                            isAdding
                                        }
                                    >
                                        <ShoppingCart className="mr-2 h-5 w-5" />
                                        {isAdding
                                            ? "Ekleniyor..."
                                            : inCart
                                                ? "Sepete Tekrar Ekle"
                                                : "Sepete Ekle"}
                                    </Button>
                                </div>
                            </div>

                            {/* Sepete ekle – mobil sticky */}
                            <div className="sticky bottom-0 z-10 border-t border-border bg-card p-4 lg:hidden">
                                <Button
                                    className={cn(
                                        "w-full",
                                        inCart &&
                                        "bg-green-600 hover:bg-green-700"
                                    )}
                                    size="lg"
                                    onClick={handleAddToCart}
                                    disabled={
                                        !product.aktifMi ||
                                        quantity <= 0 ||
                                        isAdding
                                    }
                                >
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    {isAdding
                                        ? "Ekleniyor..."
                                        : inCart
                                            ? "Sepete Tekrar Ekle"
                                            : "Sepete Ekle"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogClose asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-6 right-6 z-10 shrink-0 rounded-full"
                    >
                        <XIcon className="size-4" />
                    </Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}
