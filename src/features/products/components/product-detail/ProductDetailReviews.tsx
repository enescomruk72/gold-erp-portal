'use client';

import { useMemo } from 'react';
import { ChevronRight, Star, ThumbsUp } from 'lucide-react';
import {
    buildProductDetailMock,
    ratingStars,
} from '@/features/products/lib/product-detail-mock';

type ProductDetailReviewsProps = {
    seedKey: string;
};

export function ProductDetailReviews({ seedKey }: ProductDetailReviewsProps) {
    const { social, reviews } = useMemo(() => buildProductDetailMock(seedKey), [seedKey]);
    const stars = ratingStars(social.rating);

    return (
        <section
            id="pdp-reviews"
            className="mt-12 scroll-mt-32 border-t border-neutral-200 pt-8"
        >
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">Ürün Değerlendirmeleri</h2>

            <div className="mb-4 flex flex-wrap items-center gap-3 rounded-md bg-amber-50 px-4 py-3 text-sm">
                <span className="inline-flex items-center gap-0.5">
                    {Array.from({ length: stars.filled }).map((_, i) => (
                        <Star key={`f-${i}`} className="size-4 fill-amber-400 text-amber-400" />
                    ))}
                    {Array.from({ length: stars.empty }).map((_, i) => (
                        <Star key={`e-${i}`} className="size-4 text-neutral-300" />
                    ))}
                </span>
                <span className="font-semibold text-neutral-900">{social.rating.toFixed(1)}</span>
                <span className="text-neutral-500">·</span>
                <span className="text-neutral-700">{social.reviewCount} Değerlendirme</span>
                <span className="text-neutral-500">·</span>
                <span className="text-neutral-700">{social.commentCount} Yorum</span>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
                <article className="w-[280px] shrink-0 rounded-lg border border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50 p-4">
                    <p className="text-xs font-semibold text-violet-700">AI Değerlendirme Özeti</p>
                    <ul className="mt-2 space-y-1.5 text-xs text-neutral-700">
                        <li>• İşçilik kalitesi genel olarak beğeniliyor.</li>
                        <li>• Fotoğrafla uyum yüksek bulunuyor.</li>
                        <li>• Gramaj beklentiyle örtüşüyor.</li>
                    </ul>
                    <button type="button" className="mt-3 text-xs font-medium text-violet-700 underline">
                        Devamını Oku
                    </button>
                </article>

                {reviews.map((review) => (
                    <article
                        key={review.id}
                        className="flex w-[300px] shrink-0 flex-col rounded-lg border border-neutral-200 bg-white p-4"
                    >
                        <div className="inline-flex items-center gap-0.5">
                            {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                            ))}
                        </div>
                        <p className="mt-2 text-xs text-neutral-500">
                            {review.userLabel} · {review.dateLabel}
                        </p>
                        {review.variantLabel ? (
                            <p className="mt-1 text-xs font-semibold text-neutral-800">
                                {review.variantLabel}
                            </p>
                        ) : null}
                        <p className="mt-2 line-clamp-4 flex-1 text-sm text-neutral-700">
                            {review.body}
                        </p>
                        <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
                            <span>AKBEN satıcısından alındı</span>
                            <button type="button" aria-label="Beğen">
                                <ThumbsUp className="size-3.5" />
                            </button>
                        </div>
                    </article>
                ))}
            </div>

            <button
                type="button"
                className="mx-auto mt-4 flex items-center gap-1 rounded-full border border-neutral-300 px-6 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
            >
                TÜM YORUMLARI GÖSTER <ChevronRight className="size-4" />
            </button>
        </section>
    );
}
