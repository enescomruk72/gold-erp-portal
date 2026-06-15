'use client';

import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { categoryListHref, type CategoryNavParent } from '@/features/catalog-navigation';
import type { ProductFilterGroup, ProductListingFilters } from '@/features/products/api/use-get-product-filters';

type ProductListingSidebarProps = {
    navigationParents: CategoryNavParent[];
    selectedKategoriId: number | null;
    filters: ProductListingFilters | null;
    selectedDegerIds: number[];
    minGram: number | null;
    maxGram: number | null;
    onToggleDeger: (degerId: number) => void;
    onMinGramChange: (value: number | null) => void;
    onMaxGramChange: (value: number | null) => void;
    onClearFilters: () => void;
};

function FilterValueList({
    group,
    selectedDegerIds,
    onToggleDeger,
}: {
    group: ProductFilterGroup;
    selectedDegerIds: number[];
    onToggleDeger: (degerId: number) => void;
}) {
    return (
        <ul>
            {group.degerler.map((deger) => {
                const checked = selectedDegerIds.includes(deger.id);
                const id = `filter-${group.ozellikId}-${deger.id}`;
                return (
                    <li key={deger.id}>
                        <label
                            htmlFor={id}
                            className="flex cursor-pointer items-start gap-2.5 mb-2.5 text-[13px] leading-snug text-neutral-700"
                        >
                            <Checkbox
                                id={id}
                                checked={checked}
                                onCheckedChange={() => onToggleDeger(deger.id)}
                                className="mt-0.5 data-[state=checked]:bg-[#0b57d0] data-[state=checked]:text-white data-[state=checked]:border-[#0b57d0] transition-all"
                            />
                            <span className={cn('select-none ', checked && 'text-[#0b57d0] transition-all')}>
                                {deger.deger}
                            </span>
                        </label>
                    </li>
                );
            })}
        </ul>
    );
}

function SidebarSection({
    value,
    title,
    subtitle,
    children,
    className,
}: {
    value: string;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <AccordionItem
            value={value}
            className={cn("border-t border-border px-0 pb-0! py-1!", className)}
        >
            <AccordionTrigger className="cursor-pointer px-2! py-3! text-[13px] font-semibold text-neutral-900 hover:bg-accent hover:no-underline [&>svg]:text-neutral-500">
                <span className="flex flex-col items-start gap-0.5 text-left">
                    <span>{title}</span>
                    {subtitle ? (
                        <span className="text-[11px] font-normal text-neutral-500">{subtitle}</span>
                    ) : null}
                </span>
            </AccordionTrigger>
            <AccordionContent className="max-h-[min(280px,40dvh)] overflow-y-auto px-1 py-1 text-neutral-700">
                {children}
            </AccordionContent>
        </AccordionItem>
    );
}

type SidebarPanelProps = Omit<ProductListingSidebarProps, never> & {
    defaultOpen: string[];
    kategoriId: number | undefined;
};

