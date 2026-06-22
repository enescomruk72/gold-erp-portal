'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { StorefrontContainer } from '@/components/layout/storefront/storefront-container';
import { Button } from '@/components/ui/button';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { categoryListHref } from '@/features/catalog-navigation';
import { useGetCategoryNavigation } from '@/features/catalog-navigation';
import { useGetProductBySlug } from '@/features/products/api/use-get-product-by-slug';
import { pickListingQueryString } from '@/features/products/lib/listing-search-params';
import { VARIANT_QUERY_PARAM } from '@/features/products/lib/product-slug';
import {
    buildIdentifierOzellikMap,
    getIdentifierOzellikIdsForProduct,
} from '@/features/products/lib/identifier-ozellik-map';
import {
    PRODUCT_DETAIL_SECTIONS,
    PDP_STICKY_STACK_HEIGHT_PX,
    type ProductDetailSectionId,
} from '@/features/products/lib/product-detail-sections';
import { useProductDetailSticky } from '@/features/products/hooks/use-product-detail-sticky';
import {
    useProductDetailSectionSpy,
    useVisibleProductDetailSections,
} from '@/features/products/hooks/use-product-detail-section-spy';
import { ProductDetailGallery } from './ProductDetailGallery';
import { ProductDetailInfo } from './ProductDetailInfo';
import { ProductSimilarProducts } from './ProductSimilarProducts';
import { ProductDetailInformation } from './ProductDetailInformation';
import { ProductDetailReviews } from './ProductDetailReviews';
import { ProductDetailQuestions } from './ProductDetailQuestions';
import { ProductDetailStickyStack } from './ProductDetailStickyStack';
import { ProductAddToCartModal } from '@/features/cart';
import {
    getSelectedVariantSelections,
    getUnitAverageWeightGr,
} from '@/features/products/lib/product-detail-variant-summary';
import type { ProductDetailDTO } from '@/features/products/types/product-detail.types';

