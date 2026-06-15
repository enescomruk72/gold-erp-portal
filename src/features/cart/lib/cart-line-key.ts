import type { ICartItemVariantSelection } from '@/features/cart/store/cart.store';

export function normalizeVariantSelections(
    selections?: ICartItemVariantSelection[] | null,
): ICartItemVariantSelection[] {
    if (!selections?.length) return [];
    return [...selections].sort((a, b) =>
        `${a.axisLabel}:${a.valueLabel}`.localeCompare(`${b.axisLabel}:${b.valueLabel}`, 'tr')
    );
}

/** Ürün + slicer/varianter seçimi için benzersiz sepet satır anahtarı */
export function buildCartLineKey(
    productId: string,
    variantSelections?: ICartItemVariantSelection[] | null,
): string {
    const normalized = normalizeVariantSelections(variantSelections);
    if (normalized.length === 0) return productId;
    const variantPart = normalized
        .map((s) => `${s.axisLabel}=${s.valueLabel}`)
        .join('|');
    return `${productId}::${variantPart}`;
}