function SidebarPanel({
    navigationParents,
    selectedKategoriId,
    filters,
    selectedDegerIds,
    minGram,
    maxGram,
    onToggleDeger,
    onMinGramChange,
    onMaxGramChange,
    onClearFilters,
    defaultOpen,
    kategoriId,
}: SidebarPanelProps) {
    return (
        <>
            <div className="flex shrink-0 items-center justify-between pb-2 px-2">
                <h2 className="text-sm font-semibold text-neutral-900">Filtreler</h2>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-neutral-600 hover:text-neutral-900"
                    onClick={onClearFilters}
                >
                    Temizle
                </Button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-auto px-1 pt-2">
                <Accordion type="multiple" defaultValue={defaultOpen} className="w-full">
                    <SidebarSection value="kategori" title="Kategori" className="border-b!">
                        <nav className="space-y-2">
                            <Link
                                href="/products"
                                className={cn(
                                    'block rounded px-1 py-1 text-[13px] hover:text-[#0769e9]',
                                    selectedKategoriId == null
                                        ? 'font-semibold text-[#0769e9]'
                                        : 'text-neutral-700'
                                )}
                            >
                                Tüm ürünler
                            </Link>
                            {navigationParents.map((parent) => (
                                <div key={parent.id} className="space-y-1">
                                    <Link
                                        href={categoryListHref(parent.id)}
                                        className={cn(
                                            'block rounded px-1 py-1 text-[13px] hover:text-[#0769e9]',
                                            selectedKategoriId === parent.id
                                                ? 'font-semibold text-[#0769e9]'
                                                : 'text-neutral-700'
                                        )}
                                    >
                                        {parent.kategoriAdi}
                                    </Link>
                                    {parent.children.length > 0 ? (
                                        <ul className="ml-2 space-y-0.5 border-l border-neutral-200 pl-2.5">
                                            {parent.children.map((child) => (
                                                <li key={child.id}>
                                                    <Link
                                                        href={categoryListHref(child.id)}
                                                        className={cn(
                                                            'block rounded px-1 py-0.5 text-[12px] hover:text-[#0769e9]',
                                                            selectedKategoriId === child.id
                                                                ? 'font-semibold text-[#0769e9]'
                                                                : 'text-neutral-600'
                                                        )}
                                                    >
                                                        {child.kategoriAdi}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : null}
                                </div>
                            ))}
                        </nav>
                    </SidebarSection>

                    {filters != null && kategoriId != null
                        ? filters.filterGroups.map((group) => (
                            <SidebarSection
                                key={group.ozellikId}
                                value={`ozellik-${group.ozellikId}`}
                                title={group.ozellikAdi}
                                className="border-t-0! border-b!"
                            >
                                <FilterValueList
                                    group={group}
                                    selectedDegerIds={selectedDegerIds}
                                    onToggleDeger={onToggleDeger}
                                />
                            </SidebarSection>
                        ))
                        : null}

                    {filters?.gramRange ? (
                        <SidebarSection value="gramaj" title="Ortalama gramaj" className="border-t-0! border-b!">
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <div className="flex-1 space-y-1">
                                        <Label htmlFor="minGram" className="text-[11px] text-neutral-500">
                                            Min (gr)
                                        </Label>
                                        <Input
                                            id="minGram"
                                            type="number"
                                            min={0}
                                            step={0.1}
                                            placeholder={String(filters.gramRange.min)}
                                            value={minGram ?? ''}
                                            onChange={(e) => {
                                                const v = e.target.value;
                                                onMinGramChange(v === '' ? null : parseFloat(v));
                                            }}
                                            className="h-9 border-neutral-200 bg-white text-sm"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <Label htmlFor="maxGram" className="text-[11px] text-neutral-500">
                                            Max (gr)
                                        </Label>
                                        <Input
                                            id="maxGram"
                                            type="number"
                                            min={0}
                                            step={0.1}
                                            placeholder={String(filters.gramRange.max)}
                                            value={maxGram ?? ''}
                                            onChange={(e) => {
                                                const v = e.target.value;
                                                onMaxGramChange(v === '' ? null : parseFloat(v));
                                            }}
                                            className="h-9 border-neutral-200 bg-white text-sm"
                                        />
                                    </div>
                                </div>
                                <p className="text-[11px] text-neutral-500">
                                    {filters.gramRange.min} – {filters.gramRange.max} gr
                                </p>
                            </div>
                        </SidebarSection>
                    ) : null}
                </Accordion>
            </div>
        </>
    );
}

export function ProductListingSidebar(props: ProductListingSidebarProps) {
    const kategoriId = props.selectedKategoriId ?? props.filters?.kategori.id;

    const defaultOpen = [
        'kategori',
        ...(props.filters?.filterGroups
            .filter((g) => g.kind === 'identifier' || g.kind === 'varianter' || g.kind === 'slicer')
            .map((g) => `ozellik-${g.ozellikId}`) ?? []),
        ...(props.filters?.gramRange ? ['gramaj'] : []),
    ];

    const panelProps: SidebarPanelProps = {
        ...props,
        defaultOpen,
        kategoriId,
    };

    return (
        // Dış kabuk flex satırı boyunca uzanır; içteki panel sticky kalır
        <aside className="w-full shrink-0 lg:w-[180px] xl:w-[240px] lg:min-h-screen">
            <div className="bg-white lg:sticky lg:top-0 lg:flex lg:max-h-dvh lg:flex-col lg:overflow-hidden py-base">
                <SidebarPanel {...panelProps} />
            </div>
        </aside>
    );
}
