/**
 * Main DataTable Hook
 * 
 * Orchestrates all DataTable state and logic:
 * - URL state (nuqs) for sorting, pagination, search, filters
 * - Client state (Zustand) for column preferences and row selection
 * - Server state (TanStack Query) for data fetching
 * - Table instance (TanStack Table) for rendering
 * 
 * This is THE CORE of the entire DataTable system.
 * 
 * @note React Compiler is disabled for this file due to TanStack Table's
 * useReactTable hook which returns functions that cannot be safely memoized.
 */

'use client';

import { useEffect, useMemo, useRef } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    type ColumnDef,
} from '@tanstack/react-table';
import { useApiQuery } from '@/lib/api/hooks';

// State hooks
import { useSorting, usePagination, useSearch, useFilters } from '../hooks/state/url';
import { useColumnStore } from '../hooks/state/store/use-column-store';
import { useSelectionStore } from '../hooks/state/store/use-selection-store';

// Utils
import { buildQueryParams } from '../utils/query';

// Types
import type {
    DataTableConfig,
    UseDataTableReturn,
    PaginationMeta,
} from '../types';
import type { PaginationMetadata } from '@/lib/api/types';

/**
 * ============================================
 * HOOK INPUT PROPS
 * ============================================
 */

export interface UseDataTableProps<TData> {
    /** Unique table identifier (for state persistence) */
    tableId: string;

    /** Column definitions */
    columns: ColumnDef<TData, unknown>[];

    /** API endpoint for data fetching */
    apiEndpoint: string;

    /** Additional configuration */
    config?: Partial<DataTableConfig<TData>>;

    /** Custom query params (merged with table state) */
    customParams?: Record<string, unknown>;

    /** State prefix for URL params (e.g., 'catalog' → catalog_page, catalog_limit) */
    statePrefix?: string;

    /** Enable query (default: true) */
    enabled?: boolean;

    /** Use Next.js API proxy for requests (e.g. /api/proxy) */
    useProxy?: boolean;
}

/**
 * ============================================
 * MAIN HOOK
 * ============================================
 */

/**
 * useDataTable
 * 
 * Main hook that orchestrates everything
 * 
 * @example
 * ```tsx
 * const table = useDataTable({
 *   tableId: 'users',
 *   columns: userColumns,
 *   apiEndpoint: '/crm/cariler',
 *   customParams: { cariTipi: 'MUSTERI' }
 * });
 * 
 * if (table.isInitialLoading) return <TableSkeleton />;
 * if (table.query.isError) return <TableError error={table.query.error} />;
 * if (table.isEmpty) return <TableEmpty />;
 * 
 * return (
 *   <>
 *     <TableToolbar table={table} />
 *     <DataTable table={table.table} />
 *     <TablePagination table={table} />
 *   </>
 * );
 * ```
 */
