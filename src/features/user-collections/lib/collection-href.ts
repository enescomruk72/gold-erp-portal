const COLLECTION_ID_SUFFIX = '-k-';
const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Trendyol: elektronik-k-{uuid} */
export function collectionSlugFromAd(ad: string): string {
    const slug = ad
        .toLocaleLowerCase('tr-TR')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);

    return slug || 'koleksiyon';
}

export function collectionPublicHref(ad: string, id: string): string {
    return `/collections/${collectionSlugFromAd(ad)}${COLLECTION_ID_SUFFIX}${id}`;
}

export function parseCollectionIdFromSlug(slug: string): string | null {
    const idx = slug.lastIndexOf(COLLECTION_ID_SUFFIX);
    if (idx === -1) return null;

    const id = slug.slice(idx + COLLECTION_ID_SUFFIX.length);
    return UUID_RE.test(id) ? id : null;
}
