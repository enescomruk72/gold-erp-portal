/**
 * Row Helper Utilities
 * 
 * Helpers for manipulating row data and selection.
 */

import type { Row } from '@tanstack/react-table';
import type { SelectionState } from '../../types';

/**
 * Get selected rows from selection state
 * 
 * @example
 * ```ts
 * const selectedRows = getSelectedRows(allRows, selection);
 * ```
 */
export function getSelectedRows<TData>(
    rows: Row<TData>[],
    selection: SelectionState
): Row<TData>[] {
    return rows.filter((row) => selection[row.id]);
}

/**
 * Get selected row IDs
 * 
 * @example
 * ```ts
 * const selectedIds = getSelectedRowIds(selection);
 * // → ['row-1', 'row-3', 'row-5']
 * ```
 */
export function getSelectedRowIds(selection: SelectionState): string[] {
    return Object.keys(selection).filter((id) => selection[id]);
}

/**
 * Get selected row count
 * 
 * @example
 * ```ts
 * const count = getSelectedRowCount(selection);
 * // → 3
 * ```
 */
export function getSelectedRowCount(selection: SelectionState): number {
    return getSelectedRowIds(selection).length;
}

/**
 * Check if all rows are selected
 * 
 * @example
 * ```ts
 * const allSelected = areAllRowsSelected(visibleRowIds, selection);
 * ```
 */
export function areAllRowsSelected(
    rowIds: string[],
    selection: SelectionState
): boolean {
    if (rowIds.length === 0) return false;
    return rowIds.every((id) => selection[id]);
}

/**
 * Check if some (but not all) rows are selected
 * 
 * @example
 * ```ts
 * const someSelected = areSomeRowsSelected(visibleRowIds, selection);
 * ```
 */
export function areSomeRowsSelected(
    rowIds: string[],
    selection: SelectionState
): boolean {
    const selectedCount = rowIds.filter((id) => selection[id]).length;
    return selectedCount > 0 && selectedCount < rowIds.length;
}

/**
 * Toggle all rows selection
 * 
 * @example
 * ```ts
 * const newSelection = toggleAllRowsSelection(visibleRowIds, currentSelection);
 * ```
 */
export function toggleAllRowsSelection(
    rowIds: string[],
    currentSelection: SelectionState
): SelectionState {
    const allSelected = areAllRowsSelected(rowIds, currentSelection);

    const newSelection: SelectionState = { ...currentSelection };

    if (allSelected) {
        // Deselect all
        rowIds.forEach((id) => {
            delete newSelection[id];
        });
    } else {
        // Select all
        rowIds.forEach((id) => {
            newSelection[id] = true;
        });
    }

    return newSelection;
}

/**
 * Select rows by IDs
 * 
 * @example
 * ```ts
 * const newSelection = selectRows(['row-1', 'row-2'], currentSelection);
 * ```
 */
export function selectRows(
    rowIds: string[],
    currentSelection: SelectionState
): SelectionState {
    const newSelection: SelectionState = { ...currentSelection };

    rowIds.forEach((id) => {
        newSelection[id] = true;
    });

    return newSelection;
}

/**
 * Deselect rows by IDs
 * 
 * @example
 * ```ts
 * const newSelection = deselectRows(['row-1', 'row-2'], currentSelection);
 * ```
 */
export function deselectRows(
    rowIds: string[],
    currentSelection: SelectionState
): SelectionState {
    const newSelection: SelectionState = { ...currentSelection };

    rowIds.forEach((id) => {
        delete newSelection[id];
    });

    return newSelection;
}

/**
 * Toggle single row selection
 * 
 * @example
 * ```ts
 * const newSelection = toggleRowSelection('row-1', currentSelection);
 * ```
 */
export function toggleRowSelection(
    rowId: string,
    currentSelection: SelectionState
): SelectionState {
    const newSelection: SelectionState = { ...currentSelection };

    if (newSelection[rowId]) {
        delete newSelection[rowId];
    } else {
        newSelection[rowId] = true;
    }

    return newSelection;
}

/**
 * Clear all selection
 * 
 * @example
 * ```ts
 * const newSelection = clearSelection();
 * // → {}
 * ```
 */
export function clearSelection(): SelectionState {
    return {};
}

/**
 * Get row IDs from rows
 * 
 * @example
 * ```ts
 * const ids = getRowIds(rows);
 * // → ['row-1', 'row-2', 'row-3']
 * ```
 */
export function getRowIds<TData>(rows: Row<TData>[]): string[] {
    return rows.map((row) => row.id);
}

/**
 * Get row data from rows
 * 
 * @example
 * ```ts
 * const data = getRowData(rows);
 * ```
 */
export function getRowData<TData>(rows: Row<TData>[]): TData[] {
    return rows.map((row) => row.original);
}

/**
 * Get selected row data
 * 
 * @example
 * ```ts
 * const selectedData = getSelectedRowData(allRows, selection);
 * ```
 */
export function getSelectedRowData<TData>(
    rows: Row<TData>[],
    selection: SelectionState
): TData[] {
    return getSelectedRows(rows, selection).map((row) => row.original);
}

/**
 * Filter rows by predicate
 * 
 * @example
 * ```ts
 * const activeRows = filterRows(rows, (row) => row.original.active);
 * ```
 */
export function filterRows<TData>(
    rows: Row<TData>[],
    predicate: (row: Row<TData>) => boolean
): Row<TData>[] {
    return rows.filter(predicate);
}

/**
 * Find row by ID
 * 
 * @example
 * ```ts
 * const row = findRowById(rows, 'row-1');
 * ```
 */
export function findRowById<TData>(
    rows: Row<TData>[],
    id: string
): Row<TData> | undefined {
    return rows.find((row) => row.id === id);
}

/**
 * Find row by predicate
 * 
 * @example
 * ```ts
 * const row = findRow(rows, (row) => row.original.email === 'test@example.com');
 * ```
 */
export function findRow<TData>(
    rows: Row<TData>[],
    predicate: (row: Row<TData>) => boolean
): Row<TData> | undefined {
    return rows.find(predicate);
}

/**
 * Check if row is selected
 * 
 * @example
 * ```ts
 * const isSelected = isRowSelected('row-1', selection);
 * ```
 */
export function isRowSelected(rowId: string, selection: SelectionState): boolean {
    return Boolean(selection[rowId]);
}

/**
 * Get page row IDs
 * 
 * @example
 * ```ts
 * const pageIds = getPageRowIds(rows);
 * ```
 */
export function getPageRowIds<TData>(rows: Row<TData>[]): string[] {
    return getRowIds(rows);
}

/**
 * Create selection state from row IDs
 * 
 * @example
 * ```ts
 * const selection = createSelectionState(['row-1', 'row-2']);
 * // → { 'row-1': true, 'row-2': true }
 * ```
 */
export function createSelectionState(rowIds: string[]): SelectionState {
    const selection: SelectionState = {};
    rowIds.forEach((id) => {
        selection[id] = true;
    });
    return selection;
}
