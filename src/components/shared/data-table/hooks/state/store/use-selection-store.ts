/**
 * Use Selection Store Hook
 * 
 * React hook wrapper for selection store.
 * Provides easy access to row selection state and actions.
 */

import { useMemo, useCallback } from 'react';
import { getSelectionStore } from './create-selection-store';
import type { SelectionStoreState } from '@/components/shared/data-table/types';

/**
 * Hook to access selection store for a specific table
 * 
 * @example
 * // Full store access
 * const selectionStore = useSelectionStore('users-table');
 * 
 * // Selective access (optimized)
 * const selection = useSelectionStore('users-table', state => state.selection);
 * const toggleRow = useSelectionStore('users-table', state => state.toggleRow);
 */
export function useSelectionStore<T = SelectionStoreState>(
    tableId: string,
    selector?: (state: SelectionStoreState) => T,
    options?: {
        enableMultiRowSelection?: boolean;
        maxSelections?: number;
    }
): T {
    // Get or create store (memoized)
    const store = useMemo(() => getSelectionStore(tableId, options), [tableId, options]);

    // Use selector if provided, otherwise return full state
    return selector ? store(selector) : (store() as T);
}

/**
 * Hook for row selection with all actions
 * 
 * @example
 * const {
 *   selection,
 *   selectedIds,
 *   selectedCount,
 *   toggleRow,
 *   toggleAll,
 *   clearSelection
 * } = useRowSelection('users-table');
 */
export function useRowSelection(tableId: string, options?: {
    enableMultiRowSelection?: boolean;
    maxSelections?: number;
}) {
    const selection = useSelectionStore(tableId, (state) => state.selection, options);
    const toggleRow = useSelectionStore(tableId, (state) => state.toggleRow);
    const toggleAll = useSelectionStore(tableId, (state) => state.toggleAll);
    const selectRows = useSelectionStore(tableId, (state) => state.selectRows);
    const deselectRows = useSelectionStore(tableId, (state) => state.deselectRows);
    const clearSelection = useSelectionStore(tableId, (state) => state.clearSelection);
    const getSelectedIds = useSelectionStore(tableId, (state) => state.getSelectedIds);
    const getSelectedCount = useSelectionStore(tableId, (state) => state.getSelectedCount);

    // Memoize derived values
    const selectedIds = useMemo(() => getSelectedIds(), [getSelectedIds]);
    const selectedCount = useMemo(() => getSelectedCount(), [getSelectedCount]);

    return {
        selection,
        selectedIds,
        selectedCount,
        toggleRow,
        toggleAll,
        selectRows,
        deselectRows,
        clearSelection,
    };
}

/**
 * Hook to check if a specific row is selected
 * 
 * @example
 * const isSelected = useIsRowSelected('users-table', 'user-123');
 */
export function useIsRowSelected(tableId: string, rowId: string) {
    const isRowSelected = useSelectionStore(tableId, (state) => state.isRowSelected);
    return isRowSelected(rowId);
}

/**
 * Hook to check if all rows are selected
 * 
 * @example
 * const allSelected = useAreAllRowsSelected('users-table', visibleRowIds);
 */
export function useAreAllRowsSelected(tableId: string, rowIds: string[]) {
    const areAllSelected = useSelectionStore(tableId, (state) => state.areAllSelected);

    return useMemo(() => areAllSelected(rowIds), [rowIds, areAllSelected]);
}

/**
 * Hook to check if some (but not all) rows are selected
 * 
 * @example
 * const someSelected = useAreSomeRowsSelected('users-table', visibleRowIds);
 */
export function useAreSomeRowsSelected(tableId: string, rowIds: string[]) {
    const areSomeSelected = useSelectionStore(tableId, (state) => state.areSomeSelected);

    return useMemo(() => areSomeSelected(rowIds), [rowIds, areSomeSelected]);
}

/**
 * Hook for bulk selection actions
 * 
 * @example
 * const { selectAll, deselectAll, selectPage, deselectPage } = useBulkSelection('users-table');
 */
export function useBulkSelection(tableId: string) {
    const toggleAll = useSelectionStore(tableId, (state) => state.toggleAll);
    const selectRows = useSelectionStore(tableId, (state) => state.selectRows);
    const deselectRows = useSelectionStore(tableId, (state) => state.deselectRows);
    const clearSelection = useSelectionStore(tableId, (state) => state.clearSelection);

    const selectAll = useCallback((rowIds: string[]) => {
        selectRows(rowIds);
    }, [selectRows]);

    const deselectAll = useCallback((rowIds: string[]) => {
        deselectRows(rowIds);
    }, [deselectRows]);

    const selectPage = useCallback((pageRowIds: string[]) => {
        selectRows(pageRowIds);
    }, [selectRows]);

    const deselectPage = useCallback((pageRowIds: string[]) => {
        deselectRows(pageRowIds);
    }, [deselectRows]);

    return {
        selectAll,
        deselectAll,
        selectPage,
        deselectPage,
        clearSelection,
        toggleAll,
    };
}

/**
 * Hook to get selected row data
 * 
 * @example
 * const selectedRows = useSelectedRows('users-table', allRows);
 */
export function useSelectedRows<TData extends { id: string }>(
    tableId: string,
    allRows: TData[]
) {
    const selectedIds = useSelectionStore(tableId, (state) => state.getSelectedIds());

    return useMemo(() => {
        return allRows.filter(row => selectedIds.includes(row.id));
    }, [allRows, selectedIds]);
}
