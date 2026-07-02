'use client';

import { Heart } from 'lucide-react';
import { useFavorites } from '@/features/favorites';
import { StorefrontNavAction } from './storefront-nav-action';

type StorefrontFavoritesNavProps = {
    variant?: 'default' | 'icon';
};

export function StorefrontFavoritesNav({ variant = 'default' }: StorefrontFavoritesNavProps) {
    const { items, hasFavoriteAccess } = useFavorites();

    if (!hasFavoriteAccess) return null;

    return (
        <StorefrontNavAction
            href="/favorites"
            label="Favorilerim"
            icon={<Heart className="size-5" aria-hidden />}
            badge={items.length}
            variant={variant}
        />
    );
}
