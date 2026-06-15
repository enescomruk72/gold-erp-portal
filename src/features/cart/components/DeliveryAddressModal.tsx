'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight, Loader2, Pencil, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    deliveryAddressFormSchema,
    type DeliveryAddressFormValues,
} from '@/features/cart/schemas/delivery-address.schema';
import { useDeliveryAddressStore } from '@/features/cart/store/delivery-address.store';
import { useGetAdresler } from '@/features/cart/api/use-get-adresler';
import { useCreateAdres } from '@/features/cart/api/use-create-adres';
import { useUpdateAdres } from '@/features/cart/api/use-update-adres';
import {
    formatDeliveryAddressFull,
    formatDeliveryAddressLine,
    type IDeliveryAddress,
} from '@/features/cart/types/delivery-address.types';
import { cn } from '@/lib/utils';

type DeliveryAddressModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect?: (address: IDeliveryAddress) => void;
};

type ModalView = 'list' | 'form';

const emptyForm: DeliveryAddressFormValues = {
    baslik: '',
    teslimatAdres: '',
    teslimatIl: '',
    teslimatIlce: '',
    teslimatPostaKodu: '',
};

function addressToForm(address: IDeliveryAddress): DeliveryAddressFormValues {
    return {
        baslik: address.baslik,
        teslimatAdres: address.teslimatAdres,
        teslimatIl: address.teslimatIl,
        teslimatIlce: address.teslimatIlce,
        teslimatPostaKodu: address.teslimatPostaKodu ?? '',
    };
}

function formToApiBody(values: DeliveryAddressFormValues) {
    return {
        baslik: values.baslik.trim(),
        adresMetni: values.teslimatAdres.trim(),
        sehirAdi: values.teslimatIl.trim(),
        ilceAdi: values.teslimatIlce.trim(),
        ...(values.teslimatPostaKodu?.trim()
            ? { postaKodu: values.teslimatPostaKodu.trim() }
            : {}),
    };
}

type DeliveryAddressModalSessionProps = {
    selectedAddressId: string | null;
    onOpenChange: (open: boolean) => void;
    onSelect?: (address: IDeliveryAddress) => void;
};