export function useDataTable<TData extends { id: string | number }>({
    tableId,
    columns,
    apiEndpoint,
    config = {},
    customParams = {},
    statePrefix = '',
    enabled = true,
    useProxy = false,
}: UseDataTableProps<TData>): UseDataTableReturn<TData> {
    // ====================================
    // 1. URL STATE (nuqs)
    // ====================================
    const sorting = useSorting(statePrefix);
    const pagination = usePagination(statePrefix, config.defaultPageSize);
    const search = useSearch(statePrefix);
    const filters = useFilters(statePrefix); // Future

    // Reset page to 1 when search changes (pageSize & sort remain)
    const isFirstSearchMount = useRef(true);
    const firstPage = pagination.firstPage;
    useEffect(() => {
        if (isFirstSearchMount.current) {
            isFirstSearchMount.current = false;
            return;
        }
        firstPage();
    }, [search.debouncedValue, firstPage]);

    // ====================================
    // 2. CLIENT STATE (Zustand)
    // ====================================
    const columnStore = useColumnStore(tableId, undefined, {
        persist: true,
        defaultVisibility: config.initialState?.columnVisibility,
    });

    const selectionStore = useSelectionStore(tableId, undefined, {
        enableMultiRowSelection: config.enableMultiRowSelection ?? true,
        maxSelections: 0, // Unlimited
    });

    // ====================================
    // 3. BUILD API QUERY PARAMS
    // ====================================
    const queryParams = useMemo(() => {
        return buildQueryParams({
            sorting: sorting.value,
            pagination: pagination.value,
            search: search.debouncedValue,
            filters: filters.value,
            customParams,
        });
    }, [
        sorting.value,
        pagination.value,
        search.debouncedValue,
        filters.value,
        customParams,
    ]);

    // ====================================
    // 4. FETCH DATA (TanStack Query)
    // ====================================
    const query = useApiQuery<TData[]>(apiEndpoint, {
        queryKey: [tableId, queryParams],
        apiOptions: {
            params: queryParams as Record<string, string | number | boolean | null | undefined>,
        },
        queryOptions: {
            enabled,
            placeholderData: (prev) => prev, // Keep old data while fetching new
        },
        useProxy,
    });

    // ====================================
    // 5. EXTRACT PAGINATION META
    // ====================================
    const paginationMeta = useMemo<PaginationMeta>(() => {
        const meta = query.data?.metadata?.pagination as PaginationMetadata | undefined;

        return {
            total: meta?.total ?? 0,
            totalPages: meta?.totalPages ?? 0,
            currentPage: meta?.currentPage ?? 1,
            pageSize: meta?.limit ?? pagination.value.pageSize,
            hasNextPage: meta?.hasNextPage ?? false,
            hasPreviousPage: meta?.hasPreviousPage ?? false,
        };
    }, [query.data?.metadata?.pagination, pagination.value.pageSize]);

    // ====================================
    // 6. CREATE TABLE INSTANCE (TanStack Table)
    // ====================================
    const table = useReactTable({
        data: query.data?.data ?? [],
        columns,

        // State
        state: {
            sorting: sorting.value,
            pagination: {
                pageIndex: pagination.value.pageIndex,
                pageSize: pagination.value.pageSize,
            },
            columnVisibility: columnStore.visibility,
            columnOrder: columnStore.order,
            rowSelection: selectionStore.selection,
        },

        // Manual modes (server-side)
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,

        // Pagination
        pageCount: paginationMeta.totalPages,

        // Row ID accessor (string for selection store; support numeric id from backend)
        getRowId: config.getRowId || ((row: TData) => String(row.id)),

        // ====================================
        // EVENT HANDLERS
        // ====================================

        // Sorting
        onSortingChange: (updater) => {
            const newSorting =
                typeof updater === 'function' ? updater(sorting.value) : updater;
            sorting.set(newSorting);
        },

        // Pagination
        onPaginationChange: (updater) => {
            const newPagination =
                typeof updater === 'function'
                    ? updater(pagination.value)
                    : updater;
            pagination.set(newPagination);
        },

        // Column visibility
        onColumnVisibilityChange: (updater) => {
            const newVisibility =
                typeof updater === 'function'
                    ? updater(columnStore.visibility)
                    : updater;
            columnStore.setVisibility(newVisibility);
        },

        // Column order
        onColumnOrderChange: (updater) => {
            const newOrder =
                typeof updater === 'function'
                    ? updater(columnStore.order)
                    : updater;
            columnStore.setOrder(newOrder);
        },

        // Row selection
        onRowSelectionChange: (updater) => {
            const newSelection =
                typeof updater === 'function'
                    ? updater(selectionStore.selection)
                    : updater;

            // Update selection via actions (not direct mutation)
            const selectedIds = Object.keys(newSelection).filter(
                (id) => newSelection[id]
            );
            selectionStore.selectRows(selectedIds);
        },

        // Core
        getCoreRowModel: getCoreRowModel(),
    });

    // ====================================
    // 7. DERIVED STATE
    // ====================================
    const isEmpty = useMemo(() => {
        return !query.isLoading && (!query.data?.data || query.data.data.length === 0);
    }, [query.isLoading, query.data?.data]);

    const hasData = useMemo(() => {
        return !!query.data?.data && query.data.data.length > 0;
    }, [query.data?.data]);

    const isInitialLoading = useMemo(() => {
        return query.isLoading && !query.data;
    }, [query.isLoading, query.data]);

    // ====================================
    // 8. ACTIONS
    // ====================================
    const actions = useMemo(
        () => ({
            // Sorting
            setSorting: sorting.set,
            toggleSort: sorting.toggle,
            clearSorting: sorting.clear,

            // Pagination
            setPage: pagination.setPage,
            setPageSize: pagination.setPageSize,
            nextPage: pagination.nextPage,
            previousPage: pagination.previousPage,
            firstPage: pagination.firstPage,
            lastPage: () => pagination.lastPage(paginationMeta.totalPages),

            // Search
            setSearch: search.set,
            clearSearch: search.clear,

            // Filters (future)
            setFilter: filters.setFilter,
            clearFilter: filters.clearFilter,
            clearAllFilters: filters.clearAll,

            // Column preferences
            toggleColumnVisibility: columnStore.toggleVisibility,
            setColumnOrder: columnStore.setOrder,
            setColumnSize: columnStore.setSize,
            pinColumn: (id: string, position: 'left' | 'right') => {
                if (position === 'left') columnStore.pinLeft(id);
                else columnStore.pinRight(id);
            },
            unpinColumn: columnStore.unpin,
            resetColumnPreferences: columnStore.reset,

            // Selection
            toggleRowSelection: selectionStore.toggleRow,
            toggleAllRowsSelection: () => {
                const allIds = (query.data?.data ?? []).map((row: TData) =>
                    config.getRowId ? config.getRowId(row) : String(row.id)
                );
                selectionStore.toggleAll(allIds);
            },
            clearSelection: selectionStore.clearSelection,

            // Utility
            resetTable: () => {
                sorting.clear();
                search.clear();
                pagination.reset();
                selectionStore.clearSelection();
            },
            refetch: query.refetch,
        }),
        [
            sorting,
            pagination,
            search,
            filters,
            columnStore,
            selectionStore,
            paginationMeta.totalPages,
            query.data?.data,
            query.refetch,
            config,
        ]
    );

    // ====================================
    // 9. RETURN UNIFIED API
    // ====================================
    return {
        // TanStack Table instance
        table,

        // Query state
        query: {
            data: query.data?.data ?? undefined,
            isLoading: query.isLoading,
            isPending: query.isPending,
            isError: query.isError,
            error: query.error ?? null,
            isFetching: query.isFetching,
            isRefetching: query.isRefetching,
        },

        // Aggregated state
        state: {
            sorting: sorting.value,
            pagination: pagination.value,
            search: search.value,
            filters: filters.value,
            columnPreferences: {
                visibility: columnStore.visibility,
                order: columnStore.order,
                sizing: columnStore.sizing,
                pinning: columnStore.pinning,
            },
            selection: selectionStore.selection,
            selectedCount: selectionStore.getSelectedCount(),
            selectedIds: selectionStore.getSelectedIds(),
        },

        // Actions
        actions,

        // Pagination meta
        pagination: paginationMeta,

        // Utility flags
        isEmpty,
        hasData,
        isInitialLoading,
    };
}

/**
 * Type export for external usage
 */
export type UseDataTableHookReturn<TData extends { id: string | number }> = ReturnType<typeof useDataTable<TData>>;
