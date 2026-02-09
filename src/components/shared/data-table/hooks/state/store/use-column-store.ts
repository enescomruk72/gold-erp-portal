/**
 * Use Column Store Hook
 * 
 * React hook wrapper for column store.
 * Provides easy access to column preferences state and actions.
 */

import { useMemo } from 'react';
import { getColumnStore } from './create-column-store';
import type { ColumnStoreState } from '@/components/shared/data-table/types';

/**
 * Hook to access column store for a specific table
 * 
 * @example
 * // Full store access
 * const columnStore = useColumnStore('users-table');
 * 
 * // Selective access (optimized)
 * const visibility = useColumnStore('users-table', state => state.visibility);
 * const toggleVisibility = useColumnStore('users-table', state => state.toggleVisibility);
 * 
 * @example
 * // With options
 * const columnStore = useColumnStore('users-table', undefined, {
 *   defaultOrder: ['email', 'name', 'role']
 * });
 */
export function useColumnStore<T = ColumnStoreState>(
    tableId: string,
    selector?: (state: ColumnStoreState) => T,
    options?: {
        persist?: boolean;
        defaultVisibility?: Record<string, boolean>;
        defaultOrder?: string[];
        defaultSizing?: Record<string, number>;
        defaultPinning?: { left: string[]; right: string[] };
    }
): T {
    // Get or create store (memoized)
    const store = useMemo(() => getColumnStore(tableId, options), [tableId, options]);

    // Use selector if provided, otherwise return full state
    return selector ? store(selector) : (store() as T);
}

/**
 * Hook for column visibility only
 * 
 * @example
 * const { visibility, toggleVisibility, setVisibility } = useColumnVisibility('users-table');
 */
export function useColumnVisibility(tableId: string) {
    const visibility = useColumnStore(tableId, (state) => state.visibility);
    const toggleVisibility = useColumnStore(tableId, (state) => state.toggleVisibility);
    const setVisibility = useColumnStore(tableId, (state) => state.setVisibility);

    return {
        visibility,
        toggleVisibility,
        setVisibility,
    };
}

/**
 * Hook for column order only
 * 
 * @example
 * const { order, setOrder, moveColumn } = useColumnOrder('users-table');
 */
export function useColumnOrder(tableId: string) {
    const order = useColumnStore(tableId, (state) => state.order);
    const setOrder = useColumnStore(tableId, (state) => state.setOrder);
    const moveColumn = useColumnStore(tableId, (state) => state.moveColumn);

    return {
        order,
        setOrder,
        moveColumn,
    };
}

/**
 * Hook for column sizing only
 * 
 * @example
 * const { sizing, setSize, setSizing } = useColumnSizing('users-table');
 */
export function useColumnSizing(tableId: string) {
    const sizing = useColumnStore(tableId, (state) => state.sizing);
    const setSize = useColumnStore(tableId, (state) => state.setSize);
    const setSizing = useColumnStore(tableId, (state) => state.setSizing);

    return {
        sizing,
        setSize,
        setSizing,
    };
}

/**
 * Hook for column pinning only
 * 
 * @example
 * const { pinning, pinLeft, pinRight, unpin } = useColumnPinning('users-table');
 */
export function useColumnPinning(tableId: string) {
    const pinning = useColumnStore(tableId, (state) => state.pinning);
    const pinLeft = useColumnStore(tableId, (state) => state.pinLeft);
    const pinRight = useColumnStore(tableId, (state) => state.pinRight);
    const unpin = useColumnStore(tableId, (state) => state.unpin);
    const setPinning = useColumnStore(tableId, (state) => state.setPinning);

    return {
        pinning,
        pinLeft,
        pinRight,
        unpin,
        setPinning,
    };
}

/**
 * Hook to reset column preferences
 * 
 * @example
 * const reset = useResetColumnStore('users-table');
 * reset(); // Resets to defaults
 */
export function useResetColumnStore(tableId: string) {
    return useColumnStore(tableId, (state) => state.reset);
}

/**
 * Hook to check if store is hydrated
 * Useful for preventing hydration mismatches
 * 
 * @example
 * const hydrated = useColumnStoreHydrated('users-table');
 * if (!hydrated) return <Skeleton />;
 */
export function useColumnStoreHydrated(tableId: string) {
    return useColumnStore(tableId, (state) => state.hydrated);
}
