'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { CartCollapsibleNoteField } from './CartCollapsibleNoteField';
import type { ICartItem } from '@/features/cart/store/cart.store';
import {
    extractSlicerSelections,
    getVarianterSelectionsForLine,
} from '@/features/cart/lib/cart-group-items';
import { getCartItemImageUrl } from '@/features/cart/lib/mock-cart-image';
import {
    formatCartGr,
    getBirimOrtalamaAgirlikGr,
    getGroupTahminiToplamAgirlikGr,
    getGroupTotalQuantity,
    getTahminiToplamAgirlikGr,
} from '@/features/cart/lib/cart-calculations';
import { CartVariantSelections } from './CartVariantSelections';
import { cn } from '@/lib/utils';

type CartProductGroupCardProps = {
    lines: ICartItem[];
    compact?: boolean;
    readOnly?: boolean;
    showNoteEditor?: boolean;
    onUpdateQuantity?: (lineKey: string, miktar: number) => void;
    onRemove?: (lineKey: string) => void;
    onUpdateNote?: (lineKey: string, note: string) => void;
};

const groupCardShell = (compact?: boolean) =>
    cn(
        'overflow-hidden rounded-xl border border-neutral-200/90 bg-white',
        'shadow-[0_1px_2px_rgba(0,0,0,0.06),0_6px_16px_rgba(0,0,0,0.06)]',
        !compact && 'sm:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)]'
    );

function GroupSummary({
    lines,
    compact,
}: {
    lines: ICartItem[];
    compact?: boolean;
}) {
    const totalQuantity = getGroupTotalQuantity(lines);
    const totalWeight = getGroupTahminiToplamAgirlikGr(lines);

    return (
        <div
            className={cn(
                'shrink-0 rounded-lg border border-neutral-200/90 bg-white text-right shadow-sm',
                compact ? 'min-w-[72px] px-2 py-1.5' : 'min-w-[88px] px-2.5 py-2 sm:min-w-[96px]'
            )}
        >
            <p
                className={cn(
                    'font-semibold uppercase tracking-wide text-muted-foreground',
                    compact ? 'text-[8px]' : 'text-[9px]'
                )}
            >
                Özet
            </p>
            <p
                className={cn(
                    'mt-0.5 font-bold tabular-nums text-foreground',
                    compact ? 'text-sm' : 'text-base'
                )}
            >
                {totalQuantity} adet
            </p>
            <p
                className={cn(
                    'mt-0.5 font-semibold tabular-nums text-muted-foreground',
                    compact ? 'text-[10px]' : 'text-xs'
                )}
            >
                ~{formatCartGr(totalWeight)} gr
            </p>
        </div>
    );
}

function VariantRowQuantity({
    item,
    compact,
    readOnly,
    onUpdateQuantity,
}: {
    item: ICartItem;
    compact?: boolean;
    readOnly?: boolean;
    onUpdateQuantity?: (lineKey: string, miktar: number) => void;
}) {
    if (readOnly) {
        return (
            <span className="shrink-0 rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-semibold tabular-nums">
                {item.miktar} adet
            </span>
        );
    }

    if (!onUpdateQuantity) return null;

    return (
        <div className="flex items-center rounded-lg border border-neutral-200 bg-neutral-50/80">
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn('rounded-r-none', compact ? 'size-7' : 'size-8')}
                onClick={() => onUpdateQuantity(item.lineKey, Math.max(1, item.miktar - 1))}
            >
                <Minus className={compact ? 'size-3' : 'size-3.5'} />
            </Button>
            <span
                className={cn(
                    'min-w-7 border-x border-neutral-200 bg-white px-1 text-center font-semibold tabular-nums',
                    compact ? 'py-1 text-xs' : 'py-1.5 text-sm'
                )}
            >
                {item.miktar}
            </span>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn('rounded-l-none', compact ? 'size-7' : 'size-8')}
                onClick={() => onUpdateQuantity(item.lineKey, item.miktar + 1)}
            >
                <Plus className={compact ? 'size-3' : 'size-3.5'} />
            </Button>
        </div>
    );
}

function VariantChips({
    selections,
    compact,
}: {
    selections: ReturnType<typeof getVarianterSelectionsForLine>;
    compact?: boolean;
}) {
    if (selections.length === 0) {
        return (
            <span
                className={cn(
                    'inline-flex rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-medium text-neutral-700',
                    compact ? 'text-[11px]' : 'text-xs'
                )}
            >
                Standart
            </span>
        );
    }

    return (
        <div className="flex flex-wrap gap-1.5">
            {selections.map((row) => (
                <span
                    key={`${row.axisLabel}-${row.valueLabel}`}
                    className={cn(
                        'inline-flex items-center gap-1 rounded-md border border-amber-200/80 bg-amber-50/90',
                        compact ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-0.5 text-xs'
                    )}
                >
                    <span className="text-amber-800/70">{row.axisLabel}</span>
                    <span className="font-semibold text-amber-950">{row.valueLabel}</span>
                </span>
            ))}
        </div>
    );
}

