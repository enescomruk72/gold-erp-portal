import { useApiMutation } from '@/lib/api/hooks';
import type { CreateB2bOrderInput } from './types';
import type { ISiparisListDTO } from '@/features/orders/types';

export function useCreateOrder() {
    return useApiMutation<ISiparisListDTO, CreateB2bOrderInput>(
        '/v1/b2b/orders',
        'POST',
        { useProxy: true },
    );
}
