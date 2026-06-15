import type { IProductDTO } from '@/features/products/types';

/** Kart üstünde gösterilecek identifier (primary) özellik değerleri */
export function getProductPrimaryAttributes(
    product: IProductDTO,
    identifierOzellikIds?: number[]
): string[] {
    if (!product.ozellikler?.length) return [];
    if (identifierOzellikIds == null || identifierOzellikIds.length === 0) return [];

    const idSet = new Set(identifierOzellikIds);

    return product.ozellikler
        .filter((o) => idSet.has(o.ozellikId))
        .flatMap((o) =>
            o.degerler
                .map((d) => d.degerAdi)
                .filter((v): v is string => v != null && v.length > 0)
        );
}

/** Identifier özellik değerlerini tek satır etiket olarak döndürür (çoklu seçim: "Gurmet, Kaburga") */
export function getProductPrimaryAttributeLabel(
    product: IProductDTO,
    identifierOzellikIds?: number[]
): string | null {
    const values = getProductPrimaryAttributes(product, identifierOzellikIds);
    if (values.length === 0) return null;
    return values.join(', ');
}

/** Mini kategori satırı — ürünün bağlı olduğu kategori */
export function getProductMiniCategory(product: IProductDTO): string | null {
    return product.kategori?.kategoriAdi?.trim() || null;
}
