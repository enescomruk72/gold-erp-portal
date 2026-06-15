export type SozlesmeLocation =
    | 'register'
    | 'checkout'
    | 'footer'
    | 'contact'
    | 'product'
    | 'global';

export type SozlesmeUiConfig = {
    location: SozlesmeLocation;
    modal?: boolean;
    require_checkbox?: boolean;
    required_at?: SozlesmeLocation[];
    sira_no?: number;
};

export type SozlesmeDTO = {
    id: string;
    tip: string;
    baslik: string;
    versiyon: string;
    icerik: string;
    uiConfig: SozlesmeUiConfig | null;
    onaylandiMi: boolean;
};

export type SozlesmeOnayRecordDTO = {
    sozlesmeId: string;
    sozlesmeVersiyon: string;
    onayTarihi: string;
};

export type CreateSozlesmeOnayResultDTO = {
    onaylar: SozlesmeOnayRecordDTO[];
};
