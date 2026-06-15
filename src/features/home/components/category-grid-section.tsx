'use client';

import Link from 'next/link';
import { ChevronRight, Loader2 } from 'lucide-react';
import { StorefrontContainer } from '@/components/layout/storefront/storefront-container';
import { getCategoryMockImageUrl } from '@/constants/storefront/mock-category-images';
import { useGetCategoryNavigation } from '@/features/catalog-navigation';
import { categoryListHref } from '@/features/catalog-navigation/lib/category-nav-href';

type CategoryGridSectionProps = {
    title?: string;
};

export function CategoryGridSection({ title = 'Kategoriler' }: CategoryGridSectionProps) {
    const { parents, isLoading, isError } = useGetCategoryNavigation();

    return (
        <section className="py-6">
            <StorefrontContainer variant="content">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-0.5 text-sm font-medium text-primary hover:underline"
                    >
                        Tümünü Gör
                        <ChevronRight className="size-4" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="size-7 animate-spin text-muted-foreground" />
                    </div>
                ) : isError || parents.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                        Kategoriler yüklenemedi.
                    </p>
                ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        {parents.map((category, index) => (
                            <Link
                                key={category.id}
                                href={categoryListHref(category.id)}
                                className="group overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
                            >
                                <div className="relative aspect-square overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={getCategoryMockImageUrl(index)}
                                        alt={category.kategoriAdi}
                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                                    <span className="absolute bottom-3 left-3 right-3 line-clamp-2 text-sm font-medium text-white drop-shadow-sm">
                                        {category.kategoriAdi}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </StorefrontContainer>
        </section>
    );
}
