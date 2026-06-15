'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useCartStore, useCartTotalQuantity } from '@/features/cart';
import { CartPaymentProductsSection } from '@/features/cart/components/CartPaymentProductsSection';
import {
    CartPaymentDeliverySection,
    type TeslimatTipi,
} from '@/features/cart/components/CartPaymentDeliverySection';
import { CartPaymentContractsSection } from '@/features/cart/components/CartPaymentContractsSection';
import { CartPaymentOrderSummary } from '@/features/cart/components/CartPaymentOrderSummary';
import { useGetSozlesmeler } from '@/features/contracts';
import { useDeliveryAddressStore } from '@/features/cart/store/delivery-address.store';
import { useCreateOrder } from '@/features/cart/api/use-create-order';
import { useGetPublicAyarlar } from '@/features/settings';

export default function CartPaymentPage() {
    const router = useRouter();
    const items = useCartStore((s) => s.items);
    const siparisNotu = useCartStore((s) => s.siparisNotu);
    const totalQuantity = useCartTotalQuantity();
    const clearCart = useCartStore((s) => s.clearCart);

    const selectedAddressId = useDeliveryAddressStore((s) => s.selectedAddressId);
    const createOrder = useCreateOrder();
    const {
        isMaintenanceMode,
        maintenanceMessage,
        allowOrders,
        minOrderAmount,
        minOrderCurrency,
    } = useGetPublicAyarlar();

    const cartTotal = items.reduce((sum, item) => sum + item.satirToplam, 0);

    const { data: sozlesmeler, isLoading: sozlesmelerLoading } =
        useGetSozlesmeler('checkout');

    const [teslimatTipi, setTeslimatTipi] = useState<TeslimatTipi>('adres');

    if (items.length === 0) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 py-16">
                <p className="text-muted-foreground">Sepetiniz boş.</p>
                <Button asChild>
                    <Link href="/products">Ürünlere git</Link>
                </Button>
            </div>
        );
    }

    const handleCompleteOrder = async () => {
        if (isMaintenanceMode) {
            toast.error(maintenanceMessage);
            return;
        }

        if (!allowOrders) {
            toast.error('Şu anda sipariş alınamıyor. Lütfen firmanızla iletişime geçin.');
            return;
        }

        if (minOrderAmount > 0 && cartTotal < minOrderAmount) {
            toast.error(
                `Minimum sipariş tutarı ${minOrderAmount.toLocaleString('tr-TR')} ${minOrderCurrency}`,
            );
            return;
        }

        if (teslimatTipi === 'adres' && !selectedAddressId) {
            toast.error('Lütfen teslimat adresi seçin');
            return;
        }

        try {
            await createOrder.mutateAsync({
                urunler: items.map((item) => ({
                    urunId: item.productId,
                    miktar: item.miktar,
                    ...(item.urunNotu ? { aciklama: item.urunNotu } : {}),
                })),
                ...(teslimatTipi === 'adres' && selectedAddressId
                    ? { teslimatAdresId: selectedAddressId }
                    : {}),
                ...(siparisNotu.trim() ? { notlar: siparisNotu.trim() } : {}),
            });
            clearCart();
            toast.success('Siparişiniz alındı');
            router.push('/orders');
        } catch {
            toast.error('Sipariş oluşturulamadı');
        }
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-2 mb-2 h-8 px-2 text-muted-foreground"
                        asChild
                    >
                        <Link href="/cart">
                            <ChevronLeft className="mr-1 size-4" />
                            Sepete dön
                        </Link>
                    </Button>
                    <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                        Ödeme ve Onay
                    </h1>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        Siparişinizi tamamlamadan önce bilgilerinizi kontrol edin
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:gap-8">
                <div className="min-w-0 flex-1 space-y-4">
                    <CartPaymentProductsSection
                        items={items}
                        totalQuantity={totalQuantity}
                    />

                    <CartPaymentDeliverySection
                        value={teslimatTipi}
                        onChange={setTeslimatTipi}
                    />

                    <CartPaymentContractsSection
                        sozlesmeler={sozlesmeler}
                        isLoading={sozlesmelerLoading}
                    />
                </div>

                <aside className="w-full shrink-0 xl:sticky xl:top-20 xl:w-96">
                    <CartPaymentOrderSummary
                        items={items}
                        totalQuantity={totalQuantity}
                        onCompleteOrder={handleCompleteOrder}
                        isSubmitting={createOrder.isPending}
                    />
                </aside>
            </div>
        </div>
    );
}
