'use client';

import type { IProductDTO } from '@/features/products/types';
import type { CategoryNavParent } from '@/features/catalog-navigation';
import { buildIdentifierOzellikMap, getIdentifierOzellikIdsForProduct } from '@/features/products/lib/identifier-ozellik-map';
import { StorefrontProductCard } from '@/features/products/components/storefront-product-card';

type ProductSimilarProductsProps = {
    products: IProductDTO[];
    navigationParents: CategoryNavParent[];
    listingQuery?: string;
};

export function ProductSimilarProducts({
    products,
    navigationParents,
    listingQuery,
}: ProductSimilarProductsProps) {
    if (products.length === 0) return null;

    const identifierMap = buildIdentifierOzellikMap(navigationParents, null, null);

    return (
        <section
            id="pdp-similar"
            className="mt-12 scroll-mt-32 border-t border-neutral-200 pt-8"
        >
            <h2 className="mb-5 text-base font-semibold text-neutral-900">Benzer Ürünler</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {products.map((product) => (
                    <StorefrontProductCard
                        key={product.id}
                        product={product}
                        listingQuery={listingQuery}
                        linkTarget="_self"
                        identifierOzellikIds={getIdentifierOzellikIdsForProduct(
                            product.kategoriId,
                            identifierMap
                        )}
                    />
                ))}
            </div>
        </section>
    );
}
