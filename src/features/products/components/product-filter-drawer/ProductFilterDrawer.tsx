"use client";

import * as React from "react";
import { ChevronDown, Filter, RotateCcw, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    useGetCategories,
    useGetBrands,
    useGetMateryaller,
} from "@/features/products/api/use-get-filter-options";
import type { FilterState } from "@/components/shared/data-table/types";
import type { UseDataGridReturn } from "@/components/shared/data-grid/types";
import type { IProductDTO } from "@/features/products/types";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

function getFilterValue<T>(filters: FilterState[], id: string): T | undefined {
    const f = filters.find((x) => x.id === id);
    return f?.value as T | undefined;
}

function deriveInitialFromFilters(filters: FilterState[]) {
    return {
        kategoriId: getFilterValue<number>(filters, "kategoriId") ?? ("" as const),
        markaId: getFilterValue<number>(filters, "markaId") ?? ("" as const),
        materyalId: getFilterValue<number>(filters, "materyalId") ?? ("" as const),
        minFiyat: String(getFilterValue<number>(filters, "minFiyat") ?? ""),
        maxFiyat: String(getFilterValue<number>(filters, "maxFiyat") ?? ""),
        minGram: String(getFilterValue<number>(filters, "minGram") ?? ""),
        maxGram: String(getFilterValue<number>(filters, "maxGram") ?? ""),
        stoktakiUrunler: getFilterValue<boolean>(filters, "stoktakiUrunler") ?? false,
    };
}

interface FilterFormContentProps {
    filters: FilterState[];
    grid: UseDataGridReturn<IProductDTO>;
    categories: { id: number; kategoriAdi: string }[];
    brands: { id: number; markaAdi: string }[];
    materyaller: { id: number; materyalAdi: string }[];
}

