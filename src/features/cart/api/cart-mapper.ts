import type { B2bCartDTO, B2bCartLineDTO } from './cart-types';
import type { ICartItem } from '@/features/cart/store/cart.types';

export function mapCartLineToICartItem(line: B2bCartLineDTO): ICartItem {
    return {
        lineKey: line.id,
        productId: line.urunId,
        varyantId: line.varyantId,
        urunKodu: line.urunKodu,
        urunAdi: line.urunAdi,
        imageUrl: line.imageUrl,
        ayarAdi: line.ayarAdi,
        birimAdi: line.birimAdi,
        birimKodu: line.birimKodu,
        kategoriAdi: line.kategoriAdi,
        markaAdi: line.markaAdi,
        urunNotu: line.urunNotu,
        variantSelections:
            line.variantSelections.length > 0 ? line.variantSelections : undefined,
        birimOrtalamaAgirlikGr: line.birimOrtalamaAgirlikGr,
        miktar: line.miktar,
        birimFiyat: line.birimFiyat,
        kdvOrani: line.kdvOrani,
        agirlikGr: line.agirlikGr ?? line.birimOrtalamaAgirlikGr,
        hasMilyem: line.hasMilyem,
        iscilikMilyem: line.iscilikMilyem,
        satirAraToplam: line.satirAraToplam,
        satirKdvTutari: line.satirKdvTutari,
        satirToplam: line.satirToplam,
        addedAt: line.addedAt,
    };
}

export function mapCartDtoToState(cart: B2bCartDTO) {
    return {
        items: cart.items.map(mapCartLineToICartItem),
        siparisNotu: cart.siparisNotu ?? '',
    };
}
