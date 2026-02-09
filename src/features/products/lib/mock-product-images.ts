/**
 * Mock ürün görselleri - /public/test-product-images/
 */

const MOCK_IMAGES = [
    "/test-product-images/001.png",
    "/test-product-images/002%20kopya.png",
    "/test-product-images/003%20kopya.png",
    "/test-product-images/004%20kopya.png",
    "/test-product-images/005%20kopya.png",
    "/test-product-images/006%20kopya.png",
    "/test-product-images/007%20kopya.png",
    "/test-product-images/009%20kopya.png",
    "/test-product-images/010%20kopya.png",
    "/test-product-images/011%20kopya.png",
    "/test-product-images/012%20kopya.png",
    "/test-product-images/013%20kopya.png",
    "/test-product-images/014%20kopya.png",
    "/test-product-images/016%20kopya.png",
    "/test-product-images/017%20kopya.png",
    "/test-product-images/018%20kopya.png",
    "/test-product-images/019%20kopya.png",
    "/test-product-images/020%20kopya.png",
    "/test-product-images/021%20kopya.png",
    "/test-product-images/022%20kopya.png",
    "/test-product-images/023%20kopya.png",
    "/test-product-images/024%20kopya.png",
    "/test-product-images/025%20kopya.png",
    "/test-product-images/026%20kopya.png",
    "/test-product-images/027%20kopya.png",
    "/test-product-images/028%20kopya.png",
    "/test-product-images/029%20kopya.png",
    "/test-product-images/030%20kopya.png",
] as const;

export function getMockProductImageUrl(index: number): string {
    return MOCK_IMAGES[index % MOCK_IMAGES.length];
}

/** Mock görsel URL listesi (ProductImageGallery vb. için) */
export const MOCK_PRODUCT_IMAGE_URLS = MOCK_IMAGES as unknown as string[];
