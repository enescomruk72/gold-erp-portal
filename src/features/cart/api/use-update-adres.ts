import { useMutation } from '@tanstack/react-query';
import { proxyApiClient } from '@/lib/api';
import { useInvalidateQuery } from '@/lib/api/hooks';
import { adreslerQueryKeys } from './query-keys';
import type { B2bAdresDTO, UpdateB2bAdresInput } from './types';
import type { ApiClientError } from '@/lib/api/errors';

type UpdateAdresVariables = {
    id: string;
    body: UpdateB2bAdresInput;
};

export function useUpdateAdres() {
    const { invalidate } = useInvalidateQuery();

    return useMutation({
        mutationFn: async (variables: UpdateAdresVariables) =>
            proxyApiClient.patch<B2bAdresDTO>(
                `/v1/b2b/adresler/${variables.id}`,
                variables.body,
            ),
        onSuccess: () => {
            invalidate([...adreslerQueryKeys.all]);
        },
    });
}

export type { UpdateAdresVariables, ApiClientError };
