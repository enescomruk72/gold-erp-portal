import type { ICartItemVariantSelection } from '@/features/cart/store/cart.store';

type CartVariantSelectionsProps = {
    selections: ICartItemVariantSelection[];
    compact?: boolean;
};

export function CartVariantSelections({
    selections,
    compact = false,
}: CartVariantSelectionsProps) {
    if (selections.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-1.5">
            {selections.map((row) => (
                <span
                    key={`${row.axisLabel}-${row.valueLabel}`}
                    className={
                        compact
                            ? 'inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-neutral-100/80 px-1.5 py-0.5 text-[11px]'
                            : 'inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-100/80 px-2 py-0.5 text-xs'
                    }
                >
                    <span className="text-muted-foreground">{row.axisLabel}</span>
                    <span className="font-semibold text-foreground">{row.valueLabel}</span>
                </span>
            ))}
        </div>
    );
}
