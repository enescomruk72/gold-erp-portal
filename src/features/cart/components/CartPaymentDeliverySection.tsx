'use client';

import { useEffect, useState } from 'react';
import { MapPin, Store, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CartPaymentSectionCard } from './CartPaymentSectionCard';
import {
    DeliveryAddressModal,
    DeliveryAddressPreviewCard,
} from './DeliveryAddressModal';
import { useDeliveryAddressStore } from '@/features/cart/store/delivery-address.store';
import { useGetAdresler } from '@/features/cart/api/use-get-adresler';
import { cn } from '@/lib/utils';

export type TeslimatTipi = 'magaza' | 'adres';

const MAGAZA_BILGI = {
    ad: 'AKBEN Merkez Mağaza',
    adres: 'Kuyumcular Çarşısı No: 12, Kapalıçarşı, Fatih / İstanbul',
    telefon: '0212 000 00 00',
    calisma: 'Pzt–Cmt 09:00 – 19:00',
};

type CartPaymentDeliverySectionProps = {
    value: TeslimatTipi;
    onChange: (value: TeslimatTipi) => void;
};

export function CartPaymentDeliverySection({
    value,
    onChange,
}: CartPaymentDeliverySectionProps) {
    const [addressModalOpen, setAddressModalOpen] = useState(false);
    const [faturaAyniAdres, setFaturaAyniAdres] = useState(true);

    const selectedAddressId = useDeliveryAddressStore((s) => s.selectedAddressId);
    const selectAddress = useDeliveryAddressStore((s) => s.selectAddress);

    const { addresses, defaultAddress, isLoading } = useGetAdresler('TESLIMAT');

    useEffect(() => {
        if (isLoading || addresses.length === 0) return;
        const stillValid = addresses.some((a) => a.id === selectedAddressId);
        if (!stillValid) {
            selectAddress(defaultAddress?.id ?? addresses[0]?.id ?? null);
        }
    }, [addresses, defaultAddress, isLoading, selectedAddressId, selectAddress]);

    const selectedAddress =
        addresses.find((a) => a.id === selectedAddressId) ?? defaultAddress ?? null;

    return (
        <>
            <CartPaymentSectionCard title="Teslimat Adresi">
                <RadioGroup
                    value={value}
                    onValueChange={(v) => onChange(v as TeslimatTipi)}
                    className="gap-4"
                >
                    <div
                        className={cn(
                            'rounded-lg border p-4 transition-colors',
                            value === 'adres'
                                ? 'border-[#0b57d0] bg-[#0b57d0]/5'
                                : 'border-neutral-200',
                        )}
                    >
                        <div className="flex items-start gap-3">
                            <RadioGroupItem value="adres" id="teslimat-adres" className="mt-1" />
                            <div className="min-w-0 flex-1 space-y-3">
                                <Label
                                    htmlFor="teslimat-adres"
                                    className={cn(
                                        'flex cursor-pointer items-center gap-2 text-base font-bold',
                                        value === 'adres' ? 'text-[#0b57d0]' : 'text-neutral-900',
                                    )}
                                >
                                    <MapPin
                                        className={cn(
                                            'size-4',
                                            value === 'adres' ? 'text-[#0b57d0]' : 'text-neutral-500',
                                        )}
                                    />
                                    Adrese Teslim Edilsin
                                </Label>

                                {value === 'adres' ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="text-sm font-semibold text-neutral-800">
                                                Teslimat Adresi
                                            </p>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="shrink-0 border-[#0b57d0] text-[#0b57d0] hover:bg-[#0b57d0]/5"
                                                onClick={() => setAddressModalOpen(true)}
                                            >
                                                + Adres Ekle / Değiştir
                                            </Button>
                                        </div>

                                        {isLoading ? (
                                            <div className="flex items-center gap-2 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-4 text-sm text-muted-foreground">
                                                <Loader2 className="size-4 animate-spin" />
                                                Adresler yükleniyor…
                                            </div>
                                        ) : selectedAddress ? (
                                            <DeliveryAddressPreviewCard
                                                address={selectedAddress}
                                                onChangeClick={() => setAddressModalOpen(true)}
                                            />
                                        ) : (
                                            <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-4 text-center text-sm text-muted-foreground">
                                                Henüz adres seçilmedi.
                                            </div>
                                        )}

                                        <label className="flex cursor-pointer items-center gap-2">
                                            <Checkbox
                                                checked={faturaAyniAdres}
                                                onCheckedChange={(c) =>
                                                    setFaturaAyniAdres(c === true)
                                                }
                                            />
                                            <span className="text-sm text-neutral-700">
                                                Faturamı aynı adrese gönder
                                            </span>
                                        </label>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <div
                        className={cn(
                            'rounded-lg border p-4 transition-colors',
                            value === 'magaza'
                                ? 'border-[#0b57d0] bg-[#0b57d0]/5'
                                : 'border-neutral-200',
                        )}
                    >
                        <div className="flex items-start gap-3">
                            <RadioGroupItem value="magaza" id="teslimat-magaza" className="mt-1" />
                            <div className="min-w-0 flex-1 space-y-2">
                                <Label
                                    htmlFor="teslimat-magaza"
                                    className={cn(
                                        'flex cursor-pointer items-center gap-2 text-base font-bold',
                                        value === 'magaza' ? 'text-[#0b57d0]' : 'text-neutral-900',
                                    )}
                                >
                                    <Store
                                        className={cn(
                                            'size-4',
                                            value === 'magaza' ? 'text-[#0b57d0]' : 'text-neutral-500',
                                        )}
                                    />
                                    Mağazadan Teslim Al
                                </Label>
                                {value === 'magaza' ? (
                                    <div className="space-y-1 rounded-lg border border-neutral-200 bg-white p-3 text-xs text-neutral-600">
                                        <p className="font-bold text-neutral-900">
                                            {MAGAZA_BILGI.ad}
                                        </p>
                                        <p>{MAGAZA_BILGI.adres}</p>
                                        <p>Tel: {MAGAZA_BILGI.telefon}</p>
                                        <p>{MAGAZA_BILGI.calisma}</p>
                                        <p className="pt-1 text-neutral-500">
                                            Siparişiniz hazır olduğunda bilgilendirileceksiniz.
                                        </p>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </RadioGroup>
            </CartPaymentSectionCard>

            <DeliveryAddressModal
                open={addressModalOpen}
                onOpenChange={setAddressModalOpen}
            />
        </>
    );
}
