'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bookmark, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { portalPrimaryTextClass } from '@/constants/storefront/brand';

type FavoritesCollectionsTabNavProps = {
    activeTab: 'favorites' | 'collections';
    favoritesCount?: number;
    collectionsCount?: number;
    showCollections?: boolean;
    /** lg+ ekranda tab satırının sağında gösterilir (ör. arama) */
    desktopTrailing?: React.ReactNode;
};

export function FavoritesCollectionsTabNav({
    activeTab,
    favoritesCount,
    collectionsCount = 0,
    showCollections = true,
    desktopTrailing,
}: FavoritesCollectionsTabNavProps) {
    const router = useRouter();

    return (
        <div className="border-b border-border">
            <div className="flex items-center gap-2 px-2 lg:gap-6 lg:px-0">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="inline-flex size-10 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-accent lg:hidden"
                    aria-label="Geri"
                >
                    <ArrowLeft className="size-5" aria-hidden />
                </button>

                <div className="flex min-w-0 flex-1 items-center justify-center gap-6 lg:justify-start">
                    <Link
                        href="/favorites"
                        className={cn(
                            'relative inline-flex items-center gap-2 px-1 py-3 text-sm font-semibold transition-colors',
                            activeTab === 'favorites'
                                ? cn('text-[#0769e9]', portalPrimaryTextClass)
                                : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        <Heart className="size-4" aria-hidden />
                        Favorilerim
                        {favoritesCount != null && favoritesCount > 0 ? (
                            <span className="text-xs font-normal text-muted-foreground">
                                ({favoritesCount})
                            </span>
                        ) : null}
                        {activeTab === 'favorites' && (
                            <span
                                className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#0769e9]"
                                aria-hidden
                            />
                        )}
                    </Link>

                    {showCollections ? (
                        <Link
                            href="/collections"
                            className={cn(
                                'relative inline-flex items-center gap-2 px-1 py-3 text-sm font-semibold transition-colors',
                                activeTab === 'collections'
                                    ? cn('text-[#0769e9]', portalPrimaryTextClass)
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            <Bookmark className="size-4" aria-hidden />
                            Koleksiyonlarım
                            {collectionsCount > 0 ? (
                                <span className="text-xs font-normal text-muted-foreground">
                                    ({collectionsCount})
                                </span>
                            ) : null}
                            {activeTab === 'collections' && (
                                <span
                                    className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#0769e9]"
                                    aria-hidden
                                />
                            )}
                        </Link>
                    ) : null}
                </div>

                {desktopTrailing ? (
                    <div className="hidden min-w-0 flex-1 justify-end lg:flex">{desktopTrailing}</div>
                ) : (
                    <div className="size-10 shrink-0 lg:hidden" aria-hidden />
                )}
            </div>
        </div>
    );
}
