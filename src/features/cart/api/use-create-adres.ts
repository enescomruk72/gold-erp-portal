import { useApiMutation, useInvalidateQuery } from '@/lib/api/hooks';
import { adreslerQueryKeys } from './query-keys';
import type { B2bAdresDTO, CreateB2bAdresInput } from './types';

export function useCreateAdres() {
    const { invalidate } = useInvalidateQuery();

    return useApiMutation<B2bAdresDTO, CreateB2bAdresInput>('/v1/b2b/adresler', 'POST', {
        useProxy: true,
        mutationOptions: {
            onSuccess: () => {
                invalidate([...adreslerQueryKeys.all]);
            },
        },
    });
}
