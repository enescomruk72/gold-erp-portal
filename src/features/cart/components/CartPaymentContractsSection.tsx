'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
    getCheckoutLinkedSozlesmeler,
    getSozlesmeHref,
    type SozlesmeDTO,
} from '@/features/contracts';
import { CartPaymentSectionCard } from './CartPaymentSectionCard';

type CartPaymentContractsSectionProps = {
    sozlesmeler: SozlesmeDTO[];
    isLoading?: boolean;
};

export function CartPaymentContractsSection({
    sozlesmeler,
    isLoading = false,
}: CartPaymentContractsSectionProps) {
    const linked = getCheckoutLinkedSozlesmeler(sozlesmeler);

    return (
        <CartPaymentSectionCard title="Sözleşmeler ve Formlar">
            {isLoading ? (
                <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ) : linked.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                    İlgili yasal metinler için{' '}
                    <Link href="/yasal" className="font-medium text-[#0b57d0] underline">
                        yasal metinler
                    </Link>{' '}
                    sayfasını ziyaret edin.
                </p>
            ) : (
                <ul className="space-y-2">
                    {linked.map((sozlesme) => (
                        <li key={sozlesme.id}>
                            <Link
                                href={getSozlesmeHref(sozlesme)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0b57d0] hover:underline"
                            >
                                {sozlesme.baslik}
                                <ExternalLink className="size-3.5 shrink-0 opacity-70" />
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </CartPaymentSectionCard>
    );
}
