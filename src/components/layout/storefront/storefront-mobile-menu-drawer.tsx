'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AppStoreBadges } from '@/components/layout/storefront/app-store-badges';
import {
    ChevronRight,
    Headphones,
    Info,
    LayoutGrid,
    Menu,
    MessageCircle,
    User,
    ClipboardList,
    X,
} from 'lucide-react';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
    categoryIdentifierHref,
    categoryListHref,
    type CategoryNavChild,
    type CategoryNavIdentifier,
    type CategoryNavParent,
} from '@/features/catalog-navigation';

type AttributeGridItem = {
    key: string;
    label: string;
    href: string;
};

type StorefrontMobileMenuDrawerProps = {
    parents: CategoryNavParent[];
    isLoading?: boolean;
};

const drawerLinks = [
    { label: 'Hesabım', href: '/account', icon: User },
    { label: 'Hakkımızda', href: '/hakkimizda', icon: Info },
    { label: 'B2B Başvuru Yap', href: '/b2b-basvuru', icon: ClipboardList },
    { label: 'Yardım & Destek', href: '/yardim', icon: Headphones },
    { label: 'İletişim', href: '/iletisim', icon: MessageCircle },
] as const;

function flattenIdentifierValues(
    identifiers: CategoryNavIdentifier[],
    kategoriId: number
): AttributeGridItem[] {
    return identifiers.flatMap((identifier) =>
        identifier.degerler.map((deger) => ({
            key: `${identifier.ozellikId}-${deger.id}`,
            label: deger.deger,
            href: categoryIdentifierHref(kategoriId, identifier.ozellikId, deger.id),
        }))
    );
}

