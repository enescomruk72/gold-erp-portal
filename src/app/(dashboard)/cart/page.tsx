"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2, Sparkles, SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    useCartStore,
    useCartTotalQuantity,
} from "@/features/cart";
import { getCartItemImageUrl } from "@/features/cart/lib/mock-cart-image";
import Image from "next/image";

function formatPrice(value: number) {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
    }).format(value);
}

/** Varsayılan has milyem (22 ayar altın), ürün verisi yoksa kullanılır */
const DEFAULT_HAS_MILYEM = 916;
/** Varsayılan işçilik milyem */
const DEFAULT_ISCILIK_MILYEM = 30;

function getMilyemValues(item: { hasMilyem?: number; iscilikMilyem?: number }) {
    const hasMilyem = item.hasMilyem ?? DEFAULT_HAS_MILYEM;
    const iscilikMilyem = item.iscilikMilyem ?? DEFAULT_ISCILIK_MILYEM;
    const hasMaliyet = hasMilyem + iscilikMilyem;
    return { hasMilyem, iscilikMilyem, hasMaliyet };
}

export default function CartPage() {
    const items = useCartStore((s) => s.items);
    const totalQuantity = useCartTotalQuantity();
    const updateQuantity = useCartStore((s) => s.updateQuantity);
    const removeItem = useCartStore((s) => s.removeItem);

    const araToplam = items.reduce((s, i) => s + i.satirAraToplam, 0);
    const kdvToplam = items.reduce((s, i) => s + i.satirKdvTutari, 0);
    const genelToplam = items.reduce((s, i) => s + i.satirToplam, 0);

    // Sipariş özeti: tüm miktarların has maliyet toplamı (miktar × hasMaliyet)
    const toplamHasMaliyetMilyem = items.reduce((acc, i) => {
        const { hasMaliyet } = getMilyemValues(i);
        return acc + hasMaliyet * i.miktar;
    }, 0);

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
            {/* Başlık */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                        Sepetim
                    </h1>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        {items.length} çeşit · {totalQuantity} ürün
                    </p>
                </div>
                <Button asChild variant={"link"} className="w-fit rounded-full px-base!">
                    <Link href="/products">
                        <ShoppingCart className="mr-2 size-4" />
                        Alışverişe Devam Et
                    </Link>
                </Button>
            </div>

            {/* Mobil: Özet üstte sticky | Desktop: 2 kolon */}
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:gap-8">
                {/* Ürün listesi - her zaman solda / üstte */}
                <div className="min-w-0 flex-1 space-y-3">
                    {items.map((item) => {
                        const { hasMilyem, iscilikMilyem, hasMaliyet } =
                            getMilyemValues(item);
                        const satirHasMaliyetMilyem = hasMaliyet * item.miktar;
                        return (
                            <Card
                                key={item.productId}
                                className="overflow-hidden border transition-colors py-0!"
                            >
                                <CardContent className="p-0">
                                    <div className="grid grid-cols-[96px_1fr] gap-3 p-3 sm:grid-cols-[128px_1fr_auto] sm:gap-4 sm:p-4">
                                        {/* Görsel */}
                                        <div className="relative row-span-2 flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted/50 sm:row-span-1 sm:size-32">
                                            <Image
                                                src={getCartItemImageUrl(item.productId)}
                                                alt={item.urunAdi}
                                                width={128}
                                                height={128}
                                                className="h-full w-full object-contain"
                                            />
                                            {item.agirlikGr != null && (
                                                <span className="absolute bottom-0.5 right-0.5 rounded bg-primary px-1.5 py-1 text-xs font-medium text-background truncate">
                                                    {item.agirlikGr} gr
                                                </span>
                                            )}
                                        </div>

                                        {/* Orta: Ürün + milyem */}
                                        <div className="flex min-w-0 flex-col justify-between gap-2 py-0.5">
                                            <div className="flex justify-between">

                                                <div className="flex-1">
                                                    <h4 className="line-clamp-2 text-sm font-semibold leading-tight sm:text-base">
                                                        {item.urunAdi}
                                                    </h4>
                                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                                        {item.urunKodu} · {item.birimAdi}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive sm:hidden"
                                                    onClick={() => removeItem(item.productId)}
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="flex items-center rounded-md border">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8"
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.productId,
                                                                Math.max(1, item.miktar - 1)
                                                            )
                                                        }
                                                    >
                                                        <Minus className="size-3" />
                                                    </Button>
                                                    <span className="min-w-6 text-center text-sm font-medium tabular-nums">
                                                        {item.miktar}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8"
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.productId,
                                                                item.miktar + 1
                                                            )
                                                        }
                                                    >
                                                        <Plus className="size-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                                                <span className="text-muted-foreground font-semibold">
                                                    Has {hasMilyem}‰ · İşçilik {iscilikMilyem}‰
                                                </span>
                                                <span className="font-semibold text-amber-700 dark:text-amber-400">
                                                    Has Maliyet {hasMaliyet}‰
                                                </span>
                                            </div>
                                        </div>

                                        {/* Sağ: Miktar, Toplam, Sil */}
                                        <div className="flex flex-col items-end justify-between gap-2 sm:gap-4">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive hidden sm:flex"
                                                onClick={() => removeItem(item.productId)}
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                            <div className="text-right">
                                                <p className="text-sm uppercase font-semibold tracking-wide text-muted-foreground">
                                                    {item.miktar}×{hasMaliyet}‰ = <span className="font-bold tabular-nums text-amber-700 dark:text-amber-400">{satirHasMaliyetMilyem}‰</span>
                                                </p>
                                                <p className="text-base font-bold tabular-nums sm:text-lg">
                                                    {formatPrice(item.satirToplam)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Sipariş özeti - sticky sağda */}
                <aside className="shrink-0 w-full lg:sticky xl:top-20 xl:w-96">
                    <Card className="overflow-hidden border shadow-sm py-base">
                        <CardHeader className="border-b bg-muted/30 py-0!">
                            <h2 className="text-lg font-semibold">
                                Sipariş Özeti
                            </h2>
                        </CardHeader>
                        <CardContent className="space-y-4 py-0">
                            {/* Toplam Has Maliyet - tüm miktarların has maliyet karşılığı */}
                            <div className="rounded-xl border border-amber-200/70 bg-amber-50/80 px-4 py-3 dark:border-amber-800/60 dark:bg-amber-950/40">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-amber-900 dark:text-amber-100">
                                        <Sparkles className="size-4" />
                                        Toplam Has Maliyet
                                    </div>
                                    <span className="text-lg font-bold tabular-nums text-amber-800 dark:text-amber-200">
                                        {toplamHasMaliyetMilyem.toLocaleString("tr-TR")}‰
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Tüm ürünlerin miktar × has maliyet toplamı
                                </p>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Ara Toplam
                                    </span>
                                    <span className="font-medium tabular-nums">
                                        {formatPrice(araToplam)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        KDV
                                    </span>
                                    <span className="font-medium tabular-nums">
                                        {formatPrice(kdvToplam)}
                                    </span>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-base font-semibold">
                                <span>Genel Toplam</span>
                                <span className="tabular-nums text-primary">
                                    {formatPrice(genelToplam)}
                                </span>
                            </div>
                            <Button
                                className="w-full rounded-full py-6 text-base font-semibold"
                                size="lg"
                            >
                                <SendHorizonal className="mr-2 size-5" />
                                Siparişi Tamamla
                            </Button>
                            <p className="text-center text-xs text-muted-foreground">
                                Ödeme adımına yönlendirileceksiniz
                            </p>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
}