function VariantLineItem({
    item,
    index,
    slicerSelections,
    compact,
    readOnly,
    showNoteEditor,
    onUpdateQuantity,
    onRemove,
    onUpdateNote,
}: {
    item: ICartItem;
    index: number;
    slicerSelections: ReturnType<typeof extractSlicerSelections>;
    compact?: boolean;
    readOnly?: boolean;
    showNoteEditor?: boolean;
    onUpdateQuantity?: (lineKey: string, miktar: number) => void;
    onRemove?: (lineKey: string) => void;
    onUpdateNote?: (lineKey: string, note: string) => void;
}) {
    const varianterSelections = getVarianterSelectionsForLine(item, slicerSelections);
    const birimGr = getBirimOrtalamaAgirlikGr(item);
    const toplamGr = getTahminiToplamAgirlikGr(item);

    return (
        <article
            className={cn(
                'rounded-lg border border-neutral-200/90 bg-white',
                'shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
                compact ? 'p-2.5' : 'p-3 sm:p-3.5'
            )}
        >
            <div className="flex items-start gap-2.5 sm:gap-3">
                <span
                    className={cn(
                        'flex shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary tabular-nums',
                        compact ? 'size-5 text-[9px]' : 'size-6 text-[10px]'
                    )}
                    aria-hidden
                >
                    {index}
                </span>

                <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1 space-y-1.5">
                            <VariantChips selections={varianterSelections} compact={compact} />
                            <div
                                className={cn(
                                    'flex flex-wrap gap-x-3 gap-y-0.5 text-muted-foreground',
                                    compact ? 'text-[10px]' : 'text-[11px] sm:text-xs'
                                )}
                            >
                                <span>
                                    Ort. (adet):{' '}
                                    <span className="font-semibold tabular-nums text-foreground">
                                        {formatCartGr(birimGr)} gr
                                    </span>
                                </span>
                                <span>
                                    Tahmini toplam:{' '}
                                    <span className="font-semibold tabular-nums text-foreground">
                                        {formatCartGr(toplamGr)} gr
                                    </span>
                                </span>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-1">
                            <VariantRowQuantity
                                item={item}
                                compact={compact}
                                readOnly={readOnly}
                                onUpdateQuantity={onUpdateQuantity}
                            />
                            {!readOnly && onRemove ? (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className={cn(
                                        'text-destructive hover:bg-destructive/10',
                                        compact ? 'size-7' : 'size-8'
                                    )}
                                    onClick={() => onRemove(item.lineKey)}
                                    aria-label="Kalemi kaldır"
                                >
                                    <Trash2 className={compact ? 'size-3.5' : 'size-4'} />
                                </Button>
                            ) : null}
                        </div>
                    </div>

                    {readOnly && item.urunNotu ? (
                        <p className="rounded-md bg-neutral-50 px-2 py-1.5 text-[11px] italic text-muted-foreground">
                            Not: {item.urunNotu}
                        </p>
                    ) : null}

                    {!readOnly && showNoteEditor && onUpdateNote ? (
                        <CartCollapsibleNoteField
                            id={`cart-note-${item.lineKey}`}
                            label="Ürün notu"
                            addButtonLabel="Not Ekle"
                            value={item.urunNotu ?? ''}
                            onChange={(note) => onUpdateNote(item.lineKey, note)}
                            placeholder="Bu varyant için notunuzu yazın…"
                            rows={2}
                        />
                    ) : null}

                    {!readOnly && !showNoteEditor && item.urunNotu ? (
                        <p className="rounded-md bg-neutral-50 px-2 py-1.5 text-[11px] italic text-muted-foreground">
                            Not: {item.urunNotu}
                        </p>
                    ) : null}
                </div>
            </div>
        </article>
    );
}

