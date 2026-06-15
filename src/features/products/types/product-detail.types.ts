import type { IProductDTO } from './index';

export interface ProductDetailBreadcrumb {
    id: number;
    kategoriAdi: string;
}

export interface ProductDetailSlicerOption {
    urunId: string;
    publicSlug: string;
    label: string;
    selected: boolean;
    ozellikId: number;
    degerId: number;
}

export interface ProductDetailSlicerAxis {
    ozellikId: number;
    ozellikAdi: string;
    options: ProductDetailSlicerOption[];
}

export interface ProductDetailVarianterOption {
    variantId: string;
    vParamSlug: string;
    label: string;
    selected: boolean;
    ortalamaAgirlik?: number;
}

export interface ProductDetailVarianterAxis {
    ozellikId: number;
    ozellikAdi: string;
    options: ProductDetailVarianterOption[];
}

export interface ProductDetailAttributeRow {
    label: string;
    value: string;
    kind?: 'identifier' | 'varianter' | 'slicer' | 'attribute' | 'ayar';
}

export interface ProductDetailDTO {
    product: IProductDTO;
    /** Ürün grubu kodu (StokUrunGruplari.grup_kodu) */
    grupKodu: string;
    grupAdi?: string;
    selectedVariantId?: string;
    breadcrumb: ProductDetailBreadcrumb[];
    slicerAxes: ProductDetailSlicerAxis[];
    varianterAxes: ProductDetailVarianterAxis[];
    attributes: ProductDetailAttributeRow[];
    similarProducts: IProductDTO[];
}
