'use client';

import Link from 'next/link';
import { SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { ICartItem } from '@/features/cart/store/cart.types';
import {
    formatCartGr,
    getTahminiToplamAgirlikGr,
} from '@/features/cart/lib/cart-calculations';
import { getCartGroupCount } from '@/features/cart/lib/cart-group-items';

type CartPaymentOrderSummaryProps = {
    items: ICartItem[];
    totalQuantity: number;
    onCompleteOrder: () => void;
    isSubmitting?: boolean;
};

export function CartPaymentOrderSummary({
    items,
    totalQuantity,
    onCompleteOrder,
    isSubmitting = false,
}: CartPaymentOrderSummaryProps) {
    const tahminiToplamAgirlik = items.reduce(
        (sum, item) => sum + getTahminiToplamAgirlikGr(item),
        0
    );
    const roundedToplamAgirlik =
        Math.round(tahminiToplamAgirlik * 100) / 100;
    const groupCount = getCartGroupCount(items);

    const canSubmit = items.length > 0 && !isSubmitting;

    return (
        <div className="space-y-4">
            <Card className="overflow-hidden border shadow-sm py-0">
                <CardHeader className="border-b bg-muted/30 px-4 py-3">
                    <h2 className="text-lg font-semibold">Sipariş Özeti</h2>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm dark:bg-neutral-900/40">
                        <div className="flex justify-between gap-3">
                            <span className="text-muted-foreground">Çeşit / adet</span>
                            <span className="shrink-0 font-semibold tabular-nums">
                                {groupCount} çeşit · {totalQuantity} adet
                            </span>
                        </div>
                        <div className="mt-2 flex justify-between gap-3">
                            <span className="text-muted-foreground">
                                Tahmini toplam ağırlık
                            </span>
                            <span className="shrink-0 font-semibold tabular-nums">
                                {formatCartGr(roundedToplamAgirlik)} gr
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Button
                type="button"
                size="lg"
                className="w-full rounded-full py-6 text-base font-semibold bg-[#0b57d0] hover:bg-[#0b57d0]/90"
                disabled={!canSubmit}
                onClick={onCompleteOrder}
            >
                <SendHorizonal className="mr-2 size-5" />
                {isSubmitting ? 'İşleniyor…' : 'Siparişi Tamamla'}
            </Button>

            <Button variant="link" className="w-full text-sm" asChild>
                <Link href="/cart">Sepete dön</Link>
            </Button>
        </div>
    );
}
