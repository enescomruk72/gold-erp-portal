/**
 * State Types
 * 
 * Type definitions for URL state (nuqs) and client state (Zustand).
 */

import type { SortingState, PaginationState, SearchState, FilterState, ColumnPreferences, SelectionState } from './table.types';

/**
 * ============================================
 * URL STATE (nuqs)
 * ============================================
 */

/**
 * URL state parser types
 */
export interface URLStateParser<T> {
    parse: (value: string | null) => T;
    serialize: (value: T) => string | null;
}

/**
 * Sorting URL state
 */
export interface SortingURLState {
    value: SortingState[];
    set: (sorting: SortingState[]) => void;
    toggle: (columnId: string) => void;
    clear: () => void;
}

/**
 * Pagination URL state
 */
export interface PaginationURLState {
    value: PaginationState;
    set: (pagination: PaginationState) => void;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    nextPage: () => void;
    previousPage: () => void;
    canNextPage: boolean;
    canPreviousPage: boolean;
}

/**
 * Search URL state
 */
export interface SearchURLState {
    value: SearchState;
    set: (search: string) => void;
    clear: () => void;
    debouncedValue: SearchState; // For debounced search
}

/**
 * Filter URL state
 */
export interface FilterURLState {
    value: FilterState[];
    set: (filters: FilterState[]) => void;
    setFilter: (columnId: string, value: unknown) => void;
    clearFilter: (columnId: string) => void;
    clearAll: () => void;
}

/**
 * ============================================
 * ZUSTAND STORE STATE
 * ============================================
 */

/**
 * Column store state (visibility, order, sizing, pinning)
 */
export interface ColumnStoreState extends ColumnPreferences {
    /** Table ID this store belongs to */
    tableId: string;

    /** Actions */
    toggleVisibility: (columnId: string) => void;
    setVisibility: (visibility: Record<string, boolean>) => void;

    setOrder: (order: string[]) => void;
    moveColumn: (fromIndex: number, toIndex: number) => void;

    setSize: (columnId: string, size: number) => void;
    setSizing: (sizing: Record<string, number>) => void;

    pinLeft: (columnId: string) => void;
    pinRight: (columnId: string) => void;
    unpin: (columnId: string) => void;
    setPinning: (pinning: { left: string[]; right: string[] }) => void;

    reset: () => void;

    /** Persistence */
    hydrated: boolean;
}

/**
 * Selection store state (row selection)
 */
export interface SelectionStoreState {
    /** Table ID this store belongs to */
    tableId: string;

    /** Selection state */
    selection: SelectionState;

    /** Actions */
    toggleRow: (rowId: string) => void;
    toggleAll: (rowIds: string[]) => void;
    selectRows: (rowIds: string[]) => void;
    deselectRows: (rowIds: string[]) => void;
    clearSelection: () => void;

    /** Derived getters */
    getSelectedIds: () => string[];
    getSelectedCount: () => number;
    isRowSelected: (rowId: string) => boolean;
    areAllSelected: (rowIds: string[]) => boolean;
    areSomeSelected: (rowIds: string[]) => boolean;
}

/**
 * ============================================
 * STORE FACTORY OPTIONS
 * ============================================
 */

/**
 * Options for creating a column store
 */
export interface CreateColumnStoreOptions {
    tableId: string;
    persist?: boolean;
    defaultVisibility?: Record<string, boolean>;
    defaultOrder?: string[];
    defaultSizing?: Record<string, number>;
    defaultPinning?: { left: string[]; right: string[] };
}

/**
 * Options for creating a selection store
 */
export interface CreateSelectionStoreOptions {
    tableId: string;
    enableMultiRowSelection?: boolean;
    maxSelections?: number;
}

/**
 * ============================================
 * PERSISTENCE
 * ============================================
 */

/**
 * Persisted state shape
 */
export interface PersistedColumnPreferences {
    visibility: Record<string, boolean>;
    order: string[];
    sizing: Record<string, number>;
    pinning: { left: string[]; right: string[] };
    version: number; // For migration
    updatedAt: number; // Timestamp
}

/**
 * Storage adapter interface
 */
export interface StorageAdapter {
    getItem: (key: string) => string | null | Promise<string | null>;
    setItem: (key: string, value: string) => void | Promise<void>;
    removeItem: (key: string) => void | Promise<void>;
}

/**
 * Persistence options
 */
export interface PersistOptions {
    /** Storage key prefix */
    name: string;

    /** Storage adapter (defaults to localStorage) */
    storage?: StorageAdapter;

    /** Version for migration */
    version?: number;

    /** Migrate function */
    migrate?: (persistedState: unknown, version: number) => PersistedColumnPreferences;

    /** Merge strategy */
    merge?: (persistedState: PersistedColumnPreferences, currentState: ColumnPreferences) => ColumnPreferences;
}

/**
 * ============================================
 * HYDRATION
 * ============================================
 */

/**
 * Hydration state
 */
export interface HydrationState {
    hydrated: boolean;
    rehydrating: boolean;
}

/**
 * Hydration options
 */
export interface HydrationOptions {
    /** Skip hydration */
    skipHydration?: boolean;

    /** On hydrate callback */
    onHydrate?: (state: ColumnPreferences) => void;

    /** On rehydrate callback */
    onRehydrate?: (state: ColumnPreferences) => void;
}
