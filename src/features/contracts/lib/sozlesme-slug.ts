import type { SozlesmeDTO } from '../types';

/** KVKK → kvkk, MESAFELI_SATIS → mesafeli-satis */
export function sozlesmeTipToSlug(tip: string): string {
    return tip.trim().toLowerCase().replace(/_/g, '-');
}

/** kvkk → KVKK, mesafeli-satis → MESAFELI_SATIS */
export function slugToSozlesmeTip(slug: string): string {
    return slug.trim().toUpperCase().replace(/-/g, '_');
}

export function getSozlesmeHref(sozlesme: Pick<SozlesmeDTO, 'tip'>): string {
    return `/yasal/${sozlesmeTipToSlug(sozlesme.tip)}`;
}

export function findSozlesmeBySlug(
    sozlesmeler: SozlesmeDTO[],
    slug: string,
): SozlesmeDTO | undefined {
    const tip = slugToSozlesmeTip(slug);
    return sozlesmeler.find((item) => item.tip === tip);
}

export function getCheckoutLinkedSozlesmeler(sozlesmeler: SozlesmeDTO[]): SozlesmeDTO[] {
    return sozlesmeler.filter((item) => {
        const config = item.uiConfig;
        if (!config) return false;
        if (config.location === 'checkout') return true;
        return config.required_at?.includes('checkout') ?? false;
    });
}
