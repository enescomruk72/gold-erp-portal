import type { ProductDetailAttributeRow } from '@/features/products/types/product-detail.types';
import { ProductDetailSpecGrid } from './ProductDetailSpecGrid';

type ProductDetailAttributesProps = {
    attributes: ProductDetailAttributeRow[];
    /** compact: sağ kolon içi Trendyol tarzı kart grid */
    variant?: 'section' | 'compact';
};

export function ProductDetailAttributes({
    attributes,
    variant = 'section',
}: ProductDetailAttributesProps) {
    if (attributes.length === 0) return null;

    if (variant === 'compact') {
        return (
            <div className="space-y-3">
                <h2 className="text-sm font-semibold text-neutral-900">Öne Çıkan Özellikler</h2>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {attributes.map((row) => (
                        <div
                            key={`${row.label}-${row.value}`}
                            className="min-w-0 rounded-md bg-neutral-100 px-3 py-2.5"
                        >
                            <p className="truncate text-[11px] text-neutral-500">{row.label}</p>
                            <p className="mt-0.5 truncate text-sm font-semibold text-neutral-900">
                                {row.value}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <section className="mt-10 border-t border-neutral-200 pt-8">
            <h2 className="mb-4 text-base font-semibold text-neutral-900">Ürün Özellikleri</h2>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-neutral-200 bg-neutral-200 sm:grid-cols-3 md:grid-cols-4">
                {attributes.map((row) => (
                    <div key={`${row.label}-${row.value}`} className="bg-white p-3">
                        <p className="text-[11px] text-neutral-500">{row.label}</p>
                        <p className="mt-0.5 text-sm font-medium text-neutral-900">{row.value}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
