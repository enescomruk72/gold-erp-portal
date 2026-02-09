/**
 * Core Table Types
 * 
 * Foundation types for the entire DataTable system.
 * These types define the contracts between all layers.
 */

import type { Table } from '@tanstack/react-table';

/**
 * ============================================
 * TABLE CONFIGURATION
 * ============================================
 */

export interface DataTableConfig<TData> {
    /** Unique table identifier (for state persistence) */
    tableId: string;

    /** API endpoint for data fetching */
    apiEndpoint?: string;

    /** Enable features */
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

    /** Enable row selection */
    enableRowSelection?: boolean;

    /** Enable multi-row selection */
    enableMultiRowSelection?: boolean;

    /** Custom row ID accessor */
    getRowId?: (row: TData) => string;

    /** Initial state */
    initialState?: {
        sorting?: SortingState[];
        pagination?: PaginationState;
        columnVisibility?: Record<string, boolean>;
    };
}

/**
 * ============================================
 * SORTING
 * ============================================
 */

export interface SortingState {
    id: string;
    desc: boolean;
}

export type SortDirection = 'asc' | 'desc' | false;

/**
 * ============================================
 * PAGINATION
 * ============================================
 */

export interface PaginationState {
    pageIndex: number;  // 0-based index
    pageSize: number;
}

export interface PaginationMeta {
    total: number;
    totalPages: number;
    currentPage: number;  // 1-based for display
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

/**
 * ============================================
 * SEARCH & FILTER
 * ============================================
 */

export type SearchState = string;

export interface FilterState {
    id: string;
    value: unknown;
    operator?: FilterOperator;
}

export type FilterOperator =
    | 'eq'
    | 'neq'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'contains'
    | 'startsWith'
    | 'endsWith'
    | 'in'
    | 'notIn'
    | 'between';

/**
 * ============================================
 * COLUMN PREFERENCES (Zustand)
 * ============================================
 */

export interface ColumnPreferences {
    /** Column visibility map */
    visibility: Record<string, boolean>;

    /** Column order array */
    order: string[];

    /** Column sizing map */
    sizing: Record<string, number>;

    /** Pinned columns */
    pinning: {
        left: string[];
        right: string[];
    };
}

/**
 * ============================================
 * ROW SELECTION
 * ============================================
 */

export type SelectionState = Record<string, boolean>;

export interface SelectionActions {
    toggleRow: (rowId: string) => void;
    toggleAll: () => void;
    clearSelection: () => void;
    selectRows: (rowIds: string[]) => void;
    deselectRows: (rowIds: string[]) => void;
}

/**
 * ============================================
 * TABLE STATE (Aggregated)
 * ============================================
 */

export interface TableState {
    /** URL state */
    sorting: SortingState[];
    pagination: PaginationState;
    search: SearchState;
    filters: FilterState[];

    /** Client state (Zustand) */
    columnPreferences: ColumnPreferences;
    selection: SelectionState;

    /** Derived state */
    selectedCount: number;
    selectedIds: string[];
}

/**
 * ============================================
 * TABLE ACTIONS
 * ============================================
 */

export interface TableActions {
    /** Sorting */
    setSorting: (sorting: SortingState[]) => void;
    toggleSort: (columnId: string) => void;
    clearSorting: () => void;

    /** Pagination */
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    nextPage: () => void;
    previousPage: () => void;

    /** Search */
    setSearch: (search: string) => void;
    clearSearch: () => void;

    /** Filters */
    setFilter: (columnId: string, value: unknown, operator?: FilterOperator) => void;
    clearFilter: (columnId: string) => void;
    clearAllFilters: () => void;

    /** Column preferences */
    toggleColumnVisibility: (columnId: string) => void;
    setColumnOrder: (order: string[]) => void;
    setColumnSize: (columnId: string, size: number) => void;
    pinColumn: (columnId: string, position: 'left' | 'right') => void;
    unpinColumn: (columnId: string) => void;
    resetColumnPreferences: () => void;

    /** Selection */
    toggleRowSelection: (rowId: string) => void;
    toggleAllRowsSelection: () => void;
    clearSelection: () => void;

    /** Utility */
    resetTable: () => void;
    refetch: () => void;
}

/**
 * ============================================
 * QUERY STATE (for API)
 * ============================================
 */

export interface QueryParams {
    sortBy?: string;         // Column ID to sort by
    sortOrder?: 'asc' | 'desc';  // Sort direction
    page?: number;           // 1-based page number
    limit?: number;          // Page size (pageSize alias for backend)
    search?: string;         // Global search term
    filters?: string;        // Serialized filters
    [key: string]: unknown;  // Custom params
}

/**
 * ============================================
 * API RESPONSE
 * ============================================
 */

export interface TableDataResponse<TData> {
    data: TData[];
    meta: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
}

/**
 * ============================================
 * TABLE QUERY STATE (for TanStack Query)
 * ============================================
 */

export interface TableQueryState {
    data: unknown[] | undefined;
    isLoading: boolean;
    isPending: boolean;
    isError: boolean;
    error: Error | null;
    isFetching: boolean;
    isRefetching: boolean;
}

/**
 * ============================================
 * USE DATA TABLE RETURN
 * ============================================
 */

export interface UseDataTableReturn<TData> {
    /** TanStack Table instance */
    table: Table<TData>;

    /** Query state */
    query: TableQueryState;

    /** Aggregated state */
    state: TableState;

    /** Actions */
    actions: TableActions;

    /** Pagination meta */
    pagination: PaginationMeta;

    /** Utility flags */
    isEmpty: boolean;
    hasData: boolean;
    isInitialLoading: boolean;
}

/**
 * ============================================
 * TYPE HELPERS
 * ============================================
 */

/**
 * Make specific properties required
 */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make specific properties optional
 */
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Extract row type from table data
 */
export type ExtractRowType<T> = T extends (infer U)[] ? U : never;
