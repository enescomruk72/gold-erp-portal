/**
 * useDataGrid
 *
 * Data-table ile aynı state ve API contract; tablo yerine grid (kart listesi) için.
 * URL state (nuqs), Zustand (selection, column prefs), useApiQuery + buildQueryParams kullanır.
 */

'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useSorting, usePagination, useSearch, useFilters } from '@/components/shared/data-table/hooks/state/url';
import { useColumnStore } from '@/components/shared/data-table/hooks/state/store/use-column-store';
import { useSelectionStore } from '@/components/shared/data-table/hooks/state/store/use-selection-store';
import { buildQueryParams } from '@/components/shared/data-table/utils/query';
import { useApiQuery } from '@/lib/api/hooks';
import type { PaginationMetadata } from '@/lib/api/types';
import type { ColumnDef, FilterState } from '@/components/shared/data-table/types';
import type {
    DataGridConfig,
    UseDataGridReturn,
    PaginationMeta,
} from '../types';
import { DEFAULT_GRID_CONFIG } from '../config';

export interface UseDataGridProps<TData> {
    gridId: string;
    columns: ColumnDef<TData, unknown>[];
    apiEndpoint: string;
    config?: Partial<DataGridConfig<TData>>;
    customParams?: Record<string, unknown>;
    /** Filtre state'inden API'ye özel parametreler türet (örn. kategoriId, markaId) */
    buildCustomParams?: (filters: FilterState[]) => Record<string, unknown>;
    statePrefix?: string;
    enabled?: boolean;
    /** API isteğinde proxy kullan (örn. /api/proxy) */
    useProxy?: boolean;
}

export function useDataGrid<TData extends { id: string | number }>({
    gridId,
    columns,
    apiEndpoint,
    config: configOverride = {},
    customParams = {},
    buildCustomParams,
    statePrefix = '',
    enabled = true,
    useProxy = false,
}: UseDataGridProps<TData>): UseDataGridReturn<TData> {
    void columns; // Required by API contract, reserved for column-based features
    const config = useMemo(
        () => ({ ...DEFAULT_GRID_CONFIG, ...configOverride }) as DataGridConfig<TData>,
        [configOverride]
    );

    const sorting = useSorting(statePrefix);
    const pagination = usePagination(statePrefix, config.defaultPageSize ?? 12);
    const search = useSearch(statePrefix);
    const filters = useFilters(statePrefix);

    const isFirstSearchMount = useRef(true);
    useEffect(() => {
        if (isFirstSearchMount.current) {
            isFirstSearchMount.current = false;
            return;
        }
        pagination.firstPage();
    }, [search.debouncedValue, pagination]);

    const columnStore = useColumnStore(gridId, undefined, {
        persist: true,
        defaultVisibility: config.initialState?.columnVisibility,
    });

    const selectionStore = useSelectionStore(gridId, undefined, {
        enableMultiRowSelection: config.enableMultiRowSelection ?? true,
        maxSelections: 0,
    });

    const queryParams = useMemo(() => {
        const fromFilters = buildCustomParams?.(filters.value) ?? {};
        const merged = { ...customParams, ...fromFilters };
        return buildQueryParams({
            sorting: sorting.value,
            pagination: pagination.value,
            search: search.debouncedValue,
            filters: filters.value,
            customParams: merged,
        });
    }, [
        sorting.value,
        pagination.value,
        search.debouncedValue,
        filters.value,
        customParams,
        buildCustomParams,
    ]);

    const query = useApiQuery<TData[]>(apiEndpoint, {
        queryKey: [gridId, queryParams],
        apiOptions: {
            params: queryParams as Record<string, string | number | boolean | null | undefined>,
        },
        queryOptions: {
            enabled,
            placeholderData: (prev) => prev,
        },
        useProxy,
    });

    const getRowId = useMemo(
        () => config.getRowId ?? ((row: TData) => String(row.id)),
        [config.getRowId]
    );
    const data = useMemo(
        () => (query.data?.data ?? []) as TData[],
        [query.data?.data]
    );

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

    const isEmpty = useMemo(
        () => !query.isLoading && (!data || data.length === 0),
        [query.isLoading, data]
    );
    const hasData = useMemo(() => !!data && data.length > 0, [data]);
    const isInitialLoading = useMemo(() => query.isLoading && !query.data, [query.isLoading, query.data]);

    const actions = useMemo(
        () => ({
            setSorting: sorting.set,
            toggleSort: sorting.toggle,
            clearSorting: sorting.clear,
            setPage: pagination.setPage,
            setPageSize: pagination.setPageSize,
            nextPage: pagination.nextPage,
            previousPage: pagination.previousPage,
            firstPage: pagination.firstPage,
            lastPage: () => pagination.lastPage(paginationMeta.totalPages),
            setSearch: search.set,
            clearSearch: search.clear,
            setFilter: filters.setFilter,
            setFilters: filters.set,
            clearFilter: filters.clearFilter,
            clearAllFilters: filters.clearAll,
            toggleColumnVisibility: columnStore.toggleVisibility,
            setColumnOrder: columnStore.setOrder,
            setColumnSize: columnStore.setSize,
            pinColumn: (id: string, position: 'left' | 'right') => {
                if (position === 'left') columnStore.pinLeft(id);
                else columnStore.pinRight(id);
            },
            unpinColumn: columnStore.unpin,
            resetColumnPreferences: columnStore.reset,
            toggleRowSelection: selectionStore.toggleRow,
            toggleAllRowsSelection: () => {
                const allIds = data.map((row) => getRowId(row));
                selectionStore.toggleAll(allIds);
            },
            clearSelection: selectionStore.clearSelection,
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
            data,
            getRowId,
            query.refetch,
        ]
    );

    const selectedCount = selectionStore.getSelectedCount();
    const state = useMemo(
        () => ({
            sorting: sorting.value,
            pagination: pagination.value,
            search: search.value,
            filters: filters.value,
            hasSearch: search.hasSearch,
            isSearching: search.isSearching,
            columnPreferences: {
                visibility: columnStore.visibility,
                order: columnStore.order,
                sizing: columnStore.sizing,
                pinning: columnStore.pinning,
            },
            selection: selectionStore.selection,
            selectedCount,
            selectedIds: selectionStore.getSelectedIds(),
        }),
        [
            sorting.value,
            pagination.value,
            search.value,
            search.hasSearch,
            search.isSearching,
            filters.value,
            columnStore.visibility,
            columnStore.order,
            columnStore.sizing,
            columnStore.pinning,
            selectionStore,
            selectedCount,
        ]
    );

    return {
        data,
        query: {
            data: query.data?.data ?? undefined,
            isLoading: query.isLoading,
            isPending: query.isPending,
            isError: query.isError,
            error: query.error ?? null,
            isFetching: query.isFetching,
            isRefetching: query.isRefetching,
        },
        state,
        actions,
        pagination: paginationMeta,
        isEmpty,
        hasData,
        isInitialLoading,
    };
}
