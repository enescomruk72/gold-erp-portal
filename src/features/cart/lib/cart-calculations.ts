import type { ICartItem } from '@/features/cart/store/cart.types';

export function formatCartGr(value: number): string {
    return value.toLocaleString('tr-TR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
}

export function getBirimOrtalamaAgirlikGr(item: ICartItem): number {
    return item.birimOrtalamaAgirlikGr ?? item.agirlikGr ?? 0;
}

export function getTahminiToplamAgirlikGr(item: ICartItem): number {
    return Math.round(getBirimOrtalamaAgirlikGr(item) * item.miktar * 100) / 100;
}

export function getGroupTotalQuantity(lines: ICartItem[]): number {
    return lines.reduce((sum, item) => sum + item.miktar, 0);
}

export function getGroupTahminiToplamAgirlikGr(lines: ICartItem[]): number {
    const total = lines.reduce(
        (sum, item) => sum + getTahminiToplamAgirlikGr(item),
        0,
    );
    return Math.round(total * 100) / 100;
}
