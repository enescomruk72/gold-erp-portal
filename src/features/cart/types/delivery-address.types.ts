/** Cariler / Adresler tablosu ile uyumlu teslimat adresi */
export type IDeliveryAddress = {
    id: string;
    /** UI etiketi — örn. Merkez, Şube */
    baslik: string;
    teslimatAdres: string;
    teslimatIl: string;
    teslimatIlce: string;
    teslimatPostaKodu?: string;
    adresTipi?: 'FATURA' | 'TESLIMAT' | 'MERKEZ' | 'SUBE' | 'EV';
    varsayilanMi?: boolean;
    /** TESLIMAT tipi adresler düzenlenebilir */
    duzenlenebilirMi?: boolean;
};

export function formatDeliveryAddressLine(address: IDeliveryAddress): string {
    const parts = [
        address.teslimatIlce,
        address.teslimatIl,
    ].filter(Boolean);
    return parts.join(' / ');
}

export function formatDeliveryAddressFull(address: IDeliveryAddress): string {
    const line = formatDeliveryAddressLine(address);
    const posta = address.teslimatPostaKodu ? ` · ${address.teslimatPostaKodu}` : '';
    return `${address.teslimatAdres}${line ? ` — ${line}` : ''}${posta}`;
}
