/** Ayar bilgisine göre has milyem (urunAdi'nde "22 Ayar", "18 Ayar" vb. aranır) */
const HAS_BY_AYAR: Record<string, number> = {
    "24": 999,
    "22": 916,
    "18": 750,
    "14": 585,
    "8": 333,
};

export function getHasFromUrunAdi(urunAdi: string): number {
    const match = urunAdi.match(/(\d+)\s*Ayar/i);
    if (match) {
        const ayar = match[1];
        return HAS_BY_AYAR[ayar] ?? 750;
    }
    return 750;
}

/** ProductId'ye göre deterministik işçilik (10, 20, 30, 40, 50) */
const ISCILIK_DEGERLERI = [10, 20, 30, 40, 50];

export function getIscilikFromProductId(productId: string): number {
    let hash = 0;
    for (let i = 0; i < productId.length; i++) {
        hash = (hash << 5) - hash + productId.charCodeAt(i);
        hash |= 0;
    }
    const idx = Math.abs(hash) % ISCILIK_DEGERLERI.length;
    return ISCILIK_DEGERLERI[idx];
}
