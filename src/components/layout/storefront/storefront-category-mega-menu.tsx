'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Menu } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
    categoryIdentifierHref,
    categoryListHref,
    splitIntoColumns,
    type CategoryNavChild,
    type CategoryNavIdentifier,
    type CategoryNavParent,
} from '@/features/catalog-navigation';

const COLUMN_COUNT = 3;
const PREVIEW_LINK_LIMIT = 8;

type StorefrontCategoryMegaMenuProps = {
    parents: CategoryNavParent[];
    isLoading?: boolean;
    variant?: 'default' | 'icon';
};

export function StorefrontCategoryMegaMenu({
    parents,
    isLoading,
    variant = 'default',
}: StorefrontCategoryMegaMenuProps) {
    const [open, setOpen] = React.useState(false);
    const [activeParentId, setActiveParentId] = React.useState<number | null>(null);

    React.useEffect(() => {
        if (parents.length > 0) {
            setActiveParentId((current) => current ?? parents[0].id);
        }
    }, [parents]);

    const activeParent =
        parents.find((parent) => parent.id === activeParentId) ?? parents[0] ?? null;

    return (
        <Popover open={open} onOpenChange={setOpen} modal={false}>
            <PopoverTrigger
                aria-label={variant === 'icon' ? 'Kategoriler' : undefined}
                className={cn(
                    'border-0 bg-transparent shadow-none',
                    'hover:bg-accent data-[state=open]:bg-[#0769e9]/5 data-[state=open]:text-[#0769e9]',
                    'focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px] rounded-md',
                    variant === 'icon'
                        ? 'inline-flex size-10 shrink-0 items-center justify-center p-0'
                        : 'inline-flex h-9 items-center gap-1.5 rounded-none px-3 text-sm font-semibold'
                )}
            >
                <Menu className={variant === 'icon' ? 'size-5' : 'size-4'} aria-hidden />
                {variant !== 'icon' && 'Kategoriler'}
            </PopoverTrigger>

            <PopoverContent
                align="start"
                side="bottom"
                sideOffset={0}
                collisionPadding={8}
                onOpenAutoFocus={(event) => event.preventDefault()}
                className={cn(
                    'z-250 w-[min(100vw-1rem,1440px)] max-w-none rounded-none border p-0 shadow-lg',
                    'data-[state=open]:animate-in data-[state=closed]:animate-out',
                    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
                )}
            >
                {isLoading ? (
                    <MegaMenuSkeleton />
                ) : activeParent ? (
                    <div className="flex max-h-[min(70vh,520px)] bg-card">
                        <MegaMenuSidebar
                            parents={parents}
                            activeParentId={activeParent.id}
                            onSelect={setActiveParentId}
                        />
                        <MegaMenuPanel parent={activeParent} onNavigate={() => setOpen(false)} />
                    </div>
                ) : (
                    <p className="p-6 text-sm text-muted-foreground">Kategori bulunamadı.</p>
                )}
            </PopoverContent>
        </Popover>
    );
}

function MegaMenuSidebar({
    parents,
    activeParentId,
    onSelect,
}: {
    parents: CategoryNavParent[];
    activeParentId: number;
    onSelect: (id: number) => void;
}) {
    return (
        <aside className="w-56 shrink-0 overflow-y-auto border-r border-border bg-muted/20 py-2">
            {parents.map((parent) => {
                const isActive = parent.id === activeParentId;
                return (
                    <button
                        key={parent.id}
                        type="button"
                        onMouseEnter={() => onSelect(parent.id)}
                        onFocus={() => onSelect(parent.id)}
                        className={cn(
                            'flex w-full cursor-pointer items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none',
                            isActive
                                ? 'border-r-2 border-[#0769e9] bg-card font-semibold text-[#0769e9]'
                                : 'text-foreground/90'
                        )}
                    >
                        <span className="truncate">{parent.kategoriAdi}</span>
                        <ChevronRight
                            className={cn(
                                'size-4 shrink-0',
                                isActive ? 'text-[#0769e9]' : 'text-muted-foreground/70'
                            )}
                            aria-hidden
                        />
                    </button>
                );
            })}
        </aside>
    );
}

