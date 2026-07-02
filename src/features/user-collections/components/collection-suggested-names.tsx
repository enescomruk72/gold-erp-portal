'use client';

import { cn } from '@/lib/utils';

export const SUGGESTED_COLLECTION_NAMES = [
    { label: 'Altın Bileklikler', emoji: '💛' },
    { label: 'Alyans Koleksiyonu', emoji: '💍' },
    { label: 'Kolye Uçları', emoji: '📿' },
    { label: '22 Ayar Favoriler', emoji: '✨' },
    { label: 'Düğün Seti', emoji: '👰' },
    { label: 'Günlük Takılar', emoji: '💎' },
] as const;

export function isSuggestedCollectionName(value: string): boolean {
    const trimmed = value.trim();
    return SUGGESTED_COLLECTION_NAMES.some((item) => item.label === trimmed);
}

type CollectionSuggestedNamesProps = {
    value: string;
    onSelect: (label: string) => void;
    disabled?: boolean;
    className?: string;
};

export function CollectionSuggestedNames({
    value,
    onSelect,
    disabled = false,
    className,
}: CollectionSuggestedNamesProps) {
    const selected = value.trim();

    return (
        <div className={cn('space-y-2', className)}>
            <p className="text-sm font-semibold text-foreground">Önerilen İsimler</p>
            <div className="flex flex-wrap gap-2">
                {SUGGESTED_COLLECTION_NAMES.map((item) => {
                    const isActive = selected === item.label;
                    return (
                        <button
                            key={item.label}
                            type="button"
                            disabled={disabled}
                            onClick={() => onSelect(item.label)}
                            className={cn(
                                'inline-flex items-center gap-1 rounded-full border bg-white px-3 py-1.5 text-sm transition-colors disabled:opacity-60',
                                isActive
                                    ? 'border-[#0769e9] text-[#0769e9] ring-1 ring-[#0769e9]'
                                    : 'border-neutral-200 hover:border-[#0769e9]/60 hover:text-[#0769e9]'
                            )}
                        >
                            {item.label} {item.emoji}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
