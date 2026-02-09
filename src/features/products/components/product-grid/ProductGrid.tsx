"use client";

import {
    DataGrid,
    useDataGrid,
    GridToolbar,
    PageSizeSelect,
    PageNavigator,
    PageInfo,
} from "@/components/shared/data-grid";
import type { IProductDTO } from "@/features/products/types";
import { ProductCard } from "../product-card";
import { ProductFilterDrawer } from "../product-filter-drawer";
import { productColumns } from "./product-columns";

export const PRODUCT_GRID_SORT_OPTIONS = [
    { value: "urunAdi", label: "Ürün Adı" },
    { value: "fiyat", label: "Fiyat" },
    { value: "createdAt", label: "Tarih" },
] as const;

const PRODUCT_GRID_PAGE_SIZE_OPTIONS = [12, 24, 48, 50, 96];

interface ProductGridProps {
    onProductDetailClick?: (product: IProductDTO) => void;
}

function buildProductFilters(filters: { id: string; value: unknown }[]): Record<string, unknown> {
    const get = (id: string) => filters.find((f) => f.id === id)?.value;
    const toNum = (v: unknown): number | null => {
        if (typeof v === "number" && !Number.isNaN(v)) return v;
        const n = typeof v === "string" ? parseFloat(v) : Number(v);
        return !Number.isNaN(n) ? n : null;
    };
    const out: Record<string, unknown> = {};
    const vK = toNum(get("kategoriId"));
    if (vK !== null && vK > 0) out.kategoriId = vK;
    const vM = toNum(get("markaId"));
    if (vM !== null && vM > 0) out.markaId = vM;
    const vMat = toNum(get("materyalId"));
    if (vMat !== null && vMat > 0) out.materyalId = vMat;
    const vMinF = toNum(get("minFiyat"));
    if (vMinF !== null && vMinF >= 0) out.minFiyat = vMinF;
    const vMaxF = toNum(get("maxFiyat"));
    if (vMaxF !== null && vMaxF >= 0) out.maxFiyat = vMaxF;
    const vMinG = toNum(get("minGram"));
    if (vMinG !== null && vMinG >= 0) out.minGram = vMinG;
    const vMaxG = toNum(get("maxGram"));
    if (vMaxG !== null && vMaxG >= 0) out.maxGram = vMaxG;
    const vStok = get("stoktakiUrunler");
    if (vStok === true || vStok === "true") out.stoktakiUrunler = true;
    return out;
}

export function ProductGrid({ onProductDetailClick }: ProductGridProps) {
    const grid = useDataGrid<IProductDTO>({
        gridId: "products",
        columns: productColumns,
        apiEndpoint: "/v1/b2b/products",
        useProxy: true,
        statePrefix: "products",
        buildCustomParams: buildProductFilters,
        config: {
            defaultPageSize: 50,
            pageSizeOptions: PRODUCT_GRID_PAGE_SIZE_OPTIONS,
        },
    });

    return (
        <div className="space-y-4">
            <GridToolbar
                grid={grid}
                sortOptions={[...PRODUCT_GRID_SORT_OPTIONS]}
                filterFields={[
                    {
                        id: "product-filter",
                        label: "Filtreler",
                        type: "custom",
                        component: <ProductFilterDrawer grid={grid} />,
                    },
                ]}
                searchPlaceholder="Ürün ara..."
                showPagination={false}
            />
            <DataGrid
                grid={grid}
                className="2xl:grid-cols-5 3xl:grid-cols-6"
                renderCard={(product, index) => (
                    <ProductCard
                        product={product}
                        index={index}
                        onDetailClick={onProductDetailClick}
                    />
                )}
                state={{
                    isInitialLoading: grid.isInitialLoading,
                    isError: grid.query.isError,
                    error: grid.query.error,
                    onRetry: grid.actions.refetch,
                    isEmpty: grid.isEmpty,
                    emptyMessage: "Ürün bulunamadı. Filtreleri değiştirmeyi deneyin.",
                }}
            />
            {!grid.isEmpty && grid.pagination.total > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-muted/30 px-4 py-3">
                    <PageSizeSelect
                        pageSize={grid.pagination.pageSize}
                        onPageSizeChange={grid.actions.setPageSize}
                        pageSizeOptions={PRODUCT_GRID_PAGE_SIZE_OPTIONS}
                        disabled={grid.query.isPending}
                    />
                    <PageInfo
                        pagination={grid.pagination}
                        selectedCount={grid.state.selectedCount}
                    />
                    <PageNavigator
                        pagination={grid.pagination}
                        onPageChange={(page: number) => grid.actions.setPage(page - 1)}
                        showFirstLast
                        maxVisiblePages={5}
                        disabled={grid.query.isPending}
                    />
                </div>
            )}
        </div>
    );
}
