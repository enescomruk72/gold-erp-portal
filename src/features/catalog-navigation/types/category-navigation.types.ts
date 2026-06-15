export type CategoryNavIdentifierValue = {
    id: number;
    deger: string;
};

export type CategoryNavIdentifier = {
    ozellikId: number;
    ozellikAdi: string;
    degerler: CategoryNavIdentifierValue[];
};

export type CategoryNavChild = {
    id: number;
    kategoriKodu: string;
    kategoriAdi: string;
    identifiers: CategoryNavIdentifier[];
};

export type CategoryNavParent = {
    id: number;
    kategoriKodu: string;
    kategoriAdi: string;
    childCount: number;
    identifiers: CategoryNavIdentifier[];
    children: CategoryNavChild[];
};

export type CategoryNavigationResponse = {
    parents: CategoryNavParent[];
};
