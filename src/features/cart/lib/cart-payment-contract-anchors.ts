export const CART_PAYMENT_CONTRACT_ANCHORS = {
    onBilgilendirme: 'sozlesme-on-bilgilendirme',
    mesafeliSatis: 'sozlesme-mesafeli-satis',
} as const;

export function scrollToPaymentContract(anchorId: string) {
    document.getElementById(anchorId)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
    });
}
