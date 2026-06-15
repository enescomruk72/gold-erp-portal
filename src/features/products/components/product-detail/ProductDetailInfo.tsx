'use client';

import Link from 'next/link';
import { useMemo, type RefObject } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { useFavoritesStore } from '@/features/favorites/store/favorites.store';
import { buildProductDetailQueryString, productPublicHref } from '@/features/products/lib/product-href';
import {
    getProductMiniCategory,
    getProductPrimaryAttributeLabel,
} from '@/features/products/lib/product-card-meta';
import type { ProductDetailDTO } from '@/features/products/types/product-detail.types';
import { ProductDetailSocialProof } from './ProductDetailSocialProof';
import { ProductDetailSpecGrid } from './ProductDetailSpecGrid';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

type ProductDetailInfoProps = {
    detail: ProductDetailDTO;
    slug: string;
    vParam?: string | null;
    listingQuery?: string;
    identifierOzellikIds?: number[];
    purchaseSectionRef?: RefObject<HTMLDivElement | null>;
    onAddToCart?: () => void;
};

export function ProductDetailInfo({
    detail,
    slug,
    vParam,
    listingQuery = '',
    identifierOzellikIds,
    purchaseSectionRef,
    onAddToCart,
}: ProductDetailInfoProps) {
    const router = useRouter();
    const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
    const isFavorite = useFavoritesStore((s) => s.isFavorite);

    const { product, slicerAxes, varianterAxes } = detail;
    const favorited = isFavorite(product.id);

    const categoryLabel = getProductMiniCategory(product);
    const identifierLabel = getProductPrimaryAttributeLabel(product, identifierOzellikIds);
    const saflikLabel = product.ayar?.ayarAdi ?? null;
    const markaLabel = product.marka?.markaAdi ?? null;
    const mockSeed = product.publicSlug ?? product.id;

    const grupKodu = detail.grupKodu ?? product.grup?.grupKodu ?? null;

    const headerSpecRows = useMemo(() => {
        const rows: Array<{ label: string; value: string }> = [];
        if (categoryLabel) rows.push({ label: 'Kategori', value: categoryLabel });
        if (identifierLabel) rows.push({ label: 'Model', value: identifierLabel });
        if (saflikLabel) rows.push({ label: 'Ayar', value: saflikLabel });
        if (markaLabel) rows.push({ label: 'Marka', value: markaLabel });
        return rows;
    }, [categoryLabel, identifierLabel, saflikLabel, markaLabel]);

    const showProductCodes = Boolean(grupKodu || product.urunKodu);

    const handleVarianterSelect = (vParamSlug: string) => {
        const query = buildProductDetailQueryString({ listingQuery, vParam: vParamSlug });
        router.push(
            query
                ? `/p/${encodeURIComponent(slug)}?${query}`
                : `/p/${encodeURIComponent(slug)}`,
        );
    };

    return (
        <div className="flex flex-col gap-gutter">
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <h1 className="text-xl font-semibold leading-snug text-neutral-900 md:text-2xl">
                        {product.urunAdi}
                    </h1>
                    {showProductCodes ? (
                        <div className="flex flex-wrap items-center gap-base text-xs text-neutral-600">
                            {grupKodu ? (
                                <p>
                                    <span className="text-neutral-500 font-medium">Grup Kodu:</span>{' '}
                                    <span className="font-mono font-medium text-neutral-800">{grupKodu}</span>
                                </p>
                            ) : null}
                            {product.urunKodu ? (
                                <p>
                                    <span className="text-neutral-500">Ürün Kodu:</span>{' '}
                                    <span className="font-mono font-medium text-neutral-800">
                                        {product.urunKodu}
                                    </span>
                                </p>
                            ) : null}
                        </div>
                    ) : null}
                </div>

                {headerSpecRows.length > 0 ? (
                    <ProductDetailSpecGrid rows={headerSpecRows} columns={2} />
                ) : null}

                <div className="flex items-center justify-between gap-base rounded-md bg-neutral-100 px-4 py-3">
                    <span className="text-sm text-neutral-600">Ortalama Ağırlık</span>
                    <span className="text-xl font-bold tabular-nums text-neutral-900">
                        {(product.ortalamaAgirlik ?? 0).toLocaleString('tr-TR', {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                        })}{' '}
                        gr
                    </span>
                </div>

                {(product.yeni || product.indirimli) && (
                    <div className="flex flex-wrap gap-2">
                        {product.yeni ? (
                            <span className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white">
                                Yeni
                            </span>
                        ) : null}
                        {product.indirimli ? (
                            <span className="rounded-md bg-rose-600 px-2.5 py-1 text-xs font-medium text-white">
                                İndirimli
                            </span>
                        ) : null}
                    </div>
                )}

                <ProductDetailSocialProof seedKey={mockSeed} />
            </div>

            <Separator />

            <div className="space-y-8">
                {slicerAxes.map((axis) => {
                    const selectedSlicer = axis.options.find((opt) => opt.selected);

                    return (
                        <div key={axis.ozellikId} className="space-y-2">
                            <div className="flex items-center gap-base">
                                <p className="text-sm font-semibold text-neutral-900">{axis.ozellikAdi}&#58;</p>
                                {selectedSlicer ? (
                                    <span className="text-xs font-bold text-primary">
                                        {selectedSlicer.label}
                                    </span>
                                ) : null}
                            </div>
                            <div className="flex flex-wrap gap-base">
                                {axis.options.map((opt) => (
                                    <Link
                                        key={opt.urunId}
                                        href={productPublicHref(opt.publicSlug, undefined, {
                                            listingQuery,
                                        })}
                                        className={cn(buttonVariants({ variant: 'outline', size: 'sm' }),
                                            'bg-white inline-flex min-h-10 min-w-12 items-center justify-center rounded-md ring-2 ring-offset-1 px-3.5 text-sm transition-all',
                                            opt.selected
                                                ? 'ring-[#0b57d0] font-semibold bg-[#0b57d0] text-white hover:bg-[#0b57d0]/90 hover:text-white'
                                                : 'ring-neutral-200 text-neutral-700 hover:ring-neutral-400 ring-1 ring-offset-0'
                                        )}
                                    >
                                        {opt.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {varianterAxes.map((axis) => {
                    const selectedVarianter = axis.options.find((opt) => opt.selected);

                    return (
                        <div key={axis.ozellikId} className="space-y-2">
                            <div className='flex items-center gap-base'>
                                <p className="text-sm font-semibold text-neutral-900">{axis.ozellikAdi}&#58;</p>
                                {/* Seçili özellik göster */}
                                {selectedVarianter && (
                                    <span className="text-xs font-bold text-primary">
                                        {selectedVarianter.label}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-base">
                                {axis.options.map((opt) => (
                                    <Button
                                        key={opt.variantId}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleVarianterSelect(opt.vParamSlug)}
                                        className={cn(
                                            'bg-white inline-flex min-h-10 min-w-12 items-center justify-center rounded-md ring-2 ring-offset-2 px-3.5 text-sm transition-all',
                                            opt.selected || vParam === opt.vParamSlug
                                                ? 'ring-[#0b57d0] text-[#0b57d0] hover:text-[#0b57d0]/90'
                                                : 'ring-neutral-200 text-neutral-700 hover:ring-neutral-400 ring-1 ring-offset-0'
                                        )}
                                    >
                                        {opt.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>

            <div ref={purchaseSectionRef} className="flex gap-base">
                <Button
                    type="button"
                    className="h-12 flex-1 bg-[#0b57d0] text-base font-semibold hover:bg-[#0b57d0]/90"
                    onClick={() => onAddToCart?.()}
                >
                    Sepete Ekle
                </Button>
                <button
                    type="button"
                    aria-label={favorited ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                    onClick={() => toggleFavorite(product.id)}
                    className={cn(
                        'group/favorite flex size-12 shrink-0 border items-center justify-center rounded-full bg-white hover:bg-neutral-100 hover:border-transparent transition-colors',
                        favorited
                            ? 'text-rose-500'
                            : 'text-neutral-600'
                    )}
                >
                    <Heart className={cn('size-5 group-hover/favorite:text-rose-500', favorited && 'fill-rose-500')} />
                </button>
            </div>
        </div>
    );
}
