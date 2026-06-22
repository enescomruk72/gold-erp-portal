'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartCollapsibleNoteField } from './CartCollapsibleNoteField';
import type { ICartItem } from '@/features/cart/store/cart.types';
import { getCartItemImageUrl } from '@/features/cart/lib/mock-cart-image';
import {
    formatCartGr,
    getBirimOrtalamaAgirlikGr,
    getTahminiToplamAgirlikGr,
} from '@/features/cart/lib/cart-calculations';
import { CartVariantSelections } from './CartVariantSelections';
import { cn } from '@/lib/utils';

type CartLineItemProps = {
    item: ICartItem;
    compact?: boolean;
    readOnly?: boolean;
    showNoteEditor?: boolean;
    onUpdateQuantity?: (lineKey: string, miktar: number) => void;
    onRemove?: (lineKey: string) => void;
    onUpdateNote?: (lineKey: string, note: string) => void;
};

function QuantityControls({
    item,
    compact,
    onUpdateQuantity,
}: {
    item: ICartItem;
    compact?: boolean;
    onUpdateQuantity: (lineKey: string, miktar: number) => void;
}) {
    return (
        <div className="w-fit flex items-center rounded-md border">
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className={compact ? 'size-7' : 'size-8'}
                onClick={() =>
                    onUpdateQuantity?.(item.lineKey, Math.max(1, item.miktar - 1))
                }
            >
                <Minus className={compact ? 'size-3' : 'size-3.5'} />
            </Button>
            <span
                className={cn(
                    'min-w-6 text-center font-medium tabular-nums',
                    compact ? 'text-xs' : 'text-sm'
                )}
            >
                {item.miktar}
            </span>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className={compact ? 'size-7' : 'size-8'}
                onClick={() => onUpdateQuantity?.(item.lineKey, item.miktar + 1)}
            >
                <Plus className={compact ? 'size-3' : 'size-3.5'} />
            </Button>
        </div>
    );
}

function WeightBlock({ item, compact }: { item: ICartItem; compact?: boolean }) {
    const birim = getBirimOrtalamaAgirlikGr(item);
    const toplam = getTahminiToplamAgirlikGr(item);

    return (
        <div
            className={cn(
                'flex flex-wrap gap-x-3 gap-y-0.5',
                compact ? 'text-[11px]' : 'text-xs'
            )}
        >
            <span className="text-muted-foreground">
                Ort. (adet):{' '}
                <span className="font-semibold tabular-nums text-foreground">
                    {formatCartGr(birim)} gr
                </span>
            </span>
            <span className="text-muted-foreground">
                Tahmini toplam:{' '}
                <span className="font-semibold tabular-nums text-foreground">
                    {formatCartGr(toplam)} gr
                </span>
            </span>
        </div>
    );
}

