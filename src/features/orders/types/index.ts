/**
 * Sipariş (Order) DTOs – B2B API response formatına uyumlu
 * Cari kendi siparişlerini görür (liste)
 */

export type SiparisTipi = 'PERAKENDE' | 'TOPTAN' | 'E_TICARET' | 'OZEL_URETIM' | 'KONSINYE';
export type SiparisDurumu = 'BEKLEMEDE' | 'ONAYLANDI' | 'TESLIM_EDILDI';
export type SiparisOdemeDurumu = 'ODENMEDI' | 'KISME_ODENDI' | 'ODENDI';

export interface ICariSummaryDTO {
    id: string;
    cariAdi: string;
    cariKodu: string;
}

/** Sipariş listeleme – urunCount + cari (portalda cari tek olduğu için kolonda göstermiyoruz) */
export interface ISiparisListDTO {
    id: string;
    siparisNo: string;
    siparisTipi: SiparisTipi;
    cariId: string;
    cari?: ICariSummaryDTO;
    depoId?: number;
    siparisTarihi: string;
    teslimatTarihi?: string;
    durum: SiparisDurumu;
    odemeDurumu: SiparisOdemeDurumu;
    urunCount: number;
    indirimOrani?: number;
    indirimTutari?: number;
    kdvDahilMi?: boolean;
    kdvToplam?: number;
    araToplam: number;
    genelToplam: number;
    odenenTutar?: number;
    kalanTutar: number;
    teslimatAdres?: string;
    teslimatIl?: string;
    teslimatIlce?: string;
    teslimatPostaKodu?: string;
    kargoFirmasi?: string;
    kargoTakipNo?: string;
    aciklama?: string;
    notlar?: string;
    icNotlar?: string;
    createdAt: string;
    updatedAt: string;
}
