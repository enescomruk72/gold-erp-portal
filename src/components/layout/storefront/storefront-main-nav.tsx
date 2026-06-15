'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import type { User } from 'next-auth';
import { StorefrontContainer } from './storefront-container';
import { StorefrontSearchDialog } from './storefront-search-dialog';
import { StorefrontAccountMenu } from './storefront-account-menu';
import { StorefrontNavAction } from './storefront-nav-action';
import { StorefrontCartNav } from './storefront-cart-nav';

type StorefrontMainNavProps = {
    user?: User | null;
};

export function StorefrontMainNav({ user }: StorefrontMainNavProps) {
    return (
        <div className="bg-card">
            <StorefrontContainer
                variant="header"
                className="flex h-16 items-center gap-4 sm:gap-6"
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

                <div className="hidden min-w-0 flex-1 md:flex md:justify-center">
                    <StorefrontSearchDialog className="w-full" />
                </div>

                <div className="ml-auto flex items-center gap-1 sm:gap-2">
                    <StorefrontAccountMenu user={user} />
                    <StorefrontNavAction
                        href="/favorites"
                        label="Favorilerim"
                        icon={<Heart className="size-5" />}
                    />
                    <StorefrontCartNav />
                </div>
            </StorefrontContainer>

            <StorefrontContainer variant="header" className="border-t border-border pb-3 pt-2 md:hidden">
                <StorefrontSearchDialog />
            </StorefrontContainer>
        </div>
    );
}
