export type AdresTipi = 'FATURA' | 'TESLIMAT' | 'MERKEZ' | 'SUBE' | 'EV';

export type B2bAdresDTO = {
    id: string;
    adresTipi: AdresTipi;
    baslik: string;
    adresMetni: string;
    postaKodu: string | null;
    ulkeId: number;
    sehirId: number;
    ilceId: number | null;
    ulkeAdi: string;
    sehirAdi: string;
    ilceAdi: string | null;
    varsayilanMi: boolean;
    duzenlenebilirMi: boolean;
};

export type CreateB2bAdresInput = {
    baslik: string;
    adresMetni: string;
    postaKodu?: string;
    varsayilanMi?: boolean;
    sehirAdi?: string;
    ilceAdi?: string;
};

export type UpdateB2bAdresInput = Partial<CreateB2bAdresInput>;

export type CreateB2bOrderInput = {
    urunler: Array<{
        urunId: string;
        varyantId: string;
        miktar: number;
        aciklama?: string;
    }>;
    teslimatAdresId?: string;
    notlar?: string;
};
