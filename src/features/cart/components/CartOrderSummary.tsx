'use client';

import { SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CartCollapsibleNoteField } from './CartCollapsibleNoteField';
import type { ICartItem } from '@/features/cart/store/cart.types';
import {
    formatCartGr,
    getTahminiToplamAgirlikGr,
} from '@/features/cart/lib/cart-calculations';
import { getCartGroupCount } from '@/features/cart/lib/cart-group-items';
import { cn } from '@/lib/utils';

type CartOrderSummaryProps = {
    items: ICartItem[];
    totalQuantity: number;
    siparisNotu?: string;
    onSiparisNotuChange?: (value: string) => void;
    showSiparisNotu?: boolean;
    showCheckoutButton?: boolean;
    onCheckout?: () => void;
    compact?: boolean;
    className?: string;
};

export function CartOrderSummary({
    items,
    totalQuantity,
    siparisNotu = '',
    onSiparisNotuChange,
    showSiparisNotu = false,
    showCheckoutButton = false,
    onCheckout,
    compact = false,
    className,
}: CartOrderSummaryProps) {
    const tahminiToplamAgirlik = items.reduce(
        (sum, item) => sum + getTahminiToplamAgirlikGr(item),
        0
    );
    const roundedToplamAgirlik =
        Math.round(tahminiToplamAgirlik * 100) / 100;
    const groupCount = getCartGroupCount(items);

    const body = (
        <div className={cn('space-y-4', compact && 'space-y-3 text-sm')}>
            <div
                className={cn(
                    'rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 dark:bg-neutral-900/40',
                    compact && 'px-3 py-2.5'
                )}
            >
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Çeşit / adet</span>
                    <span className="font-semibold tabular-nums">
                        {groupCount} çeşit · {totalQuantity} adet
                    </span>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">
                        Tahmini toplam ağırlık
                    </span>
                    <span className="font-semibold tabular-nums">
                        {formatCartGr(roundedToplamAgirlik)} gr
                    </span>
                </div>
            </div>

            {showSiparisNotu && onSiparisNotuChange ? (
                <CartCollapsibleNoteField
                    id="siparis-notu"
                    label="Sipariş notu"
                    addButtonLabel="Sipariş Notu Ekle"
                    value={siparisNotu}
                    onChange={onSiparisNotuChange}
                    placeholder="Tüm sipariş için genel notunuz…"
                    rows={3}
                />
            ) : null}

            {showCheckoutButton ? (
                <Button
                    type="button"
                    className={cn(
                        'w-full font-semibold',
                        compact ? '' : 'rounded-full py-6 text-base'
                    )}
                    size="lg"
                    onClick={onCheckout}
                >
                    <SendHorizonal className="mr-2 size-5" />
                    Siparişi Tamamla
                </Button>
            ) : null}
        </div>
    );

    if (compact) {
        return <div className={className}>{body}</div>;
    }

    return (
        <Card className={cn('overflow-hidden border shadow-sm py-base', className)}>
            <CardHeader className="border-b bg-muted/30 py-0!">
                <h2 className="text-lg font-semibold">Sipariş Özeti</h2>
            </CardHeader>
            <CardContent className="py-4">{body}</CardContent>
        </Card>
    );
}