export function CartProductGroupCard({
    lines,
    compact = false,
    readOnly = false,
    showNoteEditor = false,
    onUpdateQuantity,
    onRemove,
    onUpdateNote,
}: CartProductGroupCardProps) {
    const head = lines[0];
    if (!head) return null;

    const slicerSelections = extractSlicerSelections(lines);
    const imageSrc = head.imageUrl ?? getCartItemImageUrl(head.productId);
    const birimGr = getBirimOrtalamaAgirlikGr(head);
    const accordionId = `cart-variants-${head.productId}`;

    return (
        <div className={groupCardShell(compact)}>
            <div
                className={cn(
                    'border-b border-neutral-100 bg-linear-to-b from-neutral-50/90 to-white',
                    compact ? 'p-3' : 'p-3 sm:gap-4 sm:p-4'
                )}
            >
                <div className="flex gap-3">
                    <div
                        className={cn(
                            'relative shrink-0 overflow-hidden rounded-lg border border-neutral-100 bg-muted/40 shadow-sm',
                            compact ? 'size-16' : 'size-24 sm:size-28'
                        )}
                    >
                        <Image
                            src={imageSrc}
                            alt={head.urunAdi}
                            width={128}
                            height={128}
                            className="h-full w-full object-contain"
                        />
                        {birimGr > 0 ? (
                            <span
                                className={cn(
                                    'absolute rounded bg-primary font-medium text-primary-foreground shadow-sm',
                                    compact
                                        ? 'bottom-0 right-0 rounded-tl px-1 py-0.5 text-[9px]'
                                        : 'bottom-0.5 right-0.5 px-1.5 py-0.5 text-[10px]'
                                )}
                            >
                                ~{formatCartGr(birimGr)} gr
                            </span>
                        ) : null}
                    </div>

                    <div className="flex min-w-0 flex-1 items-start justify-between gap-2 sm:gap-3">
                        <div className="min-w-0 flex-1 space-y-1.5">
                            <h4
                                className={cn(
                                    'line-clamp-2 font-semibold leading-tight text-neutral-900',
                                    compact ? 'text-sm' : 'text-sm sm:text-base'
                                )}
                            >
                                {head.urunAdi}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                                {head.urunKodu}
                                {head.ayarAdi ? ` · ${head.ayarAdi}` : ''}
                                {!compact && head.birimAdi ? ` · ${head.birimAdi}` : ''}
                            </p>
                            {slicerSelections.length > 0 ? (
                                <CartVariantSelections selections={slicerSelections} compact />
                            ) : null}
                        </div>

                        <GroupSummary lines={lines} compact={compact} />
                    </div>
                </div>
            </div>

            <Accordion
                type="single"
                collapsible
                className="border-t border-neutral-100 bg-neutral-50/60"
            >
                <AccordionItem value={accordionId} className="border-0">
                    <AccordionTrigger
                        className={cn(
                            'group/trigger mx-3 my-3 flex w-auto items-center justify-between gap-3',
                            'rounded-lg border border-neutral-200 bg-white px-3 shadow-sm',
                            'transition-colors hover:border-neutral-300 hover:bg-neutral-50',
                            'hover:no-underline active:bg-neutral-100',
                            compact ? 'py-2' : 'py-2.5 sm:mx-4 sm:px-3.5',
                            '[&>svg]:size-5 [&>svg]:shrink-0 [&>svg]:rounded-full',
                            '[&>svg]:border [&>svg]:border-neutral-200 [&>svg]:bg-neutral-50',
                            '[&>svg]:p-0.5 [&>svg]:text-foreground'
                        )}
                    >
                        <span className="flex min-w-0 flex-1 items-center gap-2.5 text-left">
                            <span
                                className={cn(
                                    'flex shrink-0 items-center justify-center rounded-md bg-primary/10 font-bold text-primary tabular-nums',
                                    compact ? 'size-6 text-[10px]' : 'size-7 text-[11px]'
                                )}
                            >
                                {lines.length}
                            </span>
                            <span className="min-w-0">
                                <span
                                    className={cn(
                                        'block font-semibold text-foreground',
                                        compact ? 'text-xs' : 'text-sm'
                                    )}
                                >
                                    Varyant detayları
                                </span>
                                <span
                                    className={cn(
                                        'block text-muted-foreground',
                                        compact ? 'text-[10px]' : 'text-[11px]'
                                    )}
                                >
                                    <span className="group-data-[state=open]/trigger:hidden">
                                        {lines.length} kalem · Görmek için genişletin
                                    </span>
                                    <span className="hidden group-data-[state=open]/trigger:inline">
                                        {lines.length} kalem · Daraltmak için tıklayın
                                    </span>
                                </span>
                            </span>
                        </span>
                    </AccordionTrigger>
                    <AccordionContent
                        className={cn(
                            compact ? 'px-3 pb-3' : 'px-3 pb-3 sm:px-4 sm:pb-4'
                        )}
                    >
                        <div className="space-y-2.5">
                            {lines.map((line, i) => (
                                <VariantLineItem
                                    key={line.lineKey}
                                    item={line}
                                    index={i + 1}
                                    slicerSelections={slicerSelections}
                                    compact={compact}
                                    readOnly={readOnly}
                                    showNoteEditor={showNoteEditor}
                                    onUpdateQuantity={onUpdateQuantity}
                                    onRemove={onRemove}
                                    onUpdateNote={onUpdateNote}
                                />
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
