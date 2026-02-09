/**
 * Data-Grid Core Types
 *
 * Grid görünümü için konfigürasyon ve hook dönüş tipleri.
 * Data-table ile aynı state/API contract kullanılır.
 */

import type React from 'react';
import type {
    TableActions,
    TableState,
    TableQueryState,
} from '@/components/shared/data-table/types';

/**
 * Pagination meta – API yanıtından gelen sayfalama bilgisi
 */
export interface PaginationMeta {
    total: number;
    totalPages: number;
    currentPage: number; // 1-based for display
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

/**
 * ============================================
 * DATA GRID CONFIGURATION
 * ============================================
 */

export interface DataGridConfig<TData> {
    /** Unique grid identifier (state persistence) */
    gridId: string;

    /** API endpoint for data fetching */
    apiEndpoint?: string;

    /** Enable features (data-table ile uyumlu) */
    features?: {
        sorting?: boolean;
        filtering?: boolean;
        pagination?: boolean;
        selection?: boolean;
        search?: boolean;
        export?: boolean;
    };

    /** Default page size */
    defaultPageSize?: number;

    /** Available page sizes */
    pageSizeOptions?: number[];

    /** Enable card selection */
    enableRowSelection?: boolean;

    /** Enable multi selection */
    enableMultiRowSelection?: boolean;

    /** Custom row ID accessor */
    getRowId?: (row: TData) => string;

    /** Responsive grid columns (e.g. { default: 2, sm: 3, lg: 4 }) */
    gridColumns?: Record<string, number>;

    /** Initial state (column visibility, etc.) */
    initialState?: {
        sorting?: Array<{ id: string; desc: boolean }>;
        pagination?: { pageIndex: number; pageSize: number };
        columnVisibility?: Record<string, boolean>;
    };
}

/**
 * ============================================
 * USE DATA GRID RETURN
 * ============================================
 */

/** Grid state: table state + search UI flags */
export interface DataGridState extends TableState {
    hasSearch?: boolean;
    isSearching?: boolean;
}

export interface UseDataGridReturn<TData> {
    /** Server data */
    data: TData[];

    /** Query state (loading, error, refetch) */
    query: TableQueryState;

    /** Aggregated state (sorting, pagination, search, selection, ...) */
    state: DataGridState;

    /** Actions (setPage, setSorting, setSearch, toggleSelection, refetch, ...) */
    actions: TableActions;

    /** Pagination meta (total, totalPages, currentPage, ...) */
    pagination: PaginationMeta;

    /** Utility flags */
    isEmpty: boolean;
    hasData: boolean;
    isInitialLoading: boolean;
}

/**
 * ============================================
 * DATA GRID PROPS (Main component)
 * ============================================
 */

export interface DataGridProps<TData> {
    /** useDataGrid return value */
    grid: UseDataGridReturn<TData>;

    /** Render each item as a card */
    renderCard: (item: TData, index: number) => React.ReactNode;

    /** Get unique key for each item */
    getItemKey?: (item: TData) => string | number;

    /** State: loading, error, empty (grid içinde gösterilir) */
    state?: {
        isInitialLoading?: boolean;
        isError?: boolean;
        error?: Error | null;
        onRetry?: () => void;
        isEmpty?: boolean;
        emptyMessage?: string;
        emptyAction?: { label: string; onClick: () => void };
    };

    /** Grid container className */
    className?: string;
}
