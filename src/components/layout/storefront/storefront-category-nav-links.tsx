'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { categoryListHref, type CategoryNavParent } from '@/features/catalog-navigation';
import { cn } from '@/lib/utils';

type StorefrontCategoryNavLinksProps = {
    parents: CategoryNavParent[];
    isLoading?: boolean;
};

function useProductsKategoriId(): number | null {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    if (!pathname.startsWith('/products')) return null;
    const raw = searchParams.get('cid');
    if (raw == null || raw === '') return null;
    const id = Number.parseInt(raw, 10);
    return Number.isFinite(id) && id > 0 ? id : null;
}

function isParentCategoryActive(parent: CategoryNavParent, kategoriId: number | null): boolean {
    if (kategoriId == null) return false;
    if (parent.id === kategoriId) return true;
    return parent.children.some((child) => child.id === kategoriId);
}

type CategoryNavLinkProps = {
    parent: CategoryNavParent;
    isActive: boolean;
};

function CategoryNavLink({ parent, isActive }: CategoryNavLinkProps) {
    return (
        <Link
            href={categoryListHref(parent.id)}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
                'relative inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-md px-3 text-sm font-semibold transition-colors hover:bg-accent',
                isActive
                    ? 'text-[#0769e9] after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-[#0769e9]'
                    : 'text-foreground/90 hover:text-[#0769e9]'
            )}
        >
            {parent.kategoriAdi}
        </Link>
    );
}

export function StorefrontCategoryNavLinks({
    parents,
    isLoading,
}: StorefrontCategoryNavLinksProps) {
    const selectedKategoriId = useProductsKategoriId();

    if (isLoading) {
        return (
            <div className="flex items-center gap-3">
                {Array.from({ length: 12 }).map((_, index) => (
                    <span
                        key={index}
                        className="inline-block h-4 w-16 animate-pulse rounded bg-muted"
                    />
                ))}
            </div>
        );
    }

    return (
        <>
            {parents.map((parent) => (
                <CategoryNavLink
                    key={parent.id}
                    parent={parent}
                    isActive={isParentCategoryActive(parent, selectedKategoriId)}
                />
            ))}
        </>
    );
}
