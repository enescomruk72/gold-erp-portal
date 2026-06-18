import { cn } from '@/lib/utils';

export type ProductDetailSpecRow = {
    label: string;
    value: string;
};

type ProductDetailSpecGridProps = {
    rows: ProductDetailSpecRow[];
    className?: string;
    columns?: 1 | 2 | 3;
};

export function ProductDetailSpecGrid({
    rows,
    className,
    columns = 3,
}: ProductDetailSpecGridProps) {
    if (rows.length === 0) return null;

    const colClass =
        columns === 1
            ? 'grid-cols-1'
            : columns === 2
              ? 'grid-cols-1 sm:grid-cols-2'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

    return (
        <div className={cn('grid gap-2', colClass, className)}>
            {rows.map((row) => (
                <div
                    key={row.label}
                    className="flex items-center justify-between gap-3 rounded-md bg-neutral-100 px-4 py-3 text-sm"
                >
                    <span className="text-neutral-600">{row.label}</span>
                    <span className="text-right font-semibold text-neutral-900">{row.value}</span>
                </div>
            ))}
        </div>
    );
}
