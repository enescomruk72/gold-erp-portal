import { useApiQuery } from '@/lib/api/hooks';
import { productsQueryKeys } from './query-keys';
import type { ProductDetailDTO } from '../types/product-detail.types';

export function useGetProductBySlug(slug: string | null, vParam?: string | null) {
    const encodedSlug = slug ? encodeURIComponent(slug) : '';
    const enabled = Boolean(slug);

    return useApiQuery<ProductDetailDTO>(`/v1/b2b/products/by-slug/${encodedSlug}`, {
        queryKey: productsQueryKeys.detailBySlug(slug ?? '', vParam ?? ''),
        apiOptions: {
            params: vParam ? { v: vParam } : undefined,
        },
        useProxy: true,
        queryOptions: { enabled },
    });
}
