import { useApiQuery } from '@/lib/api/hooks';
import { cartQueryKeys } from './query-keys';
import { mapCartDtoToState } from './cart-mapper';
import type { B2bCartDTO } from './cart-types';
import { useMemo } from 'react';

export function useGetCart(enabled = true) {
    const query = useApiQuery<B2bCartDTO>('/v1/b2b/cart', {
        queryKey: cartQueryKeys.all,
        useProxy: true,
        queryOptions: {
            enabled,
            staleTime: 30_000,
            retry: (count, error) => {
                if (error.statusCode === 403) return false;
                return count < 2;
            },
        },
    });

    const cart = useMemo(() => {
        const dto = query.data?.data;
        if (!dto) return { items: [], siparisNotu: '' };
        return mapCartDtoToState(dto);
    }, [query.data?.data]);

    const accessDenied =
        query.error?.statusCode === 403 || query.error?.statusCode === 401;
    const hasCartAccess = !accessDenied;

    return {
        ...query,
        ...cart,
        hasCartAccess,
    };
}