function FilterFormContent({
    filters,
    grid,
    categories,
    brands,
    materyaller,
}: FilterFormContentProps) {
    const initial = deriveInitialFromFilters(filters);
    const [kategoriId, setKategoriId] = React.useState<number | "">(initial.kategoriId);
    const [markaId, setMarkaId] = React.useState<number | "">(initial.markaId);
    const [materyalId, setMateryalId] = React.useState<number | "">(initial.materyalId);
    const [minFiyat, setMinFiyat] = React.useState(initial.minFiyat);
    const [maxFiyat, setMaxFiyat] = React.useState(initial.maxFiyat);
    const [minGram, setMinGram] = React.useState(initial.minGram);
    const [maxGram, setMaxGram] = React.useState(initial.maxGram);
    const [stoktakiUrunler, setStoktakiUrunler] = React.useState(initial.stoktakiUrunler);

    const handleUygula = () => {
        const newFilters: FilterState[] = [];
        if (kategoriId !== "") newFilters.push({ id: "kategoriId", value: kategoriId, operator: "eq" });
        if (markaId !== "") newFilters.push({ id: "markaId", value: markaId, operator: "eq" });
        if (materyalId !== "") newFilters.push({ id: "materyalId", value: materyalId, operator: "eq" });
        const minF = parseFloat(minFiyat);
        if (!Number.isNaN(minF) && minF >= 0) newFilters.push({ id: "minFiyat", value: minF, operator: "eq" });
        const maxF = parseFloat(maxFiyat);
        if (!Number.isNaN(maxF) && maxF >= 0) newFilters.push({ id: "maxFiyat", value: maxF, operator: "eq" });
        const minG = parseFloat(minGram);
        if (!Number.isNaN(minG) && minG >= 0) newFilters.push({ id: "minGram", value: minG, operator: "eq" });
        const maxG = parseFloat(maxGram);
        if (!Number.isNaN(maxG) && maxG >= 0) newFilters.push({ id: "maxGram", value: maxG, operator: "eq" });
        if (stoktakiUrunler) newFilters.push({ id: "stoktakiUrunler", value: true, operator: "eq" });
        (grid.actions as { setFilters?: (f: FilterState[]) => void }).setFilters?.(newFilters);
        grid.actions.setPage(0);
    };

    const handleTemizle = () => {
        grid.actions.clearAllFilters();
    };

    return (
        <div className="flex flex-col overflow-y-auto">
            <div className="flex-1 p-base">
                <Card className="p-0! overflow-hidden">
                    <CardContent className="flex flex-col gap-6 p-4">
                        <div className="space-y-2">
                            <Label>Kategori</Label>
                            <Select
                                value={kategoriId === "" ? "all" : String(kategoriId)}
                                onValueChange={(v) => setKategoriId(v === "all" ? "" : Number(v))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Tümü" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tümü</SelectItem>
                                    {categories?.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>
                                            {c.kategoriAdi}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Marka</Label>
                            <Select
                                value={markaId === "" ? "all" : String(markaId)}
                                onValueChange={(v) => setMarkaId(v === "all" ? "" : Number(v))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Tümü" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tümü</SelectItem>
                                    {brands?.map((b) => (
                                        <SelectItem key={b.id} value={String(b.id)}>
                                            {b.markaAdi}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Materyal</Label>
                            <Select
                                value={materyalId === "" ? "all" : String(materyalId)}
                                onValueChange={(v) => setMateryalId(v === "all" ? "" : Number(v))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Tümü" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tümü</SelectItem>
                                    {materyaller?.map((m) => (
                                        <SelectItem key={m.id} value={String(m.id)}>
                                            {m.materyalAdi}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Fiyat aralığı (TL)</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    placeholder="Min"
                                    min={0}
                                    step={100}
                                    value={minFiyat}
                                    onChange={(e) => setMinFiyat(e.target.value)}
                                />
                                <Input
                                    type="number"
                                    placeholder="Max"
                                    min={0}
                                    step={100}
                                    value={maxFiyat}
                                    onChange={(e) => setMaxFiyat(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Gram aralığı</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    placeholder="Min (gr)"
                                    min={0}
                                    step={0.1}
                                    value={minGram}
                                    onChange={(e) => setMinGram(e.target.value)}
                                />
                                <Input
                                    type="number"
                                    placeholder="Max (gr)"
                                    min={0}
                                    step={0.1}
                                    value={maxGram}
                                    onChange={(e) => setMaxGram(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="stoktaki"
                                checked={stoktakiUrunler}
                                onCheckedChange={(c) => setStoktakiUrunler(!!c)}
                            />
                            <Label htmlFor="stoktaki">Sadece stoktaki ürünler</Label>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="sticky bottom-0 z-1 flex justify-end gap-2 bg-table-header-background! p-base pt-0">
                <DrawerClose asChild>
                    <Button variant="outline" size="sm" onClick={handleTemizle}>
                        <RotateCcw className="size-4" />
                        Temizle
                    </Button>
                </DrawerClose>
                <DrawerClose asChild>
                    <Button size="sm" onClick={handleUygula}>
                        Uygula
                    </Button>
                </DrawerClose>
            </div>
        </div>
    );
}

/**
 * ============================================
 * PROPS
 * ============================================
 */

export interface ProductFilterDrawerProps {
    grid: UseDataGridReturn<IProductDTO>;

    /** Custom className */
    className?: string;

    /** Custom trigger label */
    label?: string;

    /** Trigger button variant */
    triggerVariant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary";

    /** Trigger button className */
    triggerClassName?: string;
}

/**
 * ============================================
 * COMPONENT
 * ============================================
 */

/**
 * ProductFilterDrawer
 *
 * Drawer to filter products (kategori, marka, materyal, fiyat, gram)
 */
export function ProductFilterDrawer({
    grid,
    className,
    label = "Filtreler",
    triggerVariant = "default",
    triggerClassName,
}: ProductFilterDrawerProps) {
    const { data: categories } = useGetCategories();
    const { data: brands } = useGetBrands();
    const { data: materyaller } = useGetMateryaller();

    const isMobile = useIsMobile(768);

    const filters = grid.state.filters;
    const activeCount = filters.length;

    return (
        <Drawer direction="right" key="product-filter">
            <DrawerTrigger asChild>
                <Button
                    size={isMobile ? "icon" : "default"}
                    variant={triggerVariant}
                    disabled={grid.query.isPending}
                    className={cn(triggerClassName, className)}
                >
                    <Filter className="size-4 shrink-0" />
                    <span className="truncate hidden md:inline-block">{label}</span>
                    {activeCount > 0 ? (
                        <span className="ml-2 shrink-0 rounded-full bg-card/20 h-5 w-5 text-sm text-primary-foreground items-center justify-center hidden md:inline-flex">
                            {activeCount}
                        </span>
                    ) : (
                        <ChevronDown className="ml-2 size-4 shrink-0 text-muted-foreground" />
                    )}
                </Button>
            </DrawerTrigger>

            <DrawerContent className="bg-table-header-background! min-h-screen overflow-hidden">
                <DrawerHeader className="bg-card! px-base! h-header!">
                    <div className="flex h-full flex-row items-center justify-between gap-base!">
                        <DrawerTitle className="px-3! py-1!">Ürün Filtreleri</DrawerTitle>
                        <DrawerClose asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <XIcon className="size-4" />
                            </Button>
                        </DrawerClose>
                    </div>
                </DrawerHeader>

                <Separator />

                <FilterFormContent
                    filters={filters}
                    grid={grid}
                    categories={categories ?? []}
                    brands={brands ?? []}
                    materyaller={materyaller ?? []}
                />
            </DrawerContent>
        </Drawer>
    );
}

export const MemoizedProductFilterDrawer = React.memo(ProductFilterDrawer) as typeof ProductFilterDrawer;
