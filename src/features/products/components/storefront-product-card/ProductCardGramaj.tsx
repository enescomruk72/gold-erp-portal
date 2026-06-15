'use client';

import { ChevronDown } from 'lucide-react';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import type { IProductGramajOzetiDTO } from '@/features/products/types';

type ProductCardGramajProps = {
    gramajOzeti?: IProductGramajOzetiDTO | null;
    /** Varyant yoksa ürün seviyesi ortalama */
    fallbackGram?: number | null;
};

function formatGram(value: number): string {
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function ProductCardGramaj({ gramajOzeti, fallbackGram }: ProductCardGramajProps) {
    const items = gramajOzeti?.items ?? [];
    const hasMultiple = items.length > 1;

    if (items.length === 0) {
        const gram = fallbackGram ?? 0;
        return (
            <p className="text-xs text-neutral-500">
                <span className="text-neutral-400">Ort. gramaj</span>{' '}
                <span className="font-medium tabular-nums text-neutral-700">{formatGram(gram)} gr</span>
            </p>
        );
    }

    if (!hasMultiple) {
        const item = items[0]!;
        return (
            <p className="text-xs text-neutral-500">
                <span className="text-neutral-400">Ort. gramaj</span>{' '}
                <span className="font-medium tabular-nums text-neutral-700">
                    {formatGram(item.gram)} gr
                </span>
                {item.label ? (
                    <span className="ml-1 text-neutral-400">({item.label})</span>
                ) : null}
            </p>
        );
    }

    const min = gramajOzeti?.min ?? items[0]!.gram;
    const max = gramajOzeti?.max ?? items[items.length - 1]!.gram;

    return (
        <HoverCard openDelay={120} closeDelay={80}>
            <HoverCardTrigger asChild>
                <button
                    type="button"
                    className="inline-flex max-w-full items-center gap-1 text-left text-xs text-neutral-500 hover:text-neutral-800"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <span className="text-neutral-400">Ort. gramaj</span>
                    <span className="font-medium tabular-nums text-neutral-700">
                        {formatGram(min)} – {formatGram(max)} gr
                    </span>
                    <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-600">
                        {items.length} ölçü
                    </span>
                    <ChevronDown className="size-3 shrink-0 opacity-60" />
                </button>
            </HoverCardTrigger>
            <HoverCardContent
                align="start"
                className="w-56 p-0"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="border-b border-neutral-100 px-3 py-2">
                    <p className="text-xs font-semibold text-neutral-900">Varyant gramajları</p>
                    <p className="text-[11px] text-neutral-500">
                        {formatGram(min)} – {formatGram(max)} gr aralığı
                    </p>
                </div>
                <ul className="max-h-40 overflow-y-auto py-1">
                    {items.map((item, index) => (
                        <li
                            key={`${item.label ?? 'g'}-${item.gram}-${index}`}
                            className="flex items-center justify-between gap-2 px-3 py-1.5 text-xs"
                        >
                            <span className="truncate text-neutral-600">
                                {item.label ?? `Varyant ${index + 1}`}
                            </span>
                            <span className="shrink-0 font-medium tabular-nums text-neutral-900">
                                {formatGram(item.gram)} gr
                            </span>
                        </li>
                    ))}
                </ul>
            </HoverCardContent>
        </HoverCard>
    );
}
