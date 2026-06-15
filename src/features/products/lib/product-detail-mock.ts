/** Ürün detay sayfası mock sosyal kanıt — slug/id ile deterministik */

function hashString(value: string): number {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
        hash = (Math.imul(31, hash) + value.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
}

function pick<T>(seed: number, items: T[], offset = 0): T {
    return items[(seed + offset) % items.length]!;
}

function formatFavoriteCount(count: number): string {
    if (count >= 1000) {
        const k = Math.round(count / 100) / 10;
        return k % 1 === 0 ? `${k}B` : `${k.toFixed(1).replace('.', ',')}B`;
    }
    return String(count);
}

export type ProductDetailSocialMock = {
    rating: number;
    reviewCount: number;
    commentCount: number;
    qaCount: number;
    favoriteCountLabel: string;
};

export type ProductDetailReviewMock = {
    id: string;
    userLabel: string;
    dateLabel: string;
    rating: number;
    variantLabel?: string;
    body: string;
};

export type ProductDetailQuestionMock = {
    id: string;
    question: string;
    userLabel: string;
    dateLabel: string;
    answer: string;
    answeredInHours: number;
};

export type ProductDetailMockBundle = {
    social: ProductDetailSocialMock;
    reviews: ProductDetailReviewMock[];
    questions: ProductDetailQuestionMock[];
    qaFilterChips: Array<{ label: string; count: number }>;
};

const REVIEW_BODIES = [
    'Ürün fotoğraftaki gibi geldi, işçilik gayet başarılı. Gramaj da belirtildiği gibi.',
    'Kargo hızlıydı, paketleme özenli. Günlük kullanım için ideal bir parça.',
    'Rengi ve parlaklığı beklentimi karşıladı. Tekrar sipariş veririm.',
    'Beden/ölçü tam oturdu. Hediye olarak aldım, çok beğenildi.',
    'Fiyat performans açısından iyi. Mağaza vitrinindeki ürünle uyumlu.',
];

const QUESTIONS = [
    { q: 'Ortalama gramaj sabit mi yoksa tolerans var mı?', a: 'Ürün kartında belirtilen ortalama gramaj ±%5 toleransla üretilmektedir.' },
    { q: 'Hangi ölçüyü tercih etmeliyim?', a: 'Bilek çevrenize göre bir cm küçük ölçü genellikle daha rahat oturur.' },
    { q: '22 ayar mı kaplama mı?', a: 'Ürün 22 ayar altın kaplama olarak sunulmaktadır.' },
    { q: 'Günlük kullanıma uygun mu?', a: 'Evet, günlük kullanım için uygundur; kimyasal temasından kaçınmanızı öneririz.' },
    { q: 'Kargo süresi ne kadar?', a: 'Stoktaki ürünlerde genellikle 1-3 iş günü içinde kargoya verilir.' },
    { q: 'Değişim yapılabiliyor mu?', a: 'B2B siparişlerde değişim koşulları için satış temsilcinizle iletişime geçebilirsiniz.' },
];

const MASKED_NAMES = ['S** T**', 'A** Y**', 'M** K**', 'E** D**', 'B** S**', 'F** A**'];

const MONTHS_TR = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

function formatMockDate(seed: number, offset: number): string {
    const day = 1 + ((seed + offset * 7) % 28);
    const month = MONTHS_TR[(seed + offset) % MONTHS_TR.length]!;
    return `${day} ${month} 2025`;
}

export function buildProductDetailMock(seedKey: string): ProductDetailMockBundle {
    const seed = hashString(seedKey);

    const ratingBase = 38 + (seed % 11);
    const rating = ratingBase / 10;
    const reviewCount = 12 + (seed % 78);
    const commentCount = Math.max(8, reviewCount - (seed % 12));
    const qaCount = 20 + ((seed * 3) % 100);
    const favoriteCount = 400 + ((seed * 17) % 4600);

    const social: ProductDetailSocialMock = {
        rating,
        reviewCount,
        commentCount,
        qaCount,
        favoriteCountLabel: formatFavoriteCount(favoriteCount),
    };

    const reviews: ProductDetailReviewMock[] = Array.from({ length: 4 }, (_, i) => ({
        id: `review-${i}`,
        userLabel: pick(seed, MASKED_NAMES, i),
        dateLabel: formatMockDate(seed, i + 1),
        rating: Math.min(5, Math.max(3, Math.round(rating) + (i % 2))),
        variantLabel: i % 2 === 0 ? 'Ölçü: 6.1 inç' : undefined,
        body: pick(seed, REVIEW_BODIES, i),
    }));

    const questions: ProductDetailQuestionMock[] = Array.from({ length: 4 }, (_, i) => {
        const item = pick(seed, QUESTIONS, i);
        return {
            id: `qa-${i}`,
            question: item.q,
            userLabel: '**** ****',
            dateLabel: formatMockDate(seed, i + 4),
            answer: item.a,
            answeredInHours: 1 + ((seed + i) % 8),
        };
    });

    const qaFilterChips = [
        { label: 'tümü', count: qaCount },
        { label: 'Ölçü', count: Math.max(3, Math.floor(qaCount * 0.35)) },
        { label: 'Gramaj', count: Math.max(2, Math.floor(qaCount * 0.15)) },
        { label: 'Materyal', count: Math.max(2, Math.floor(qaCount * 0.1)) },
        { label: 'Kargo', count: Math.max(1, Math.floor(qaCount * 0.08)) },
    ];

    return { social, reviews, questions, qaFilterChips };
}

export function ratingStars(rating: number): { filled: number; empty: number } {
    const filled = Math.min(5, Math.max(0, Math.round(rating)));
    return { filled, empty: 5 - filled };
}