export function CartLineItem({
    item,
    compact = false,
    readOnly = false,
    showNoteEditor = false,
    onUpdateQuantity,
    onRemove,
    onUpdateNote,
}: CartLineItemProps) {
    const imageSrc = item.imageUrl ?? getCartItemImageUrl(item.productId);
    const birimGr = getBirimOrtalamaAgirlikGr(item);
    const selections = item.variantSelections ?? [];

    if (readOnly) {
        return (
            <div className="flex gap-3 rounded-xl border border-neutral-200/90 bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_6px_16px_rgba(0,0,0,0.06)]">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted sm:size-16">
                    <Image
                        src={imageSrc}
                        width={64}
                        height={64}
                        alt={item.urunAdi}
                        className="h-full w-full object-cover"
                    />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                        <h4 className="line-clamp-2 text-sm font-semibold leading-snug">
                            {item.urunAdi}
                        </h4>
                        <span className="shrink-0 rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-semibold tabular-nums">
                            {item.miktar} adet
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {item.urunKodu}
                        {item.ayarAdi ? ` · ${item.ayarAdi}` : ''}
                    </p>
                    <CartVariantSelections selections={selections} compact />
                    <WeightBlock item={item} compact />
                    {item.urunNotu ? (
                        <p className="text-[11px] italic text-muted-foreground">
                            Not: {item.urunNotu}
                        </p>
                    ) : null}
                </div>
            </div>
        );
    }

    if (compact) {
        return (
            <div className="flex gap-3 rounded-xl border border-neutral-200/90 bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_6px_16px_rgba(0,0,0,0.06)]">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image
                        src={imageSrc}
                        width={64}
                        height={64}
                        alt={item.urunAdi}
                        className="h-full w-full object-cover"
                    />
                    {birimGr > 0 ? (
                        <span className="absolute bottom-0 right-0 rounded-tl bg-primary px-1 py-0.5 text-[9px] font-medium text-primary-foreground">
                            ~{formatCartGr(birimGr)} gr
                        </span>
                    ) : null}
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-sm font-medium leading-snug">
                        {item.urunAdi}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        {item.urunKodu}
                        {item.ayarAdi ? ` · ${item.ayarAdi}` : ''}
                    </p>
                    <CartVariantSelections selections={selections} compact />
                    <WeightBlock item={item} compact />
                    {item.urunNotu && !showNoteEditor ? (
                        <p className="mt-1 line-clamp-2 text-[11px] italic text-muted-foreground">
                            Not: {item.urunNotu}
                        </p>
                    ) : null}
                </div>
                <div className="flex shrink-0 flex-col items-end justify-between gap-1">
                    {onUpdateQuantity ? (
                        <QuantityControls
                            item={item}
                            compact
                            onUpdateQuantity={onUpdateQuantity}
                        />
                    ) : null}
                    {onRemove ? (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-7 text-destructive hover:bg-destructive/10"
                            onClick={() => onRemove(item.lineKey)}
                        >
                            <Trash2 className="size-3.5" />
                        </Button>
                    ) : null}
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-neutral-200/90 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_6px_16px_rgba(0,0,0,0.06)] sm:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)]">
            <div className="flex gap-3 p-3 sm:gap-4 sm:p-4">
                <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-muted/50 sm:size-32">
                    <Image
                        src={imageSrc}
                        alt={item.urunAdi}
                        width={128}
                        height={128}
                        className="h-full w-full object-contain"
                    />
                    {birimGr > 0 ? (
                        <span className="absolute bottom-0.5 right-0.5 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                            ≈&nbsp;{formatCartGr(birimGr)} gr
                        </span>
                    ) : null}
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex justify-between gap-2">
                        <div className="min-w-0 flex-1">
                            <h4 className="line-clamp-2 text-sm font-semibold leading-tight sm:text-base">
                                {item.urunAdi}
                            </h4>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                {item.urunKodu} · {item.birimAdi}
                                {item.ayarAdi ? ` · ${item.ayarAdi}` : ''}
                            </p>
                        </div>
                        {onRemove ? (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-8 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => onRemove(item.lineKey)}
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        ) : null}
                    </div>

                    <CartVariantSelections selections={selections} />
                    <WeightBlock item={item} />
                    {onUpdateQuantity ? (
                        <QuantityControls
                            item={item}
                            onUpdateQuantity={onUpdateQuantity}
                        />
                    ) : null}

                    {showNoteEditor && onUpdateNote ? (
                        <CartCollapsibleNoteField
                            id={`cart-note-${item.lineKey}`}
                            label="Ürün notu"
                            addButtonLabel="Not Ekle"
                            value={item.urunNotu ?? ''}
                            onChange={(note) => onUpdateNote(item.lineKey, note)}
                            placeholder="Ürün için notunuzu yazın…"
                            rows={3}
                        />
                    ) : item.urunNotu ? (
                        <p className="text-xs italic text-muted-foreground">
                            Not: {item.urunNotu}
                        </p>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
