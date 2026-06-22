'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { CheckCircle2, AlertCircle, Loader2, Minus, Plus, ShoppingCart } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { buildCartLineKey } from '@/features/cart/lib/cart-line-key';
import { useCart } from '@/features/cart/hooks/use-cart';
import type { ICartItem } from '@/features/cart/store/cart.types';
import type { IProductDTO } from '@/features/products/types';
import type { VariantSelectionRow } from '@/features/products/lib/product-detail-variant-summary';
import { getMockProductImageUrl } from '@/features/products/lib/mock-product-images';
import { cn } from '@/lib/utils';
import { ApiClientError } from '@/lib/api/errors';

type ProductAddToCartModalProps = {
    product: IProductDTO | null;
    variantSelections?: VariantSelectionRow[];
    varyantId?: string;
    unitAverageWeightGr?: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const SUBMIT_DELAY_MS = 750;
const SUCCESS_DISPLAY_MS = 2200;
const ERROR_DISPLAY_MS = 4000;

type SubmitPhase = 'idle' | 'loading' | 'success' | 'error';

function resolveAddToCartErrorMessage(error: unknown): string {
    if (error instanceof ApiClientError) {
        if (error.statusCode === 409) {
            return 'Bu ürün sepetinizde zaten var veya daha önce eklenmişti. Lütfen tekrar deneyin.';
        }
        return error.message || 'Ürün sepete eklenemedi.';
    }
    if (error instanceof Error && error.message) {
        return error.message;
    }
    return 'Ürün sepete eklenirken bir hata oluştu. Lütfen tekrar deneyin.';
}

function formatGr(value: number): string {
    return value.toLocaleString('tr-TR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
}

function pickProductImageUrl(product: IProductDTO): string {
    const url =
        product.images?.find((img) => img.varsayilanMi && img.url)?.url ??
        product.images?.find((img) => img.url)?.url ??
        null;
    return url ?? getMockProductImageUrl(0);
}

type ProductAddToCartModalBodyProps = {
    product: IProductDTO;
    cartItem?: ICartItem;
    variantSelections: VariantSelectionRow[];
    varyantId?: string;
    unitAverageWeightGr?: number;
    onOpenChange: (open: boolean) => void;
    onBusyChange: (busy: boolean) => void;
};

function ProductAddToCartModalBody({
    product,
    cartItem,
    variantSelections,
    varyantId,
    unitAverageWeightGr,
    onOpenChange,
    onBusyChange,
}: ProductAddToCartModalBodyProps) {
    const { addItem } = useCart();

    const [quantity, setQuantity] = useState(() => cartItem?.miktar ?? 1);
    const [urunNotu, setUrunNotu] = useState(() => cartItem?.urunNotu ?? '');
    const [submitPhase, setSubmitPhase] = useState<SubmitPhase>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const isSubmitting = submitPhase === 'loading';
    const isSuccess = submitPhase === 'success';
    const isError = submitPhase === 'error';
    const isBusy = isSubmitting || isSuccess;

    useEffect(() => {
        onBusyChange(isSubmitting);
    }, [isSubmitting, onBusyChange]);

    useEffect(() => {
        if (!isSuccess) return;
        const timer = setTimeout(() => onOpenChange(false), SUCCESS_DISPLAY_MS);
        return () => clearTimeout(timer);
    }, [isSuccess, onOpenChange]);

    useEffect(() => {
        if (!isError) return;
        const timer = setTimeout(() => {
            setSubmitPhase('idle');
            setErrorMessage(null);
        }, ERROR_DISPLAY_MS);
        return () => clearTimeout(timer);
    }, [isError]);

    const birimOrtalamaGr =
        unitAverageWeightGr ??
        product.ortalamaAgirlik ??
        product.agirlikGr ??
        0;
    const toplamOrtalamaGr = useMemo(
        () => Math.round(birimOrtalamaGr * quantity * 100) / 100,
        [birimOrtalamaGr, quantity]
    );
    const ayarLabel = product.ayar?.ayarAdi ?? '—';
    const imageUrl = useMemo(() => pickProductImageUrl(product), [product]);
    const hasVariants = variantSelections.length > 0;

    const handleSubmit = async () => {
        if (quantity < 1 || submitPhase !== 'idle') return;
        setErrorMessage(null);
        setSubmitPhase('loading');
        try {
            await new Promise<void>((resolve) => {
                setTimeout(resolve, SUBMIT_DELAY_MS);
            });
            await addItem(product, quantity, undefined, {
                urunNotu,
                quantityMode: 'set',
                variantSelections,
                ...(varyantId ? { varyantId } : {}),
                birimOrtalamaAgirlikGr: birimOrtalamaGr,
            });
            setSubmitPhase('success');
        } catch (error) {
            setErrorMessage(resolveAddToCartErrorMessage(error));
            setSubmitPhase('error');
        }
    };

    return (
        <div className="relative">
            {isSuccess ? (
                <div
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-emerald-600 px-6 text-white animate-in fade-in duration-300"
                    role="status"
                    aria-live="polite"
                    onClick={() => onOpenChange(false)}
                >
                    <CheckCircle2 className="size-14 stroke-[1.5]" />
                    <p className="text-lg font-semibold">Sepete eklendi</p>
                    <p className="text-center text-sm text-emerald-50">
                        {quantity} adet ürün sepetinize kaydedildi
                    </p>
                </div>
            ) : null}
            {isError ? (
                <div
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-destructive px-6 text-white animate-in fade-in duration-300"
                    role="alert"
                    aria-live="assertive"
                    onClick={() => {
                        setSubmitPhase('idle');
                        setErrorMessage(null);
                    }}
                >
                    <AlertCircle className="size-14 stroke-[1.5]" />
                    <p className="text-lg font-semibold">Sepete eklenemedi</p>
                    <p className="text-center text-sm text-red-50">
                        {errorMessage ?? 'Bir hata oluştu. Lütfen tekrar deneyin.'}
                    </p>
                    <p className="text-center text-xs text-red-100/90">Kapatmak için tıklayın</p>
                </div>
            ) : null}
            <DialogHeader className="border-b border-neutral-200 px-5 py-4">
                <DialogTitle className="text-base font-semibold">Sepete Ekle</DialogTitle>
            </DialogHeader>

            <div
                className={cn(
                    'space-y-5 px-5 py-4 transition-opacity',
                    isSubmitting && 'pointer-events-none opacity-60'
                )}
            >
                <div className="flex gap-4">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50">
                        <Image
                            src={imageUrl}
                            alt={product.urunAdi}
                            width={80}
                            height={80}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                        <p className="line-clamp-2 text-sm font-semibold text-neutral-900">
                            {product.urunAdi}
                        </p>
                        <p className="text-xs text-neutral-600">
                            Ayar:{' '}
                            <span className="font-medium text-neutral-900">{ayarLabel}</span>
                        </p>
                        <p className="text-xs text-neutral-600">
                            Ort. gramaj (adet):{' '}
                            <span className="font-semibold tabular-nums text-neutral-900">
                                {formatGr(birimOrtalamaGr)} gr
                            </span>
                        </p>
                    </div>
                </div>

                {hasVariants ? (
                    <div className="space-y-2 rounded-md bg-neutral-50 px-3 py-2.5">
                        <p className="text-xs font-medium text-neutral-600">Seçili varyant</p>
                        <ul className="space-y-1">
                            {variantSelections.map((row) => (
                                <li
                                    key={`${row.axisLabel}-${row.valueLabel}`}
                                    className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 text-sm"
                                >
                                    <span className="text-neutral-600">{row.axisLabel}</span>
                                    <span className="font-semibold text-neutral-900">
                                        {row.valueLabel}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}

                <div className="space-y-2">
                    <Label htmlFor="add-to-cart-qty" className="text-sm font-medium">
                        Miktar (adet)
                    </Label>
                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-10 shrink-0"
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            disabled={quantity <= 1 || isBusy}
                            aria-label="Miktarı azalt"
                        >
                            <Minus className="size-4" />
                        </Button>
                        <input
                            id="add-to-cart-qty"
                            type="number"
                            min={1}
                            value={quantity}
                            onChange={(e) => {
                                const v = parseInt(e.target.value, 10);
                                setQuantity(Number.isFinite(v) && v >= 1 ? v : 1);
                            }}
                            disabled={isBusy}
                            className="h-10 w-20 rounded-md border border-neutral-200 text-center text-sm font-semibold tabular-nums outline-none focus-visible:border-[#0b57d0] focus-visible:ring-2 focus-visible:ring-[#0b57d0]/20 disabled:opacity-60"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-10 shrink-0"
                            onClick={() => setQuantity((q) => q + 1)}
                            disabled={isBusy}
                            aria-label="Miktarı artır"
                        >
                            <Plus className="size-4" />
                        </Button>
                    </div>
                    <div className="flex items-center justify-between rounded-md bg-neutral-100 px-3 py-2.5 text-sm">
                        <span className="text-neutral-600">Toplam ort. gramaj</span>
                        <span className="font-bold tabular-nums text-neutral-900">
                            {formatGr(toplamOrtalamaGr)} gr
                        </span>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="add-to-cart-note" className="text-sm font-medium">
                        Ürün notu
                    </Label>
                    <Textarea
                        id="add-to-cart-note"
                        value={urunNotu}
                        onChange={(e) => setUrunNotu(e.target.value)}
                        placeholder="Bu ürün için özel talep veya notunuzu yazın…"
                        rows={3}
                        disabled={isBusy}
                        className="resize-none text-sm"
                    />
                    <p className="text-xs text-neutral-500">
                        Not yalnızca bu ürün satırına kaydedilir. Sipariş genel notu sepet
                        sayfasından eklenebilir.
                    </p>
                </div>
            </div>

            <DialogFooter
                className={cn(
                    'relative flex-row gap-2 border-t border-neutral-200 px-5 py-4 sm:justify-end',
                    submitPhase === 'loading' && 'pointer-events-none'
                )}
            >
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1 sm:flex-none"
                    onClick={() => onOpenChange(false)}
                    disabled={isSubmitting}
                >
                    Vazgeç
                </Button>
                <Button
                    type="button"
                    className={cn(
                        'flex-1 bg-[#0b57d0] hover:bg-[#0b57d0]/90 sm:flex-none',
                        submitPhase === 'loading' && 'min-w-[140px]'
                    )}
                    onClick={handleSubmit}
                    disabled={!product.aktifMi || quantity < 1 || isBusy}
                >
                    {isSubmitting ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                        <ShoppingCart className="mr-2 size-4" />
                    )}
                    {isSubmitting ? 'Ekleniyor…' : 'Sepete Ekle'}
                </Button>
            </DialogFooter>
        </div>
    );
}

export function ProductAddToCartModal({
    product,
    variantSelections = [],
    varyantId,
    unitAverageWeightGr,
    open,
    onOpenChange,
}: ProductAddToCartModalProps) {
    const { findItemByVariant } = useCart();
    const cartItem = product
        ? findItemByVariant(product.id, variantSelections, varyantId)
        : undefined;
    const isSubmittingRef = useRef(false);

    const handleBusyChange = useCallback((submitting: boolean) => {
        isSubmittingRef.current = submitting;
    }, []);

    const handleOpenChange = useCallback(
        (next: boolean) => {
            if (next) {
                onOpenChange(true);
                return;
            }
            if (isSubmittingRef.current) return;
            onOpenChange(false);
        },
        [onOpenChange]
    );

    if (!product) return null;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="z-101 gap-0 overflow-hidden p-0 sm:max-w-lg"
                onInteractOutside={(e) => {
                    if (isSubmittingRef.current) e.preventDefault();
                }}
                onEscapeKeyDown={(e) => {
                    if (isSubmittingRef.current) e.preventDefault();
                }}
            >
                {open ? (
                    <ProductAddToCartModalBody
                        key={buildCartLineKey(product.id, variantSelections)}
                        product={product}
                        cartItem={cartItem}
                        variantSelections={variantSelections}
                        varyantId={varyantId}
                        unitAverageWeightGr={unitAverageWeightGr}
                        onOpenChange={handleOpenChange}
                        onBusyChange={handleBusyChange}
                    />
                ) : null}
            </DialogContent>
        </Dialog>
    );
}
