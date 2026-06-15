import { useMemo } from 'react';
import { useApiQuery } from '@/lib/api/hooks';
import { adreslerQueryKeys } from './query-keys';
import { toDeliveryAddress } from './adres-mapper';
import type { AdresTipi, B2bAdresDTO } from './types';
import type { IDeliveryAddress } from '@/features/cart/types/delivery-address.types';

export function useGetAdresler(adresTipi?: AdresTipi) {
    const query = useApiQuery<B2bAdresDTO[]>('/v1/b2b/adresler', {
        queryKey: adreslerQueryKeys.list(adresTipi),
        apiOptions: {
            ...(adresTipi ? { params: { adresTipi } } : {}),
        },
        useProxy: true,
    });

    const raw = (query.data?.data ?? []) as B2bAdresDTO[];

    const addresses = useMemo(
        () => raw.map(toDeliveryAddress),
        [raw],
    );

    const defaultAddress = useMemo(
        () =>
            addresses.find((a) => a.varsayilanMi) ??
            addresses.find((a) => a.adresTipi === 'TESLIMAT') ??
            addresses[0] ??
            null,
        [addresses],
    );

    return {
        ...query,
        addresses,
        defaultAddress,
    } as typeof query & {
        addresses: IDeliveryAddress[];
        defaultAddress: IDeliveryAddress | null;
    };
}
