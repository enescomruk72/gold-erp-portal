'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { User } from 'next-auth';
import { usePathname } from 'next/navigation';
import { useGetCategoryNavigation } from '@/features/catalog-navigation';
import { isFavoritesOrCollectionsPath } from '@/constants/storefront/header-routes';
import { StorefrontContainer } from './storefront-container';
import { StorefrontSearchDialog } from './storefront-search-dialog';
import { StorefrontAccountMenu } from './storefront-account-menu';
import { StorefrontFavoritesNav } from './storefront-favorites-nav';
import { StorefrontCartNav } from './storefront-cart-nav';
import { StorefrontMobileMenuDrawer } from './storefront-mobile-menu-drawer';

type StorefrontMainNavProps = {
    user?: User | null;
    hideSearch?: boolean;
};

export function StorefrontMainNav({ user, hideSearch = false }: StorefrontMainNavProps) {
    const pathname = usePathname();
    const hideSearchOnMobile =
        hideSearch || isFavoritesOrCollectionsPath(pathname);
    const { parents, isLoading } = useGetCategoryNavigation();

    return (
        <div className="bg-card">
            {/* Mobil / tablet: lg ve altı */}
            <StorefrontContainer
                variant="header"
                className="flex h-14 items-center gap-2 lg:hidden"
            >
                <StorefrontMobileMenuDrawer
                    parents={parents}
                    isLoading={isLoading}
                />

                <Link href="/" className="shrink-0">
                    <Image
                        src="/brand-logo.png"
                        alt="Gold ERP"
                        width={100}
                        height={32}
                        className="h-14 w-auto object-contain"
                        priority
                    />
                </Link>

                <div className="ml-auto flex items-center">
                    <StorefrontAccountMenu user={user} variant="icon" />
                    <StorefrontFavoritesNav variant="icon" />
                    <StorefrontCartNav variant="icon" />
                </div>
            </StorefrontContainer>

            {!hideSearchOnMobile && (
                <StorefrontContainer variant="header" className="pb-3 pt-1 lg:hidden">
                    <StorefrontSearchDialog variant="compact" />
                </StorefrontContainer>
            )}

            {/* Masaüstü: lg ve üstü */}
            <StorefrontContainer
                variant="header"
                className="hidden h-16 items-center gap-4 sm:gap-6 lg:flex"
            >
                <Link href="/" className="shrink-0">
                    <Image
                        src="/brand-logo.png"
                        alt="Gold ERP"
                        width={120}
                        height={40}
                        className="h-18 w-auto object-contain"
                        priority
                    />
                </Link>

                <div className="flex min-w-0 flex-1 justify-center">
                    <StorefrontSearchDialog className="w-full" />
                </div>

                <div className="ml-auto flex items-center gap-1 sm:gap-2">
                    <StorefrontAccountMenu user={user} />
                    <StorefrontFavoritesNav />
                    <StorefrontCartNav />
                </div>
            </StorefrontContainer>
        </div>
    );
}
