'use client';

import { useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import { buildProductDetailMock } from '@/features/products/lib/product-detail-mock';
import { cn } from '@/lib/utils';

type ProductDetailQuestionsProps = {
    seedKey: string;
};

export function ProductDetailQuestions({ seedKey }: ProductDetailQuestionsProps) {
    const { questions, qaFilterChips } = useMemo(
        () => buildProductDetailMock(seedKey),
        [seedKey]
    );

    return (
        <section
            id="pdp-questions"
            className="mt-12 scroll-mt-32 border-t border-neutral-200 pt-8 pb-4"
        >
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">
                Ürün Soru ve Cevapları
            </h2>

            <div className="mb-4 flex flex-wrap gap-2">
                {qaFilterChips.map((chip, index) => (
                    <button
                        key={chip.label}
                        type="button"
                        className={cn(
                            'rounded-full border px-3 py-1 text-xs font-medium capitalize',
                            index === 0
                                ? 'border-neutral-900 bg-neutral-900 text-white'
                                : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                        )}
                    >
                        {chip.label} ({chip.count}) <ChevronRight className="ml-0.5 inline size-3" />
                    </button>
                ))}
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
                {questions.map((item) => (
                    <article
                        key={item.id}
                        className="flex w-[320px] shrink-0 flex-col rounded-lg border border-neutral-200 bg-white p-4"
                    >
                        <p className="text-sm font-semibold text-neutral-900">{item.question}</p>
                        <p className="mt-1 text-xs text-neutral-500">
                            {item.userLabel} · {item.dateLabel}
                        </p>
                        <div className="mt-3 rounded-md bg-neutral-50 p-3">
                            <p className="text-xs font-medium text-neutral-700">
                                AKBEN satıcısının cevabı
                            </p>
                            <p className="mt-0.5 text-[11px] text-neutral-500">
                                {item.answeredInHours} saat içinde cevaplandı.
                            </p>
                            <p className="mt-2 text-sm text-neutral-800">{item.answer}</p>
                        </div>
                    </article>
                ))}
            </div>

            <button
                type="button"
                className="mx-auto mt-4 flex items-center gap-1 rounded-full border border-neutral-300 px-6 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
            >
                TÜM SORULARI GÖSTER <ChevronRight className="size-4" />
            </button>
        </section>
    );
}
