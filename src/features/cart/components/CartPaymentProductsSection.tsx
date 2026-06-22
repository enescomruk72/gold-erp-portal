'use client';

import type { ICartItem } from '@/features/cart/store/cart.types';
import { getCartItemImageUrl } from '@/features/cart/lib/mock-cart-image';
import { CartWeightDisclaimer } from './CartWeightDisclaimer';
import { CartItemList } from './CartItemList';
import { CartPaymentAccordionSection } from './CartPaymentAccordionSection';

type CartPaymentProductsSectionProps = {
    items: ICartItem[];
    totalQuantity: number;
};

function getPreviewImageUrls(items: ICartItem[]): string[] {
    const seen = new Set<string>();
    const urls: string[] = [];

    for (const item of items) {
        const key = item.productId;
        if (seen.has(key)) continue;
        seen.add(key);
        urls.push(item.imageUrl ?? getCartItemImageUrl(item.productId));
    }

    return urls;
}

export function CartPaymentProductsSection({
    items,
    totalQuantity,
}: CartPaymentProductsSectionProps) {
    const previewImageUrls = getPreviewImageUrls(items);

    return (
        <CartPaymentAccordionSection
            id="cart-payment-products"
            title="Sepetimdeki Ürünler"
            count={totalQuantity}
            previewImageUrls={previewImageUrls}
        >
            <div className="mb-4">
                <CartWeightDisclaimer />
            </div>
            <CartItemList items={items} readOnly />
        </CartPaymentAccordionSection>
    );
}
