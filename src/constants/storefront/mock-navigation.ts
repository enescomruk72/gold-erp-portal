/** Geçici mock — ileride B2B kategori + identifier attribute API'den gelecek */

export type StorefrontNavAttribute = {
    id: number;
    ad: string;
    slug: string;
};

export type StorefrontNavCategory = {
    id: number;
    ad: string;
    slug: string;
    href: string;
    /** Primary identifier özellikleri (mock) */
    attributes?: StorefrontNavAttribute[];
};

export const STOREFRONT_QUICK_LINKS: StorefrontNavCategory[] = [
    { id: 1, ad: 'Bileklik', slug: 'bileklik', href: '/products?kategori=bileklik' },
    { id: 2, ad: 'Kelepçe', slug: 'kelepce', href: '/products?kategori=kelepce' },
    { id: 3, ad: 'Yüzük', slug: 'yuzuk', href: '/products?kategori=yuzuk' },
    { id: 4, ad: 'Küpe', slug: 'kupe', href: '/products?kategori=kupe' },
    { id: 5, ad: 'Kolye', slug: 'kolye', href: '/products?kategori=kolye' },
    { id: 6, ad: 'Set', slug: 'set', href: '/products?kategori=set' },
    { id: 7, ad: 'Çok Satanlar', slug: 'cok-satanlar', href: '/products?sort=cok-satan' },
    { id: 8, ad: 'Yeni Gelenler', slug: 'yeni-gelenler', href: '/products?sort=yeni' },
];

export const STOREFRONT_CATEGORY_MENU: StorefrontNavCategory[] = [
    {
        id: 101,
        ad: 'Bileklik',
        slug: 'bileklik',
        href: '/products?kategori=bileklik',
        attributes: [
            { id: 1, ad: '22 Ayar', slug: '22-ayar' },
            { id: 2, ad: '18 Ayar', slug: '18-ayar' },
            { id: 3, ad: '14 Ayar', slug: '14-ayar' },
        ],
    },
    {
        id: 102,
        ad: 'Kelepçe',
        slug: 'kelepce',
        href: '/products?kategori=kelepce',
        attributes: [
            { id: 4, ad: 'Taşlı', slug: 'tasli' },
            { id: 5, ad: 'Düz', slug: 'duz' },
        ],
    },
    {
        id: 103,
        ad: 'Yüzük',
        slug: 'yuzuk',
        href: '/products?kategori=yuzuk',
        attributes: [
            { id: 6, ad: 'Alyans', slug: 'alyans' },
            { id: 7, ad: 'Tek Taş', slug: 'tek-tas' },
        ],
    },
    {
        id: 104,
        ad: 'Küpe',
        slug: 'kupe',
        href: '/products?kategori=kupe',
        attributes: [
            { id: 8, ad: 'Halka', slug: 'halka' },
            { id: 9, ad: 'Sallantılı', slug: 'sallantili' },
        ],
    },
    {
        id: 105,
        ad: 'Kolye',
        slug: 'kolye',
        href: '/products?kategori=kolye',
    },
    {
        id: 106,
        ad: 'Set',
        slug: 'set',
        href: '/products?kategori=set',
    },
];
