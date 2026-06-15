/**
 * B2B Portal - Ürün listesi
 * GET /v1/b2b/products
 */

import { useApiQuery } from '@/lib/api/hooks';
import type { PaginationMetadata } from '@/lib/api/types';
import { productsQueryKeys } from './query-keys';
import type { IProductDTO } from '../types';

export interface GetProductsParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: 'katalog' | 'urunAdi' | 'createdAt' | 'fiyat';
    sortOrder?: 'asc' | 'desc';
    kategoriId?: number;
    markaId?: number;
    minGram?: number;
    maxGram?: number;
    yeni?: boolean;
    indirimli?: boolean;
    ozellikDegerIds?: number[];
}

export interface GetProductsResult {
    data: IProductDTO[];
    pagination: PaginationMetadata | null;
}

export function useGetProducts(params?: GetProductsParams) {
    const degerIds =
        params?.ozellikDegerIds != null && params.ozellikDegerIds.length > 0
            ? params.ozellikDegerIds.join(',')
            : undefined;

    const query = useApiQuery<IProductDTO[]>('/v1/b2b/products', {
        queryKey: productsQueryKeys.list(params),
        apiOptions: {
            params: {
                page: params?.page ?? 1,
                limit: params?.limit ?? 24,
                includeGrupProducts: true,
                sortBy: params?.sortBy ?? 'katalog',
                sortOrder: params?.sortOrder ?? 'asc',
                ...(params?.search != null &&
                    params.search !== '' && { search: params.search }),
                ...(params?.kategoriId != null &&
                    params.kategoriId > 0 && { kategoriId: params.kategoriId }),
                ...(params?.markaId != null &&
                    params.markaId > 0 && { markaId: params.markaId }),
                ...(params?.minGram != null && params.minGram >= 0 && { minGram: params.minGram }),
                ...(params?.maxGram != null && params.maxGram >= 0 && { maxGram: params.maxGram }),
                ...(params?.yeni === true && { yeni: true }),
                ...(params?.indirimli === true && { indirimli: true }),
                ...(degerIds && { ozellikDegerIds: degerIds }),
            },
        },
        useProxy: true,
    });

    const data = (query.data?.data ?? []) as IProductDTO[];
    const pagination = (query.data?.metadata?.pagination ??
        null) as PaginationMetadata | null;
    const total =
        pagination?.total ??
        (query.data?.metadata as { total?: number } | undefined)?.total ??
        data.length;

    return {
        ...query,
        data,
        pagination,
        total,
    } as typeof query & {
        data: IProductDTO[];
        pagination: PaginationMetadata | null;
        total: number;
    };
}
