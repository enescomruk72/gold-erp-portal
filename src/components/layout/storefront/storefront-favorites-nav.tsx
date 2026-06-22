'use client';

import { Heart } from 'lucide-react';
import { useFavorites } from '@/features/favorites';
import { StorefrontNavAction } from './storefront-nav-action';

export function StorefrontFavoritesNav() {
    const { items, hasFavoriteAccess } = useFavorites();

    if (!hasFavoriteAccess) return null;

    return (
        <StorefrontNavAction
            href="/favorites"
            label="Favorilerim"
            icon={<Heart className="size-5" aria-hidden />}
            badge={items.length}
        />
    );
}
