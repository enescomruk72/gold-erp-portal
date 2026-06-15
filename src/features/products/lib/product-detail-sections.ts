export const PDP_STICKY_BAR_HEIGHT_PX = 72;
export const PDP_SECTION_NAV_HEIGHT_PX = 44;
export const PDP_STICKY_STACK_HEIGHT_PX =
    PDP_STICKY_BAR_HEIGHT_PX + PDP_SECTION_NAV_HEIGHT_PX;

export type ProductDetailSectionId =
    | 'pdp-similar'
    | 'pdp-info'
    | 'pdp-reviews'
    | 'pdp-questions';

export type ProductDetailSectionDef = {
    id: ProductDetailSectionId;
    label: string;
};

export const PRODUCT_DETAIL_SECTIONS: ProductDetailSectionDef[] = [
    { id: 'pdp-similar', label: 'Benzer Ürünler' },
    { id: 'pdp-info', label: 'Ürün Bilgileri' },
    { id: 'pdp-reviews', label: 'Ürün Değerlendirmeleri' },
    { id: 'pdp-questions', label: 'Soru ve Cevapları' },
];