export function StorefrontMobileMenuDrawer({
    parents,
    isLoading,
}: StorefrontMobileMenuDrawerProps) {
    const [open, setOpen] = React.useState(false);
    const [activeParentId, setActiveParentId] = React.useState<number | null>(null);
    const [activeChildId, setActiveChildId] = React.useState<number | null>(null);

    React.useEffect(() => {
        if (parents.length === 0) return;
        setActiveParentId((current) => current ?? parents[0].id);
    }, [parents]);

    const activeParent =
        parents.find((parent) => parent.id === activeParentId) ?? parents[0] ?? null;

    const hasChildren = (activeParent?.children.length ?? 0) > 0;

    React.useEffect(() => {
        if (!activeParent) return;

        if (activeParent.children.length > 0) {
            const childStillValid = activeParent.children.some(
                (child) => child.id === activeChildId
            );
            if (!childStillValid) {
                setActiveChildId(activeParent.children[0].id);
            }
        } else {
            setActiveChildId(null);
        }
    }, [activeParent, activeChildId]);

    const activeChild: CategoryNavChild | null =
        activeParent?.children.find((child) => child.id === activeChildId) ??
        activeParent?.children[0] ??
        null;

    const contentKategoriId = hasChildren ? activeChild?.id : activeParent?.id;
    const contentIdentifiers = hasChildren
        ? activeChild?.identifiers ?? []
        : activeParent?.identifiers ?? [];
    const contentKategoriAdi = hasChildren
        ? activeChild?.kategoriAdi
        : activeParent?.kategoriAdi;

    const attributeItems = contentKategoriId
        ? flattenIdentifierValues(contentIdentifiers, contentKategoriId)
        : [];

    const handleNavigate = () => setOpen(false);

    const handleParentSelect = (parentId: number) => {
        setActiveParentId(parentId);
        const parent = parents.find((item) => item.id === parentId);
        if (parent && parent.children.length > 0) {
            setActiveChildId(parent.children[0].id);
        } else {
            setActiveChildId(null);
        }
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
                aria-label="Kategoriler"
                className={cn(
                    'inline-flex size-10 shrink-0 items-center justify-center rounded-md border-0 bg-transparent p-0 shadow-none',
                    'hover:bg-accent focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]'
                )}
            >
                <Menu className="size-5" aria-hidden />
            </SheetTrigger>

            <SheetContent
                side="left"
                showCloseButton={false}
                className="flex w-full max-w-none flex-col gap-0 p-0 sm:max-w-md"
            >
                <SheetTitle className="sr-only">Kategori menüsü</SheetTitle>

                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
                    <Link href="/" onClick={handleNavigate}>
                        <Image
                            src="/brand-logo.png"
                            alt="Akben"
                            width={100}
                            height={32}
                            className="h-14 w-auto object-contain"
                        />
                    </Link>
                    <SheetClose
                        className="inline-flex size-10 items-center justify-center rounded-md transition-colors hover:bg-accent"
                        aria-label="Menüyü kapat"
                    >
                        <X className="size-5" aria-hidden />
                    </SheetClose>
                </div>

                {/* Üst kategori şeridi */}
                <div className="shrink-0 border-b border-border">
                    {isLoading ? (
                        <div className="flex gap-4 overflow-x-auto px-4 py-3">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <span
                                    key={index}
                                    className="inline-block h-4 w-20 shrink-0 animate-pulse rounded bg-muted"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex overflow-x-auto scrollbar-none px-2">
                            {parents.map((parent) => {
                                const isActive = parent.id === activeParentId;
                                return (
                                    <button
                                        key={parent.id}
                                        type="button"
                                        onClick={() => handleParentSelect(parent.id)}
                                        className={cn(
                                            'relative shrink-0 px-3 py-3 text-xs font-semibold uppercase tracking-wide transition-colors',
                                            isActive
                                                ? 'text-[#0769e9]'
                                                : 'text-muted-foreground hover:text-foreground'
                                        )}
                                    >
                                        {parent.kategoriAdi}
                                        {isActive && (
                                            <span
                                                className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[#0769e9]"
                                                aria-hidden
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Ana içerik */}
                <div className="flex min-h-0 flex-1">
                    {isLoading ? (
                        <DrawerContentSkeleton />
                    ) : activeParent ? (
                        <>
                            <aside className="w-[108px] shrink-0 overflow-y-auto border-r border-border bg-muted/30">
                                {hasChildren ? (
                                    activeParent.children.map((child) => {
                                        const isActive = child.id === activeChildId;
                                        return (
                                            <button
                                                key={child.id}
                                                type="button"
                                                onClick={() => setActiveChildId(child.id)}
                                                className={cn(
                                                    'w-full px-3 py-3.5 text-left text-xs leading-snug transition-colors',
                                                    isActive
                                                        ? 'bg-card font-semibold text-[#0769e9]'
                                                        : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
                                                )}
                                            >
                                                {child.kategoriAdi}
                                            </button>
                                        );
                                    })
                                ) : (
                                    <div
                                        className="w-full px-3 py-3.5 text-left text-xs font-semibold leading-snug text-[#0769e9] bg-card"
                                    >
                                        {activeParent.kategoriAdi}
                                    </div>
                                )}
                            </aside>

                            <div className="min-w-0 flex-1 overflow-y-auto p-3">
                                {hasChildren && contentKategoriAdi && (
                                    <p className="mb-3 px-1 text-sm font-bold text-[#0769e9]">
                                        {contentKategoriAdi}
                                    </p>
                                )}

                                {attributeItems.length > 0 ? (
                                    <AttributeGrid
                                        items={attributeItems}
                                        kategoriId={contentKategoriId!}
                                        onNavigate={handleNavigate}
                                    />
                                ) : contentKategoriId ? (
                                    <Link
                                        href={categoryListHref(contentKategoriId)}
                                        onClick={handleNavigate}
                                        className="inline-flex items-center gap-1 px-1 text-sm font-medium text-[#0769e9] hover:underline"
                                    >
                                        Tüm ürünleri görüntüle
                                        <ChevronRight className="size-3.5" aria-hidden />
                                    </Link>
                                ) : null}
                            </div>
                        </>
                    ) : (
                        <p className="p-6 text-sm text-muted-foreground">Kategori bulunamadı.</p>
                    )}
                </div>

                {/* Alt linkler */}
                <div className="shrink-0 border-t border-border">
                    {drawerLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={handleNavigate}
                            className="flex items-center gap-3 border-b border-border px-4 py-3.5 text-sm transition-colors hover:bg-accent/50"
                        >
                            <link.icon className="size-5 shrink-0 text-muted-foreground" aria-hidden />
                            <span className="flex-1">{link.label}</span>
                            <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                        </Link>
                    ))}
                </div>

                {/* Uygulama indirme */}
                <div className="shrink-0 border-t border-border bg-muted/40 px-4 py-4">
                    <p className="mb-3 text-center text-sm font-semibold text-foreground">
                        Daha iyi bir deneyim için uygulamamızı indirin!
                    </p>
                    <AppStoreBadges className="justify-center" />
                </div>
            </SheetContent>
        </Sheet>
    );
}

function AttributeGrid({
    items,
    kategoriId,
    onNavigate,
}: {
    items: AttributeGridItem[];
    kategoriId: number;
    onNavigate: () => void;
}) {
    return (
        <div className="grid grid-cols-3 gap-2">
            {items.map((item) => (
                <Link
                    key={item.key}
                    href={item.href}
                    onClick={onNavigate}
                    className="flex flex-col items-center gap-2 rounded-lg p-2 text-center transition-colors hover:bg-accent/50"
                >
                    <div className="flex size-[72px] items-center justify-center rounded-xl border border-border bg-muted/40">
                        <LayoutGrid className="size-7 text-muted-foreground/40" aria-hidden />
                    </div>
                    <span className="line-clamp-2 text-[11px] leading-snug text-foreground">
                        {item.label}
                    </span>
                </Link>
            ))}

            <Link
                href={categoryListHref(kategoriId)}
                onClick={onNavigate}
                className="flex flex-col items-center gap-2 rounded-lg p-2 text-center transition-colors hover:bg-accent/50"
            >
                <div className="flex size-[72px] items-center justify-center rounded-xl border border-border bg-muted/40">
                    <LayoutGrid className="size-7 text-muted-foreground/40" aria-hidden />
                </div>
                <span className="line-clamp-2 text-[11px] font-medium leading-snug text-foreground">
                    Tüm Ürünler
                </span>
            </Link>
        </div>
    );
}

function DrawerContentSkeleton() {
    return (
        <div className="flex flex-1 animate-pulse">
            <div className="w-[108px] shrink-0 space-y-2 border-r border-border bg-muted/30 p-2">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="h-8 rounded bg-muted" />
                ))}
            </div>
            <div className="grid flex-1 grid-cols-3 gap-2 p-3">
                {Array.from({ length: 9 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                        <div className="mx-auto size-[72px] rounded-xl bg-muted" />
                        <div className="mx-auto h-3 w-12 rounded bg-muted" />
                    </div>
                ))}
            </div>
        </div>
    );
}