function DeliveryAddressModalSession({
    selectedAddressId,
    onOpenChange,
    onSelect,
}: DeliveryAddressModalSessionProps) {
    const { addresses, isLoading, isError } = useGetAdresler('TESLIMAT');
    const selectAddress = useDeliveryAddressStore((s) => s.selectAddress);
    const createAdres = useCreateAdres();
    const updateAdres = useUpdateAdres();

    const [view, setView] = useState<ModalView>('list');
    const [draftId, setDraftId] = useState<string | null>(null);
    const [pendingId, setPendingId] = useState<string | null>(selectedAddressId);

    const form = useForm<DeliveryAddressFormValues>({
        resolver: zodResolver(deliveryAddressFormSchema),
        defaultValues: emptyForm,
    });

    const openCreate = () => {
        setDraftId(null);
        form.reset(emptyForm);
        setView('form');
    };

    const openEdit = (address: IDeliveryAddress) => {
        if (!address.duzenlenebilirMi) return;
        setDraftId(address.id);
        form.reset(addressToForm(address));
        setView('form');
    };

    const handleConfirmSelect = () => {
        const picked = addresses.find((a) => a.id === pendingId);
        if (!picked) return;
        selectAddress(picked.id);
        onSelect?.(picked);
        onOpenChange(false);
    };

    const onSubmit = async (values: DeliveryAddressFormValues) => {
        const body = formToApiBody(values);
        try {
            if (draftId) {
                await updateAdres.mutateAsync({ id: draftId, body });
                setPendingId(draftId);
                toast.success('Adres güncellendi');
            } else {
                const res = await createAdres.mutateAsync({
                    ...body,
                    varsayilanMi: addresses.length === 0,
                });
                const createdId = res.data?.id;
                if (createdId) setPendingId(createdId);
                toast.success('Adres eklendi');
            }
            setView('list');
        } catch {
            toast.error('Adres kaydedilemedi');
        }
    };

    const isSaving = createAdres.isPending || updateAdres.isPending;

    return (
        <>
            <DialogHeader className="border-b px-4 py-4">
                <DialogTitle className="text-base font-bold sm:text-lg">
                    {view === 'list' ? 'Teslimat Adresi' : draftId ? 'Adresi Düzenle' : 'Adres Ekle'}
                </DialogTitle>
            </DialogHeader>

            {view === 'list' ? (
                <div className="flex min-h-0 flex-1 flex-col">
                    <div className="max-h-[50vh] overflow-y-auto px-4 py-4">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Adresler yükleniyor…
                            </div>
                        ) : isError ? (
                            <p className="py-8 text-center text-sm text-destructive">
                                Adresler yüklenemedi.
                            </p>
                        ) : addresses.length === 0 ? (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                Kayıtlı teslimat adresi yok. Yeni adres ekleyin.
                            </p>
                        ) : (
                            <RadioGroup
                                value={pendingId ?? ''}
                                onValueChange={setPendingId}
                                className="gap-3"
                            >
                                {addresses.map((address) => (
                                    <label
                                        key={address.id}
                                        className={cn(
                                            'block cursor-pointer rounded-lg border p-4 transition-colors',
                                            pendingId === address.id
                                                ? 'border-[#0b57d0] bg-[#0b57d0]/5'
                                                : 'border-neutral-200 hover:border-neutral-300',
                                        )}
                                    >
                                        <div className="flex items-start gap-3">
                                            <RadioGroupItem
                                                value={address.id}
                                                id={`addr-${address.id}`}
                                                className="mt-0.5"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="text-sm font-bold text-neutral-900">
                                                        {address.baslik}
                                                        {address.varsayilanMi ? (
                                                            <span className="ml-2 text-xs font-normal text-[#0b57d0]">
                                                                Varsayılan
                                                            </span>
                                                        ) : null}
                                                    </p>
                                                    {address.duzenlenebilirMi ? (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-7 shrink-0 px-2 text-xs text-[#0b57d0]"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                openEdit(address);
                                                            }}
                                                        >
                                                            <Pencil className="mr-1 size-3" />
                                                            Düzenle
                                                        </Button>
                                                    ) : null}
                                                </div>
                                                <p className="mt-1 text-xs font-medium text-neutral-700">
                                                    {formatDeliveryAddressLine(address)}
                                                </p>
                                                <p className="mt-1 text-xs leading-relaxed text-neutral-600">
                                                    {address.teslimatAdres}
                                                </p>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </RadioGroup>
                        )}
                    </div>

                    <div className="space-y-3 border-t px-4 py-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full border-[#0b57d0] text-[#0b57d0] hover:bg-[#0b57d0]/5"
                            onClick={openCreate}
                        >
                            <Plus className="mr-2 size-4" />
                            Yeni Adres Ekle
                        </Button>
                        <Button
                            type="button"
                            className="w-full bg-[#0b57d0] hover:bg-[#0b57d0]/90"
                            disabled={!pendingId || isLoading}
                            onClick={handleConfirmSelect}
                        >
                            Adresi Seç
                        </Button>
                    </div>
                </div>
            ) : (
                <form
                    className="flex min-h-0 flex-1 flex-col"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <div className="max-h-[50vh] space-y-4 overflow-y-auto px-4 py-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="addr-baslik">Adres Başlığı *</Label>
                            <Input
                                id="addr-baslik"
                                placeholder="Örn. Merkez, Şube"
                                {...form.register('baslik')}
                            />
                            {form.formState.errors.baslik ? (
                                <p className="text-xs text-destructive">
                                    {form.formState.errors.baslik.message}
                                </p>
                            ) : null}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="addr-satir">Açık Adres *</Label>
                            <Textarea
                                id="addr-satir"
                                rows={3}
                                placeholder="Mahalle, sokak, bina no, daire…"
                                className="resize-none"
                                {...form.register('teslimatAdres')}
                            />
                            {form.formState.errors.teslimatAdres ? (
                                <p className="text-xs text-destructive">
                                    {form.formState.errors.teslimatAdres.message}
                                </p>
                            ) : null}
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="addr-il">İl *</Label>
                                <Input id="addr-il" placeholder="İl" {...form.register('teslimatIl')} />
                                {form.formState.errors.teslimatIl ? (
                                    <p className="text-xs text-destructive">
                                        {form.formState.errors.teslimatIl.message}
                                    </p>
                                ) : null}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="addr-ilce">İlçe *</Label>
                                <Input
                                    id="addr-ilce"
                                    placeholder="İlçe"
                                    {...form.register('teslimatIlce')}
                                />
                                {form.formState.errors.teslimatIlce ? (
                                    <p className="text-xs text-destructive">
                                        {form.formState.errors.teslimatIlce.message}
                                    </p>
                                ) : null}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="addr-posta">Posta Kodu</Label>
                            <Input
                                id="addr-posta"
                                placeholder="34000"
                                {...form.register('teslimatPostaKodu')}
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 border-t px-4 py-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => setView('list')}
                            disabled={isSaving}
                        >
                            Geri
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-[#0b57d0] hover:bg-[#0b57d0]/90"
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                    Kaydediliyor…
                                </>
                            ) : (
                                'Kaydet'
                            )}
                        </Button>
                    </div>
                </form>
            )}
        </>
    );
}

export function DeliveryAddressModal({
    open,
    onOpenChange,
    onSelect,
}: DeliveryAddressModalProps) {
    const selectedAddressId = useDeliveryAddressStore((s) => s.selectedAddressId);
    const sessionKey = `${open}-${selectedAddressId ?? 'none'}`;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
                <DeliveryAddressModalSession
                    key={sessionKey}
                    selectedAddressId={selectedAddressId}
                    onOpenChange={onOpenChange}
                    onSelect={onSelect}
                />
            </DialogContent>
        </Dialog>
    );
}

/** Seçili adres önizleme kartı */
export function DeliveryAddressPreviewCard({
    address,
    onChangeClick,
}: {
    address: IDeliveryAddress;
    onChangeClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onChangeClick}
            className="flex w-full items-center gap-3 rounded-lg border border-[#0b57d0]/40 bg-white p-3 text-left transition-colors hover:bg-[#0b57d0]/5"
        >
            <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-neutral-900">
                    {address.baslik}{' '}
                    <span className="font-normal text-neutral-600">
                        ({formatDeliveryAddressLine(address)})
                    </span>
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-neutral-600">
                    {formatDeliveryAddressFull(address)}
                </p>
            </div>
            <ChevronRight className="size-4 shrink-0 text-neutral-400" />
        </button>
    );
}
