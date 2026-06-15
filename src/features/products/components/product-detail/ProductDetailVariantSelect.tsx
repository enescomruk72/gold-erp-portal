'use client';

import { useRouter } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { buildProductDetailQueryString, productPublicHref } from '@/features/products/lib/product-href';
import type { ProductDetailDTO } from '@/features/products/types/product-detail.types';

type ProductDetailVariantSelectProps = {
    detail: ProductDetailDTO;
    slug: string;
    vParam?: string | null;
    listingQuery?: string;
    compact?: boolean;
    className?: string;
};

export function ProductDetailVariantSelect({
    detail,
    slug,
    vParam,
    listingQuery = '',
    compact = false,
}: ProductDetailVariantSelectProps) {
    const router = useRouter();
    const { varianterAxes, slicerAxes } = detail;

    const primaryVarianter = varianterAxes[0];
    const primarySlicer = slicerAxes[0];

    const handleVarianterChange = (vParamSlug: string) => {
        const query = buildProductDetailQueryString({ listingQuery, vParam: vParamSlug });
        router.push(
            query
                ? `/p/${encodeURIComponent(slug)}?${query}`
                : `/p/${encodeURIComponent(slug)}`,
        );
    };

    if (!primaryVarianter && !primarySlicer) return null;

    if (primaryVarianter) {
        const selected =
            primaryVarianter.options.find(
                (o) => o.selected || vParam === o.vParamSlug
            ) ?? primaryVarianter.options[0];

        return (
            <div className={compact ? 'min-w-[140px] max-w-[200px]' : 'w-full max-w-xs'}>
                {!compact ? (
                    <p className="mb-1.5 text-sm font-semibold text-neutral-900">
                        {primaryVarianter.ozellikAdi}
                    </p>
                ) : null}
                <Select
                    value={selected?.vParamSlug ?? ''}
                    onValueChange={handleVarianterChange}
                >
                    <SelectTrigger size={compact ? 'sm' : 'default'} className="w-full bg-white h-12!">
                        <SelectValue placeholder={primaryVarianter.ozellikAdi} />
                    </SelectTrigger>
                    <SelectContent
                        position="popper"
                        side="bottom"
                        sideOffset={4}
                        className="z-100 isolate"
                    >
                        {primaryVarianter.options.map((opt) => (
                            <SelectItem key={opt.variantId} value={opt.vParamSlug}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        );
    }

    if (primarySlicer) {
        const selected = primarySlicer.options.find((o) => o.selected) ?? primarySlicer.options[0];
        if (!selected) return null;

        return (
            <div className={compact ? 'min-w-[140px] max-w-[200px]' : 'w-full max-w-xs'}>
                {!compact ? (
                    <p className="mb-1.5 text-sm font-semibold text-neutral-900">
                        {primarySlicer.ozellikAdi}
                    </p>
                ) : null}
                <Select
                    value={selected.urunId}
                    onValueChange={(urunId) => {
                        const opt = primarySlicer.options.find((o) => o.urunId === urunId);
                        if (opt) {
                            router.push(
                                productPublicHref(opt.publicSlug, undefined, { listingQuery }),
                            );
                        }
                    }}
                >
                    <SelectTrigger size={compact ? 'sm' : 'default'} className="w-full bg-white h-10!">
                        <SelectValue placeholder={primarySlicer.ozellikAdi} />
                    </SelectTrigger>
                    <SelectContent
                        position="popper"
                        side="bottom"
                        sideOffset={4}
                        className="z-100 isolate"
                    >
                        {primarySlicer.options.map((opt) => (
                            <SelectItem key={opt.urunId} value={opt.urunId}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        );
    }

    return null;
}
