'use client';

import * as React from 'react';
import type { User } from 'next-auth';
import { usePathname } from 'next/navigation';
import { AuthTopBar } from '@/components/layout/auth/auth-top-bar';
import { isFavoritesOrCollectionsPath } from '@/constants/storefront/header-routes';
import { STOREFRONT_HEADER_CONTAINER_CLASS } from '@/constants/storefront/layout';
import { StorefrontMainNav } from './storefront-main-nav';
import { StorefrontBottomNav } from './storefront-bottom-nav';
import { useBottomNavScroll } from './use-bottom-nav-scroll';
import { useStorefrontHeaderPin } from './use-storefront-header-pin';
import { cn } from '@/lib/utils';

type StorefrontHeaderProps = {
    user?: User | null;
};

export function StorefrontHeader({ user }: StorefrontHeaderProps) {
    const pathname = usePathname();
    const isProductsPage = pathname.startsWith('/products');
    const hideCatalogNavMobile = isFavoritesOrCollectionsPath(pathname);
    const pinEnabled = !isProductsPage;
    const bottomNavVisible = useBottomNavScroll(
        !isProductsPage && !hideCatalogNavMobile,
    );
    const { topBarRef, navShellRef, sentinelRef, isPinned, navHeight } =
        useStorefrontHeaderPin(pinEnabled);
    const showPinnedNav = pinEnabled && isPinned;

    React.useEffect(() => {
        if (navHeight <= 0) return;
        const root = document.documentElement;
        root.style.setProperty('--storefront-nav-shell-height', `${navHeight}px`);
        root.style.setProperty(
            '--storefront-sticky-top',
            `calc(${navHeight}px + var(--storefront-sticky-offset))`,
        );
        root.style.setProperty(
            '--storefront-scroll-margin',
            `calc(${navHeight}px + var(--storefront-sticky-offset) + 0.75rem)`,
        );
    }, [navHeight]);

    return (
        <header className="w-full">
            <div ref={topBarRef} className="hidden lg:block">
                <AuthTopBar containerClassName={STOREFRONT_HEADER_CONTAINER_CLASS} />
            </div>

            <div ref={sentinelRef} className="h-px w-full" aria-hidden />

            {showPinnedNav && navHeight > 0 && (
                <div aria-hidden style={{ height: navHeight }} className="w-full" />
            )}

            <div
                ref={navShellRef}
                data-storefront-nav-shell
                className={cn(
                    'z-50 w-full overflow-visible border-b border-border bg-card shadow-sm',
                    showPinnedNav && 'fixed top-0 left-0 right-0'
                )}
            >
                <StorefrontMainNav user={user} hideSearch={hideCatalogNavMobile} />

                {hideCatalogNavMobile ? (
                    <div className="hidden lg:block">
                        <StorefrontBottomNav />
                    </div>
                ) : isProductsPage ? (
                    <StorefrontBottomNav />
                ) : (
                    <div
                        className={cn(
                            'grid transition-[grid-template-rows] duration-500 ease-in-out',
                            bottomNavVisible ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                        )}
                    >
                        <div className="min-h-0">
                            <div
                                className={cn(
                                    'transition-opacity duration-500 ease-in-out',
                                    bottomNavVisible
                                        ? 'opacity-100'
                                        : 'pointer-events-none opacity-0'
                                )}
                            >
                                <StorefrontBottomNav />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