function ProductDetailBreadcrumb({
    detail,
    productsHref,
}: {
    detail: ProductDetailDTO;
    productsHref: string;
}) {
    const crumbs = detail.breadcrumb;

    return (
        <Breadcrumb className="mb-base text-xs text-neutral-500">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/">Ana Sayfa</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href={productsHref}>Ürünler</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {crumbs.map((crumb, index) => {
                    const isLast = index === crumbs.length - 1;
                    return (
                        <span key={crumb.id} className="contents">
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage className="font-medium text-neutral-800">
                                        {crumb.kategoriAdi}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={categoryListHref(crumb.id)}>
                                            {crumb.kategoriAdi}
                                        </Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </span>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

export function ProductDetailPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = typeof params.slug === 'string' ? decodeURIComponent(params.slug) : '';
    const vParam = searchParams.get(VARIANT_QUERY_PARAM);
    const listingQuery = useMemo(() => pickListingQueryString(searchParams), [searchParams]);
    const productsHref = useMemo(
        () => (listingQuery ? `/products?${listingQuery}` : '/products'),
        [listingQuery],
    );
    const purchaseSectionRef = useRef<HTMLDivElement>(null);
    const [addToCartOpen, setAddToCartOpen] = useState(false);
    const openAddToCart = useCallback(() => {
        queueMicrotask(() => setAddToCartOpen(true));
    }, []);

    const { parents } = useGetCategoryNavigation();
    const { data: response, isLoading, isError, refetch } = useGetProductBySlug(slug, vParam);

    const detail = useMemo(() => response?.data ?? null, [response?.data]);

    const identifierOzellikIds = useMemo(() => {
        if (!detail) return [];
        const map = buildIdentifierOzellikMap(parents, null, null);
        return getIdentifierOzellikIdsForProduct(detail.product.kategoriId, map);
    }, [detail, parents]);

    const mockSeed = detail?.product.publicSlug ?? detail?.product.id ?? slug;

    const addToCartVariantSelections = useMemo(
        () => (detail ? getSelectedVariantSelections(detail, vParam) : []),
        [detail, vParam]
    );

    const addToCartUnitWeightGr = useMemo(
        () => (detail ? getUnitAverageWeightGr(detail, vParam) : undefined),
        [detail, vParam]
    );

    const sectionIds = useMemo((): ProductDetailSectionId[] => {
        const ids: ProductDetailSectionId[] = ['pdp-info', 'pdp-reviews', 'pdp-questions'];
        if ((detail?.similarProducts.length ?? 0) > 0) {
            ids.unshift('pdp-similar');
        }
        return ids;
    }, [detail?.similarProducts.length]);

    const stickyVisible = useProductDetailSticky(purchaseSectionRef, detail != null);

    const visibleSectionIds = useVisibleProductDetailSections(sectionIds);

    const navSections = useMemo(
        () =>
            PRODUCT_DETAIL_SECTIONS.filter((s) => visibleSectionIds.includes(s.id)),
        [visibleSectionIds]
    );

    const { activeId, scrollToSection } = useProductDetailSectionSpy({
        sectionIds: visibleSectionIds,
        stickyStackHeight: stickyVisible ? PDP_STICKY_STACK_HEIGHT_PX : 0,
        enabled: detail != null,
    });

    if (!slug) {
        return (
            <StorefrontContainer variant="content" className="bg-white py-10">
                <p className="text-sm text-neutral-500">Geçersiz ürün adresi.</p>
            </StorefrontContainer>
        );
    }

    if (isLoading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center bg-white">
                <Loader2 className="size-8 animate-spin text-neutral-400" />
            </div>
        );
    }

    if (isError || !detail) {
        return (
            <StorefrontContainer variant="content" className="bg-white py-10">
                <p className="text-sm text-neutral-600">Ürün bulunamadı.</p>
                <Button variant="outline" className="mt-4" asChild>
                    <Link href={productsHref}>Ürünlere dön</Link>
                </Button>
                <Button variant="ghost" className="mt-2" onClick={() => refetch()}>
                    Tekrar dene
                </Button>
            </StorefrontContainer>
        );
    }

    return (
        <div className="w-full bg-white">
            <ProductAddToCartModal
                product={detail.product}
                variantSelections={addToCartVariantSelections}
                varyantId={detail.selectedVariantId}
                unitAverageWeightGr={addToCartUnitWeightGr}
                open={addToCartOpen}
                onOpenChange={setAddToCartOpen}
            />

            <ProductDetailStickyStack
                detail={detail}
                slug={slug}
                vParam={vParam}
                listingQuery={listingQuery}
                visible={stickyVisible}
                sections={navSections}
                activeSectionId={activeId}
                onSectionClick={scrollToSection}
                onAddToCart={openAddToCart}
            />

            <StorefrontContainer variant="content" className="bg-white py-base md:py-gutter">
                <ProductDetailBreadcrumb detail={detail} productsHref={productsHref} />

                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-10">
                    <div className="min-w-0">
                        <ProductDetailGallery
                            images={detail.product.images}
                            productName={detail.product.urunAdi}
                        />
                    </div>
                    <div className="min-w-0">
                        <ProductDetailInfo
                            detail={detail}
                            slug={slug}
                            vParam={vParam}
                            listingQuery={listingQuery}
                            identifierOzellikIds={identifierOzellikIds}
                            purchaseSectionRef={purchaseSectionRef}
                            onAddToCart={openAddToCart}
                        />
                    </div>
                </div>

                <ProductSimilarProducts
                    products={detail.similarProducts}
                    navigationParents={parents}
                    listingQuery={listingQuery}
                />

                <ProductDetailInformation detail={detail} />
                <ProductDetailReviews seedKey={mockSeed} />
                <ProductDetailQuestions seedKey={mockSeed} />
            </StorefrontContainer>
        </div>
    );
}
