'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ProductDetailDTO } from '@/features/products/types/product-detail.types';
import { cn } from '@/lib/utils';
import { ProductDetailSpecGrid } from './ProductDetailSpecGrid';
import Image from 'next/image';
type ProductDetailInformationProps = {
    detail: ProductDetailDTO;
};

const EK_BILGILER = [
    'Bu ürün AKBEN kataloğundan gönderilecektir.',
    'Kampanya fiyatından satılmak üzere stok sunulmuştur.',
    'İncelemiş olduğunuz ürünün satış fiyatını satıcı belirlemektedir.',
    '15 gün içinde ücretsiz iade hakkınız bulunmaktadır.',
];

export function ProductDetailInformation({ detail }: ProductDetailInformationProps) {
    const { product, attributes } = detail;
    const [descExpanded, setDescExpanded] = useState(false);
    const [specExpanded, setSpecExpanded] = useState(true);

    const thumbnailUrl = useMemo(() => {
        const sorted = [...(product.images ?? [])]
            .filter((img) => img.url)
            .sort((a, b) => {
                if (a.varsayilanMi && !b.varsayilanMi) return -1;
                if (!a.varsayilanMi && b.varsayilanMi) return 1;
                return a.siraNo - b.siraNo;
            });
        return sorted[0]?.url ?? null;
    }, [product.images]);

    const materyalRow = attributes.find(
        (row) =>
            row.label.toLowerCase().includes('materyal') ||
            row.label.toLowerCase().includes('ayar')
    );

    const specRows = attributes.filter(
        (row) => row.kind !== 'identifier' && row.kind !== 'slicer' && row.kind !== 'varianter'
    );

    return (
        <section
            id="pdp-info"
            className="mt-12 scroll-mt-12 border-t border-border pt-gutter"
        >
            <h2 className="mb-6 text-lg font-semibold text-neutral-900">Ürün Bilgileri</h2>

            <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-neutral-900">Ürün Açıklaması</h3>
                    <div className="flex gap-4">
                        {thumbnailUrl ? (
                            <div className="relative size-20 shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-neutral-50">
                                <Image
                                    src={thumbnailUrl}
                                    alt={product.urunAdi}
                                    width={80}
                                    height={80}
                                    quality={80}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        ) : null}
                        <div className="min-w-0 flex-1">
                            {product.aciklama ? (
                                <div
                                    className={cn(
                                        'prose prose-sm max-w-none text-neutral-700 prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5',
                                        !descExpanded && 'line-clamp-4'
                                    )}
                                    dangerouslySetInnerHTML={{ __html: product.aciklama }}
                                />
                            ) : (
                                <p className="text-sm text-neutral-600">
                                    22 ayar altın kaplama ürünümüz, özenli kuyumcu işçiliği ile
                                    üretilmiştir. Günlük kullanıma uygundur.
                                </p>
                            )}
                        </div>
                    </div>
                    {product.aciklama ? (
                        <button
                            type="button"
                            onClick={() => setDescExpanded((v) => !v)}
                            className="mx-auto flex items-center gap-1 rounded-full border border-neutral-200 px-4 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                        >
                            {descExpanded ? (
                                <>
                                    DAHA AZ GÖSTER <ChevronUp className="size-3.5" />
                                </>
                            ) : (
                                <>
                                    DEVAMINI OKU <ChevronDown className="size-3.5" />
                                </>
                            )}
                        </button>
                    ) : null}
                </div>

                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-neutral-900">Ek Bilgiler</h3>
                    <ul className="space-y-2 text-sm text-neutral-700">
                        {EK_BILGILER.map((line) => (
                            <li key={line} className="flex gap-2">
                                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#0b57d0]" />
                                <span>{line}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {specRows.length > 0 ? (
                <div className="mt-gutter space-y-base">
                    <h3 className="text-sm font-semibold text-neutral-900">Ürün Özellikleri</h3>
                    <ProductDetailSpecGrid
                        rows={specRows.map((row) => ({ label: row.label, value: row.value }))}
                        className={cn(!specExpanded && 'max-h-[220px] overflow-hidden')}
                    />
                    {specRows.length > 6 ? (
                        <button
                            type="button"
                            onClick={() => setSpecExpanded((v) => !v)}
                            className="mx-auto flex items-center gap-1 rounded-full border border-neutral-200 px-4 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                        >
                            {specExpanded ? (
                                <>
                                    DAHA AZ GÖSTER <ChevronUp className="size-3.5" />
                                </>
                            ) : (
                                <>
                                    TÜMÜNÜ GÖSTER <ChevronDown className="size-3.5" />
                                </>
                            )}
                        </button>
                    ) : null}
                </div>
            ) : null}

            <div className="mt-gutter space-y-base">
                <h3 className="text-sm font-semibold text-neutral-900">Materyal Bileşeni</h3>
                <div className="rounded-md bg-neutral-100 px-4 py-3 text-sm font-medium text-neutral-900">
                    {materyalRow?.value ?? product.ayar?.ayarAdi ?? '22 Ayar Altın Kaplama'}
                </div>
            </div>
        </section>
    );
}
