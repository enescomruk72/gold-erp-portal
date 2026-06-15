import type { ICartItem, ICartItemVariantSelection } from '@/features/cart/store/cart.store';

export type CartDisplayGroup = {
    groupKey: string;
    lines: ICartItem[];
    slicerSelections: ICartItemVariantSelection[];
};

function getAxisValue(
    item: ICartItem,
    axisLabel: string,
): string | undefined {
    return item.variantSelections?.find((s) => s.axisLabel === axisLabel)?.valueLabel;
}

/**
 * Slicer eksenleri: çok satırda tüm satırlarda aynı kalan değerler.
 * Tek satırda sepete ekleme sırası (önce slicer, sonra varianter) korunur.
 */
export function extractSlicerSelections(lines: ICartItem[]): ICartItemVariantSelection[] {
    if (lines.length === 0) return [];

    if (lines.length === 1) {
        const selections = lines[0].variantSelections ?? [];
        if (selections.length <= 1) return selections;
        return selections.slice(0, -1);
    }

    const axisLabels = new Set<string>();
    for (const line of lines) {
        for (const sel of line.variantSelections ?? []) {
            axisLabels.add(sel.axisLabel);
        }
    }

    const slicer: ICartItemVariantSelection[] = [];
    for (const axisLabel of axisLabels) {
        const values = new Set(
            lines.map((line) => getAxisValue(line, axisLabel)).filter(Boolean),
        );
        if (values.size === 1) {
            const valueLabel = [...values][0];
            if (valueLabel) slicer.push({ axisLabel, valueLabel });
        }
    }

    return slicer.sort((a, b) =>
        `${a.axisLabel}:${a.valueLabel}`.localeCompare(`${b.axisLabel}:${b.valueLabel}`, 'tr'),
    );
}

export function getVarianterSelectionsForLine(
    line: ICartItem,
    slicerSelections: ICartItemVariantSelection[],
): ICartItemVariantSelection[] {
    const slicerLabels = new Set(slicerSelections.map((s) => s.axisLabel));
    const fromDiff = (line.variantSelections ?? []).filter((s) => !slicerLabels.has(s.axisLabel));
    if (fromDiff.length > 0) return fromDiff;

    const selections = line.variantSelections ?? [];
    if (selections.length > 1) return [selections[selections.length - 1]];
    return [];
}

export function isSimpleCartLine(lines: ICartItem[]): boolean {
    return (lines[0]?.variantSelections?.length ?? 0) === 0;
}

/** Slicer = aynı productId; varianter satırları kart içinde listelenir */
export function groupCartItemsBySlicer(items: ICartItem[]): CartDisplayGroup[] {
    const map = new Map<string, ICartItem[]>();

    for (const item of items) {
        const list = map.get(item.productId) ?? [];
        list.push(item);
        map.set(item.productId, list);
    }

    return [...map.entries()].map(([productId, lines]) => ({
        groupKey: productId,
        lines: [...lines].sort((a, b) =>
            (a.addedAt ?? '').localeCompare(b.addedAt ?? '', 'tr'),
        ),
        slicerSelections: extractSlicerSelections(lines),
    }));
}

export function getCartGroupCount(items: ICartItem[]): number {
    return groupCartItemsBySlicer(items).length;
}
