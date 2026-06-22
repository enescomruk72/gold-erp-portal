'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SheetClose } from '@/components/ui/sheet';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useCart } from '@/features/cart';
import { CartWeightDisclaimer } from './CartWeightDisclaimer';
import { CartItemList } from './CartItemList';
import { CartOrderSummary } from './CartOrderSummary';

type CartSheetPanelProps = {
    onGoToCart?: () => void;
};

export function CartSheetPanel({ onGoToCart }: CartSheetPanelProps) {
    const router = useRouter();
    const [clearCartOpen, setClearCartOpen] = useState(false);
    const {
        items,
        siparisNotu,
        updateQuantity,
        removeItem,
        clearCart,
        setSiparisNotu,
    } = useCart();
    const totalQuantity = items.reduce((sum, item) => sum + item.miktar, 0);

    const handleCheckout = () => {
        if (onGoToCart) onGoToCart();
        else router.push('/cart/payment');
    };

    return (
        <>
            <div className="shrink-0 border-b border-border px-4 py-3">
                <CartWeightDisclaimer />
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <CartItemList
                    items={items}
                    compact
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                />
            </div>

            <div className="shrink-0 border-t border-border bg-card p-4">
                <CartOrderSummary
                    items={items}
                    totalQuantity={totalQuantity}
                    siparisNotu={siparisNotu}
                    onSiparisNotuChange={setSiparisNotu}
                    showSiparisNotu
                    compact
                />
                <SheetClose asChild>
                    <Button
                        type="button"
                        className="mt-4 w-full"
                        size="lg"
                        onClick={handleCheckout}
                    >
                        <ShoppingCart className="mr-2 size-4" />
                        Siparişi Tamamla
                    </Button>
                </SheetClose>
                <SheetClose asChild>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-3 w-full"
                        onClick={() => router.push('/cart')}
                    >
                        Sepet sayfasına git
                    </Button>
                </SheetClose>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2 w-full justify-start"
                    onClick={() => setClearCartOpen(true)}
                >
                    <Trash2 className="mr-2 size-4" />
                    Sepeti temizle
                </Button>
            </div>

            <AlertDialog open={clearCartOpen} onOpenChange={setClearCartOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Sepeti temizle</AlertDialogTitle>
                        <AlertDialogDescription>
                            Sepetteki tüm ürünler kaldırılacak. Emin misiniz?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                await clearCart();
                                setClearCartOpen(false);
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Evet, temizle
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
