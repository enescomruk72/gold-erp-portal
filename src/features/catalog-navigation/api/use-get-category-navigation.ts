'use client';

import { useApiQuery } from '@/lib/api/hooks';
import { catalogNavigationQueryKeys } from './query-keys';
import type { CategoryNavigationResponse } from '../types/category-navigation.types';

const ENDPOINT = '/v1/b2b/categories/navigation';
const STALE_TIME_MS = 5 * 60 * 1000;

export function useGetCategoryNavigation() {
    const query = useApiQuery<CategoryNavigationResponse>(ENDPOINT, {
        queryKey: catalogNavigationQueryKeys.tree(),
        useProxy: true,
        queryOptions: {
            staleTime: STALE_TIME_MS,
            gcTime: STALE_TIME_MS * 2,
        },
    });

    const parents = query.data?.data?.parents ?? [];

    return {
        ...query,
        parents,
    };
}
