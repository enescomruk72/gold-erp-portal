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
import type { IProductDTO } from "@/features/products/types";
import { useGetProduct } from "@/features/products/api/use-get-product";
import { useCartStore } from "@/features/cart";
import { cn } from "@/lib/utils";
import { ProductImageGallery } from "./ProductImageGallery";

interface ProductDetailModalProps {
    product: IProductDTO | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/** Ürün görsel URL'lerini backend sırasına göre döner */
function getProductImageUrls(product: IProductDTO): string[] {
    return (product.images ?? [])
        .filter((image) => image.url)
        .sort((a, b) => {
            if (a.varsayilanMi && !b.varsayilanMi) return -1;
            if (!a.varsayilanMi && b.varsayilanMi) return 1;
            return a.siraNo - b.siraNo;
        })
        .map((image) => image.url as string);
}

export function ProductDetailModal({
    product,
    open,
    onOpenChange,
}: ProductDetailModalProps) {
    const productDetailQuery = useGetProduct(product?.id ?? null, open);
    const modalProduct = (productDetailQuery.data?.data ?? null) as IProductDTO | null;
    const { addItem, isInCart, getItemQuantity } = useCartStore();
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        setQuantity(1);
    }, [modalProduct?.id]);

    const birimFiyat = modalProduct?.satisFiyati ?? 0;

    const inCart = isInCart(modalProduct?.id ?? "");
    const cartQuantity = getItemQuantity(modalProduct?.id ?? "");
    const imageUrls = modalProduct ? getProductImageUrls(modalProduct) : [];
    const toplamIscilikMilyem =
        (modalProduct?.iscilikMilyem ?? 0) + (modalProduct?.karMilyem ?? 0);
    const isIscilikVisible =
        modalProduct?.iscilikMilyem != null || modalProduct?.karMilyem != null;
    const ortalamaAgirlik = modalProduct?.ortalamaAgirlik ?? 0;
    const toplamOrtalamaAgirlik = Math.round(quantity * ortalamaAgirlik * 1000) / 1000;

    if (!product) return null;

    if (!modalProduct) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent
                    showCloseButton={false}
                    className="max-h-[95dvh] w-[95vw] max-w-[calc(100%-2rem)] border-none bg-muted p-6 sm:max-w-2xl"
                >
                    <p className="text-sm text-muted-foreground">
                        Ürün detayları yükleniyor...
                    </p>
                    <DialogClose asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 z-10 shrink-0 rounded-full"
                        >
                            <XIcon className="size-4" />
                        </Button>
                    </DialogClose>
                </DialogContent>
            </Dialog>
        );
    }

    const handleAddToCart = async () => {
        setIsAdding(true);
        try {
            addItem(modalProduct, quantity, birimFiyat);
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
                            alt={modalProduct.urunAdi}
                            className="h-full"
                        />
                        {!modalProduct.aktifMi && (
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
                                        {modalProduct.urunAdi}
                                    </h2>
                                    <h3 className="text-sm tabular-nums font-semibold">
                                        MODEL #{modalProduct.urunModelKodu}
                                    </h3>
                                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground sm:text-sm">
                                        {modalProduct.urunKodu}
                                    </p>
                                    <div className="mt-2 flex flex-wrap items-center gap-x-3 text-xs">
                                        {isIscilikVisible && (
                                            <span className="text-muted-foreground">
                                                İşçilik {toplamIscilikMilyem}‰
                                            </span>
                                        )}
                                        <span className="text-muted-foreground">·</span>
                                        <span className="text-muted-foreground">
                                            Ortalama Ağırlık {ortalamaAgirlik} gr
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="min-h-0 flex-1 space-y-4 overflow-x-hidden overflow-y-auto p-4 pt-0 sm:space-y-5 lg:p-6">
                                {productDetailQuery.isPending && (
                                    <p className="text-sm text-muted-foreground">
                                        Ürün detayları yükleniyor...
                                    </p>
                                )}
                                {modalProduct.aciklama && (
                                    <p className="line-clamp-3 text-sm text-muted-foreground">
                                        {modalProduct.aciklama}
                                    </p>
                                )}

                                <div className="flex flex-wrap items-center gap-2">
                                    {modalProduct.kategori && (
                                        <Badge
                                            variant="outline"
                                            className="gap-1 text-xs"
                                        >
                                            <Tag className="size-3" />
                                            {modalProduct.kategori.kategoriAdi}
                                        </Badge>
                                    )}
                                    {modalProduct.marka && (
                                        <Badge
                                            variant="outline"
                                            className="gap-1 text-xs"
                                        >
                                            <Package className="size-3" />
                                            {modalProduct.marka.markaAdi}
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
                                        <div className="flex h-9 items-center rounded-md border bg-background px-3 text-sm font-medium">
                                            ADET
                                        </div>
                                    </div>
                                </div>

                                {/* Ürün bilgileri */}
                                <div className="space-y-2 rounded-lg bg-muted/60 p-4 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Toplam Ortalama Ağırlık
                                        </span>
                                        <span className="tabular-nums">
                                            {toplamOrtalamaAgirlik} gr
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            İşçilik (Toplam)
                                        </span>
                                        <span className="tabular-nums">
                                            {isIscilikVisible
                                                ? `${toplamIscilikMilyem}‰`
                                                : "—"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Materyal
                                        </span>
                                        <span className="tabular-nums">
                                            {modalProduct.materyal?.materyalAdi ?? "—"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Has Milyem
                                        </span>
                                        <span className="tabular-nums">
                                            {modalProduct.materyal?.milyemKatsayisi != null
                                                ? `${modalProduct.materyal.milyemKatsayisi}‰`
                                                : "—"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-t border-border pt-2 font-semibold">
                                        <span>Kategori</span>
                                        <span className="tabular-nums text-foreground">
                                            {modalProduct.kategori?.kategoriAdi ?? "—"}
                                        </span>
                                    </div>
                                    <p className="pt-1 text-[11px] text-muted-foreground">
                                        Uyarı: Ortalama ağırlık değeri ürünün net ağırlığını ifade etmez.
                                    </p>
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
                                            !modalProduct.aktifMi ||
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
                                        !modalProduct.aktifMi ||
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
