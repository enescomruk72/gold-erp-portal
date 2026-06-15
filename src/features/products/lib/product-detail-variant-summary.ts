import type { ProductDetailDTO } from '@/features/products/types/product-detail.types';

export type VariantSelectionRow = {
    axisLabel: string;
    valueLabel: string;
};

export function getSelectedVariantSelections(
    detail: ProductDetailDTO,
    vParam?: string | null
): VariantSelectionRow[] {
    const rows: VariantSelectionRow[] = [];

    for (const axis of detail.slicerAxes) {
        const selected = axis.options.find((o) => o.selected);
        if (selected) {
            rows.push({ axisLabel: axis.ozellikAdi, valueLabel: selected.label });
        }
    }

    for (const axis of detail.varianterAxes) {
        const selected =
            axis.options.find(
                (o) => o.selected || (vParam != null && vParam !== '' && o.vParamSlug === vParam)
            ) ?? axis.options.find((o) => o.selected);
        if (selected) {
            rows.push({ axisLabel: axis.ozellikAdi, valueLabel: selected.label });
        }
    }

    return rows;
}

/** Seçili varianter varsa onun gramajı, yoksa ürün ortalaması */
export function getUnitAverageWeightGr(
    detail: ProductDetailDTO,
    vParam?: string | null
): number {
    for (const axis of detail.varianterAxes) {
        const selected =
            axis.options.find(
                (o) => o.selected || (vParam != null && vParam !== '' && o.vParamSlug === vParam)
            ) ?? axis.options.find((o) => o.selected);
        if (selected?.ortalamaAgirlik != null) {
            return selected.ortalamaAgirlik;
        }
    }
    return detail.product.ortalamaAgirlik ?? detail.product.agirlikGr ?? 0;
}
