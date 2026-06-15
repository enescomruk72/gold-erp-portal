'use client';

import { ChevronDown } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
    LISTING_SORT_OPTIONS,
    listingSortKey,
    type ListingSortBy,
    type ListingSortOrder,
} from '@/features/products/lib/listing-search-params';

type ProductListingToolbarProps = {
    yeni: boolean | null;
    indirimli: boolean | null;
    sortBy: ListingSortBy;
    sortOrder: ListingSortOrder;
    onYeniChange: (value: boolean | null) => void;
    onIndirimliChange: (value: boolean | null) => void;
    onSortChange: (sortBy: ListingSortBy, sortOrder: ListingSortOrder) => void;
};

const QUICK_FILTERS = [
    { key: 'yeni' as const, label: 'Yeni Ürünler' },
    { key: 'indirimli' as const, label: 'İndirimli' },
];

export function ProductListingToolbar({
    yeni,
    indirimli,
    sortBy,
    sortOrder,
    onYeniChange,
    onIndirimliChange,
    onSortChange,
}: ProductListingToolbarProps) {
    const activeMap = { yeni, indirimli };
    const sortValue = listingSortKey(sortBy, sortOrder);

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 pb-base">
            <div className="flex flex-wrap gap-2">
                {QUICK_FILTERS.map(({ key, label }) => {
                    const active = activeMap[key];
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => {
                                if (key === 'yeni') onYeniChange(active ? null : true);
                                else onIndirimliChange(active ? null : true);
                            }}
                            className={cn(
                                'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                                active
                                    ? 'border-neutral-900 bg-neutral-900 text-white'
                                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                            )}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            <Select
                value={sortValue}
                onValueChange={(v) => {
                    const option = LISTING_SORT_OPTIONS.find(
                        (o) => listingSortKey(o.sortBy, o.sortOrder) === v
                    );
                    if (option) onSortChange(option.sortBy, option.sortOrder);
                }}
            >
                <SelectTrigger className="h-9 w-auto min-w-[160px] gap-1 border-neutral-200 bg-white text-xs font-medium text-neutral-800 shadow-none">
                    <SelectValue placeholder="Sırala" />
                    <ChevronDown className="size-3.5 opacity-50" />
                </SelectTrigger>
                <SelectContent align="end">
                    {LISTING_SORT_OPTIONS.map((option) => (
                        <SelectItem
                            key={listingSortKey(option.sortBy, option.sortOrder)}
                            value={listingSortKey(option.sortBy, option.sortOrder)}
                            className="text-xs"
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
