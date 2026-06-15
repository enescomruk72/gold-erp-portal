import type { IProductDTO } from '@/features/products/types';

export const HOME_RAIL_COUNTS = {
    popular: 8,
    personal: 8,
    recent: 6,
} as const;

export const HOME_RAIL_TOTAL =
    HOME_RAIL_COUNTS.popular + HOME_RAIL_COUNTS.personal + HOME_RAIL_COUNTS.recent;

export type HomeProductRails = {
    popular: IProductDTO[];
    personal: IProductDTO[];
    recent: IProductDTO[];
};

/** StorefrontProductCard ile aynı kriter — en az bir geçerli görsel URL */
export function productHasImage(product: IProductDTO): boolean {
    return (product.images ?? []).some(
        (image) => image.url != null && image.url.trim() !== ''
    );
}

function shuffleInPlace<T>(items: T[]): T[] {
    for (let i = items.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j]!, items[i]!];
    }
    return items;
}

/** Görseli olan ürünleri karıştırıp üç ana sayfa rail'ine böler (çakışma yok). */
export function splitProductsForHomeRails(products: IProductDTO[]): HomeProductRails {
    const pool = shuffleInPlace(products.filter(productHasImage)).slice(0, HOME_RAIL_TOTAL);
    let offset = 0;

    const take = (count: number) => {
        const slice = pool.slice(offset, offset + count);
        offset += count;
        return slice;
    };

    return {
        popular: take(HOME_RAIL_COUNTS.popular),
        personal: take(HOME_RAIL_COUNTS.personal),
        recent: take(HOME_RAIL_COUNTS.recent),
    };
}
