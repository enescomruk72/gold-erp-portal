import Link from 'next/link';
import { StorefrontContainer } from '@/components/layout/storefront/storefront-container';
import { ChevronRight } from 'lucide-react';
import type { IProductDTO } from '@/features/products/types';
import { StorefrontProductCard } from '@/features/products/components/storefront-product-card';
import { cn } from '@/lib/utils';

type ProductRailSectionProps = {
    title: string;
    seeAllHref?: string;
    products: IProductDTO[];
    isLoading?: boolean;
    skeletonCount?: number;
};

function ProductRailSkeleton({ count }: { count: number }) {
    return (
        <>
            {Array.from({ length: count }, (_, i) => (
                <div
                    key={i}
                    className="w-80 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-white lg:w-96"
                >
                    <div className="aspect-square animate-pulse bg-neutral-100" />
                    <div className="space-y-2 p-base">
                        <div className="h-4 animate-pulse rounded bg-neutral-100" />
                        <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-100" />
                        <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-100" />
                    </div>
                </div>
            ))}
        </>
    );
}

export function ProductRailSection({
    title,
    seeAllHref = '/products',
    products,
    isLoading = false,
    skeletonCount = 6,
}: ProductRailSectionProps) {
    return (
        <section className="py-6">
            <StorefrontContainer variant="content">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
                    <Link
                        href={seeAllHref}
                        className="inline-flex items-center gap-0.5 text-sm font-medium text-primary hover:underline"
                    >
                        Tümünü Gör
                        <ChevronRight className="size-4" />
                    </Link>
                </div>

                <div
                    className={cn(
                        'flex gap-3 overflow-x-auto pb-2 scrollbar-none sm:gap-4',
                        isLoading && 'min-h-[280px]'
                    )}
                >
                    {isLoading ? (
                        <ProductRailSkeleton count={skeletonCount} />
                    ) : (
                        products.map((product) => (
                            <div
                                key={product.id}
                                className="w-80 shrink-0 lg:w-96"
                            >
                                <StorefrontProductCard
                                    product={product}
                                    linkTarget="_self"
                                />
                            </div>
                        ))
                    )}
                </div>
            </StorefrontContainer>
        </section>
    );
}
