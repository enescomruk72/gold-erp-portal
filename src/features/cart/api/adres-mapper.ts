import type { IDeliveryAddress } from '@/features/cart/types/delivery-address.types';
import type { B2bAdresDTO } from './types';

export function toDeliveryAddress(dto: B2bAdresDTO): IDeliveryAddress {
    return {
        id: dto.id,
        baslik: dto.baslik,
        teslimatAdres: dto.adresMetni,
        teslimatIl: dto.sehirAdi,
        teslimatIlce: dto.ilceAdi ?? '',
        teslimatPostaKodu: dto.postaKodu ?? undefined,
        duzenlenebilirMi: dto.duzenlenebilirMi,
        varsayilanMi: dto.varsayilanMi,
        adresTipi: dto.adresTipi,
    };
}
