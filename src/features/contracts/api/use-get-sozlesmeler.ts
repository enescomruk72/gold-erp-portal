import { useApiQuery } from '@/lib/api/hooks';
import { sozlesmelerQueryKeys } from './query-keys';
import type { SozlesmeDTO, SozlesmeLocation } from '../types';

export function useGetSozlesmeler(location?: SozlesmeLocation) {
    const query = useApiQuery<SozlesmeDTO[]>('/v1/b2b/sozlesmeler', {
        queryKey: location
            ? sozlesmelerQueryKeys.list(location)
            : sozlesmelerQueryKeys.all,
        apiOptions: {
            ...(location ? { params: { location } } : {}),
        },
        useProxy: true,
    });

    const data = (query.data?.data ?? []) as SozlesmeDTO[];

    return {
        ...query,
        data,
    } as typeof query & { data: SozlesmeDTO[] };
}
