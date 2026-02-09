/**
 * Ürün filtre state tipi
 */
export interface ProductFilterValues {
    kategoriId?: number;
    markaId?: number;
    materyalId?: number;
    minFiyat?: number;
    maxFiyat?: number;
    minGram?: number;
    maxGram?: number;
    stoktakiUrunler?: boolean;
}
