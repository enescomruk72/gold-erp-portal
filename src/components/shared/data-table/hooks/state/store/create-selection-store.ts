/**
 * Selection Store
 * 
 * Zustand store for row selection.
 * Ephemeral state - NOT persisted to localStorage.
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { SelectionStoreState, CreateSelectionStoreOptions } from '@/components/shared/data-table/types';

/**
 * Create a selection store for a specific table
 * 
 * @example
 * const useUserSelectionStore = createSelectionStore({
 *   tableId: 'users-table',
 *   enableMultiRowSelection: true
 * });
 * 
 * // In component
 * const selection = useUserSelectionStore(state => state.selection);
 * const toggleRow = useUserSelectionStore(state => state.toggleRow);
 */
export function createSelectionStore(options: CreateSelectionStoreOptions) {
    const {
        tableId,
        enableMultiRowSelection = true,
        maxSelections = 0, // 0 = unlimited
    } = options;

    return create<SelectionStoreState>()(
        immer((set, get) => ({
            // State
            tableId,
            selection: {},

            // Actions
            toggleRow: (rowId: string) => {
                set((state) => {
                    const isSelected = state.selection[rowId];

                    if (isSelected) {
                        // Deselect
                        delete state.selection[rowId];
                    } else {
                        // Select
                        if (!enableMultiRowSelection) {
                            // Single selection - clear others
                            state.selection = { [rowId]: true };
                        } else {
                            // Multi selection
                            const currentCount = Object.keys(state.selection).length;

                            // Check max selections
                            if (maxSelections > 0 && currentCount >= maxSelections) {
                                return; // Don't select if limit reached
                            }

                            state.selection[rowId] = true;
                        }
                    }
                });
            },

            toggleAll: (rowIds: string[]) => {
                set((state) => {
                    const allSelected = rowIds.every(id => state.selection[id]);

                    if (allSelected) {
                        // Deselect all
                        rowIds.forEach(id => {
                            delete state.selection[id];
                        });
                    } else {
                        // Select all (respecting multi-selection and max)
                        if (!enableMultiRowSelection) {
                            // Single selection - select first only
                            state.selection = rowIds.length > 0 ? { [rowIds[0]]: true } : {};
                        } else {
                            // Multi selection
                            const idsToSelect = maxSelections > 0
                                ? rowIds.slice(0, maxSelections)
                                : rowIds;

                            idsToSelect.forEach(id => {
                                state.selection[id] = true;
                            });
                        }
                    }
                });
            },

            selectRows: (rowIds: string[]) => {
                set((state) => {
                    // REPLACE selection (not merge) - required for deselect to work
                    if (!enableMultiRowSelection) {
                        // Single selection - select last one
                        state.selection = rowIds.length > 0
                            ? { [rowIds[rowIds.length - 1]]: true }
                            : {};
                    } else {
                        // Multi selection - clear first, then set only the new ids
                        const idsToSelect = maxSelections > 0
                            ? rowIds.slice(0, maxSelections)
                            : rowIds;

                        state.selection = {};
                        idsToSelect.forEach(id => {
                            state.selection[id] = true;
                        });
                    }
                });
            },

            deselectRows: (rowIds: string[]) => {
                set((state) => {
                    rowIds.forEach(id => {
                        delete state.selection[id];
                    });
                });
            },

            clearSelection: () => {
                set((state) => {
                    state.selection = {};
                });
            },

            // Getters (derived state)
            getSelectedIds: () => {
                return Object.keys(get().selection).filter(id => get().selection[id]);
            },

            getSelectedCount: () => {
                return Object.keys(get().selection).filter(id => get().selection[id]).length;
            },

            isRowSelected: (rowId: string) => {
                return !!get().selection[rowId];
            },

            areAllSelected: (rowIds: string[]) => {
                if (rowIds.length === 0) return false;
                return rowIds.every(id => get().selection[id]);
            },

            areSomeSelected: (rowIds: string[]) => {
                if (rowIds.length === 0) return false;
                const selectedInPage = rowIds.filter(id => get().selection[id]);
                return selectedInPage.length > 0 && selectedInPage.length < rowIds.length;
            },
        }))
    );
}

/**
 * Store instance cache
 */
const selectionStoreCache = new Map<string, ReturnType<typeof createSelectionStore>>();

/**
 * Get or create a selection store for a table
 * 
 * @example
 * const store = getSelectionStore('users-table');
 * const selection = store(state => state.selection);
 */
export function getSelectionStore(
    tableId: string,
    options?: Partial<CreateSelectionStoreOptions>
) {
    if (!selectionStoreCache.has(tableId)) {
        selectionStoreCache.set(
            tableId,
            createSelectionStore({
                tableId,
                ...options,
            })
        );
    }

    return selectionStoreCache.get(tableId)!;
}

/**
 * Clear selection store cache
 */
export function clearSelectionStoreCache() {
    selectionStoreCache.clear();
}
