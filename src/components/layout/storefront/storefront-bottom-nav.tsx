'use client';

import { useGetCategoryNavigation } from '@/features/catalog-navigation';
import { StorefrontContainer } from './storefront-container';
import { StorefrontCategoryMegaMenu } from './storefront-category-mega-menu';
import { StorefrontCategoryNavLinks } from './storefront-category-nav-links';

export function StorefrontBottomNav() {
    const { parents, isLoading, isError } = useGetCategoryNavigation();

    return (
        <nav
            aria-label="Kategori navigasyonu"
            className="relative overflow-visible border-b border-border bg-card"
        >
            <StorefrontContainer
                variant="header"
                className="flex items-stretch gap-1"
            >
                <div className="relative z-60 shrink-0">
                    <StorefrontCategoryMegaMenu
                        parents={parents}
                        isLoading={isLoading}
                    />
                </div>

                <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto scrollbar-none">
                    <StorefrontCategoryNavLinks
                        parents={parents}
                        isLoading={isLoading && !isError}
                    />

                    {isError && (
                        <span className="px-3 text-xs text-muted-foreground">
                            Kategoriler yüklenemedi
                        </span>
                    )}
                </div>
            </StorefrontContainer>
        </nav>
    );
}
