export type SearchRecentItem = {
    id: string;
    query: string;
};

export type SearchRecentProduct = {
    id: string;
    title: string;
    code: string;
    price: string;
};

export type SearchPopularItem = {
    id: string;
    label: string;
};

export const SEARCH_RECENT_QUERIES: SearchRecentItem[] = [
    { id: 'r1', query: '22 ayar bileklik' },
    { id: 'r2', query: 'kelepçe taşlı' },
    { id: 'r3', query: 'alyans yüzük' },
    { id: 'r4', query: 'küpe halka' },
    { id: 'r5', query: 'altın set' },
];

export const SEARCH_RECENT_PRODUCTS: SearchRecentProduct[] = Array.from(
    { length: 10 },
    (_, i) => ({
        id: `rv-${i + 1}`,
        title: `Gezilen Ürün ${i + 1}`,
        code: `URN-${1000 + i}`,
        price: `₺${(980 + i * 210).toLocaleString('tr-TR')}`,
    })
);

export const SEARCH_POPULAR_QUERIES: SearchPopularItem[] = [
    { id: 'p1', label: '22 Ayar Bileklik' },
    { id: 'p2', label: 'Çok Satan Kelepçe' },
    { id: 'p3', label: 'Yeni Gelen Küpe' },
    { id: 'p4', label: 'Alyans Yüzük' },
    { id: 'p5', label: 'Altın Set' },
    { id: 'p6', label: '14 Ayar Kolye' },
];

export const SEARCH_ACCENT_COLOR = '#0769e9';
