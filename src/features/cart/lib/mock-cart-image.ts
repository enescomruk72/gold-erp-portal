import { getMockProductImageUrl } from "@/features/products/lib/mock-product-images";

/** productId'den tutarlı mock görsel index'i türetir */
export function getCartItemImageUrl(productId: string): string {
    const index = Math.abs(
        productId.split("").reduce((a, c) => (a + c.charCodeAt(0)) | 0, 0)
    );
    return getMockProductImageUrl(index);
}