function MegaMenuPanel({
    parent,
    onNavigate,
}: {
    parent: CategoryNavParent;
    onNavigate: () => void;
}) {
    const hasChildren = parent.children.length > 0;

    if (!hasChildren) {
        const groups = parent.identifiers.length > 0 ? parent.identifiers : [];

        return (
            <div className="min-w-0 flex-1 overflow-y-auto p-6">
                <MegaMenuParentHeader
                    parentId={parent.id}
                    parentAdi={parent.kategoriAdi}
                    onNavigate={onNavigate}
                />
                {groups.length > 0 ? (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {splitIntoColumns(groups, COLUMN_COUNT).map((column, columnIndex) => (
                            <div key={columnIndex} className="space-y-6">
                                {column.map((identifier) => (
                                    <IdentifierGroup
                                        key={identifier.ozellikId}
                                        kategoriId={parent.id}
                                        identifier={identifier}
                                        onNavigate={onNavigate}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        <Link
                            href={categoryListHref(parent.id)}
                            onClick={onNavigate}
                            className="font-medium text-[#0769e9] hover:underline"
                        >
                            {parent.kategoriAdi} ürünlerini görüntüle
                        </Link>
                    </p>
                )}
            </div>
        );
    }

    const columns = splitIntoColumns(parent.children, COLUMN_COUNT);

    return (
        <div className="min-w-0 flex-1 overflow-y-auto p-6">
            <MegaMenuParentHeader
                parentId={parent.id}
                parentAdi={parent.kategoriAdi}
                onNavigate={onNavigate}
            />

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {columns.map((column, columnIndex) => (
                    <div key={columnIndex} className="space-y-6">
                        {column.map((child) => (
                            <ChildCategoryGroup
                                key={child.id}
                                child={child}
                                onNavigate={onNavigate}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

function MegaMenuParentHeader({
    parentId,
    parentAdi,
    onNavigate,
}: {
    parentId: number;
    parentAdi: string;
    onNavigate: () => void;
}) {
    return (
        <Link
            href={categoryListHref(parentId)}
            onClick={onNavigate}
            className="mb-5 inline-flex items-center gap-1 text-sm font-semibold text-[#0769e9] hover:underline"
        >
            Tüm {parentAdi}
            <ChevronRight className="size-3.5" aria-hidden />
        </Link>
    );
}

function ChildCategoryGroup({
    child,
    onNavigate,
}: {
    child: CategoryNavChild;
    onNavigate: () => void;
}) {
    const flatLinks = child.identifiers.flatMap((identifier) =>
        identifier.degerler.map((deger) => ({
            key: `${identifier.ozellikId}-${deger.id}`,
            href: categoryIdentifierHref(child.id, identifier.ozellikId, deger.id),
            label: deger.deger,
        }))
    );

    const previewLinks = flatLinks.slice(0, PREVIEW_LINK_LIMIT);
    const hasMore = flatLinks.length > PREVIEW_LINK_LIMIT;

    return (
        <div className="space-y-2.5">
            <Link
                href={categoryListHref(child.id)}
                onClick={onNavigate}
                className="inline-flex items-center gap-0.5 text-sm font-bold text-[#0769e9] hover:underline"
            >
                {child.kategoriAdi}
                <ChevronRight className="size-3.5" aria-hidden />
            </Link>

            {previewLinks.length > 0 && (
                <ul className="space-y-2">
                    {previewLinks.map((link) => (
                        <li key={link.key}>
                            <Link
                                href={link.href}
                                onClick={onNavigate}
                                className="text-sm text-foreground/85 transition-colors hover:text-[#0769e9] hover:underline"
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            {hasMore && (
                <Link
                    href={categoryListHref(child.id)}
                    onClick={onNavigate}
                    className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-[#0769e9]"
                >
                    Daha Fazla Gör
                    <ChevronDown className="size-3" aria-hidden />
                </Link>
            )}
        </div>
    );
}

function IdentifierGroup({
    kategoriId,
    identifier,
    onNavigate,
}: {
    kategoriId: number;
    identifier: CategoryNavIdentifier;
    onNavigate: () => void;
}) {
    const preview = identifier.degerler.slice(0, PREVIEW_LINK_LIMIT);
    const hasMore = identifier.degerler.length > PREVIEW_LINK_LIMIT;

    return (
        <div className="space-y-2.5">
            <p className="text-sm font-bold text-[#0769e9]">{identifier.ozellikAdi}</p>
            <ul className="space-y-2">
                {preview.map((deger) => (
                    <li key={deger.id}>
                        <Link
                            href={categoryIdentifierHref(
                                kategoriId,
                                identifier.ozellikId,
                                deger.id
                            )}
                            onClick={onNavigate}
                            className="text-sm text-foreground/85 transition-colors hover:text-[#0769e9] hover:underline"
                        >
                            {deger.deger}
                        </Link>
                    </li>
                ))}
            </ul>
            {hasMore && (
                <Link
                    href={categoryListHref(kategoriId)}
                    onClick={onNavigate}
                    className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-[#0769e9]"
                >
                    Daha Fazla Gör
                    <ChevronDown className="size-3" aria-hidden />
                </Link>
            )}
        </div>
    );
}

function MegaMenuSkeleton() {
    return (
        <div className="flex h-[420px] w-full max-w-none animate-pulse bg-card">
            <div className="w-56 border-r border-border bg-muted/30" />
            <div className="grid flex-1 grid-cols-3 gap-6 p-6">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="space-y-3">
                        <div className="h-4 w-24 rounded bg-muted" />
                        <div className="h-3 w-full rounded bg-muted" />
                        <div className="h-3 w-4/5 rounded bg-muted" />
                        <div className="h-3 w-3/5 rounded bg-muted" />
                    </div>
                ))}
            </div>
        </div>
    );
}
