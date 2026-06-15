'use client';

import { useMemo } from 'react';
import { Camera, ChevronDown, Heart, Star } from 'lucide-react';
import {
    buildProductDetailMock,
    ratingStars,
} from '@/features/products/lib/product-detail-mock';
import { cn } from '@/lib/utils';

type ProductDetailSocialProofProps = {
    seedKey: string;
    className?: string;
};

export function ProductDetailSocialProof({ seedKey, className }: ProductDetailSocialProofProps) {
    const mock = useMemo(() => buildProductDetailMock(seedKey).social, [seedKey]);
    const stars = ratingStars(mock.rating);

    return (
        <div className={cn('space-y-2.5', className)}>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-neutral-600">
                <span className="font-semibold text-neutral-900">{mock.rating.toFixed(1)}</span>
                <span className="inline-flex items-center gap-0.5">
                    {Array.from({ length: stars.filled }).map((_, i) => (
                        <Star key={`f-${i}`} className="size-4 fill-amber-400 text-amber-400" />
                    ))}
                    {Array.from({ length: stars.empty }).map((_, i) => (
                        <Star key={`e-${i}`} className="size-4 text-neutral-300" />
                    ))}
                </span>
                <ChevronDown className="size-4 text-neutral-400" aria-hidden />
                <span className="text-neutral-400">·</span>
                <span>{mock.reviewCount} Değerlendirme</span>
                <Camera className="size-4 text-neutral-400" aria-hidden />
                <span className="text-neutral-400">·</span>
                <button type="button" className="hover:text-neutral-900 hover:underline">
                    {mock.qaCount} Soru-Cevap
                </button>
            </div>

            <p className="flex items-center gap-1.5 text-sm text-neutral-700">
                <Heart className="size-4 fill-[#0b57d0] text-[#0b57d0]" aria-hidden />
                <span>
                    Sevilen ürün!{' '}
                    <strong className="font-semibold text-[#0b57d0]">
                        {mock.favoriteCountLabel}
                    </strong>{' '}
                    kişi favoriledi!
                </span>
            </p>
        </div>
    );
}
