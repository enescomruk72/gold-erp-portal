/**
 * Filters URL State Hook
 * 
 * Manages column filters state in URL using nuqs.
 * Syncs with TanStack Table filtering state format.
 * 
 * ⚠️ FUTURE FEATURE - Foundation ready, UI pending
 */

'use client';

import { useCallback, useMemo } from 'react';
import { parseAsString, useQueryState } from 'nuqs';
import type { FilterState } from '../../../types';
import { URL_PARAMS } from '../../../config';
import { serializeFilters, deserializeFilters } from '../../../utils/query';

/**
 * useFilters Hook
 * 
 * Backend format: ?filters=status:eq:active|role:in:admin,user
 * TanStack Table format: [{ id: 'status', value: 'active', operator: 'eq' }]
 * 
 * @example
 * ```tsx
 * const filters = useFilters();
 * 
 * // Get current filters
 * console.log(filters.value); // [{ id: 'status', value: 'active', operator: 'eq' }]
 * 
 * // Set filters
 * filters.set([
 *   { id: 'status', value: 'active', operator: 'eq' },
 *   { id: 'role', value: ['admin', 'user'], operator: 'in' }
 * ]);
 * 
 * // Set single filter
 * filters.setFilter('status', 'active', 'eq');
 * 
 * // Clear single filter
 * filters.clearFilter('status');
 * 
 * // Clear all filters
 * filters.clearAll();
 * ```
 */
export function useFilters(prefix: string = '') {
    const paramName = prefix ? `${prefix}_${URL_PARAMS.FILTERS}` : URL_PARAMS.FILTERS;

    // URL state: "status:eq:active|role:in:admin,user"
    const [filtersString, setFiltersString] = useQueryState(
        paramName,
        parseAsString.withDefault('')
    );

    // Convert URL string → TanStack Table format
    const value = useMemo<FilterState[]>(() => {
        if (!filtersString || !filtersString.trim()) {
            return [];
        }
        return deserializeFilters(filtersString);
    }, [filtersString]);

    // Set filters (TanStack Table format → URL string)
    const set = useCallback(
        (filters: FilterState[] | ((prev: FilterState[]) => FilterState[])) => {
            const newFilters = typeof filters === 'function' ? filters(value) : filters;

            if (newFilters.length === 0) {
                setFiltersString(null); // Clear URL param
            } else {
                const serialized = serializeFilters(newFilters);
                setFiltersString(serialized);
            }
        },
        [value, setFiltersString]
    );

    // Set single filter
    const setFilter = useCallback(
        (columnId: string, filterValue: unknown, operator: FilterState['operator'] = 'eq') => {
            // Remove existing filter for this column
            const filtered = value.filter((f) => f.id !== columnId);

            // Add new filter
            const newFilters = [...filtered, { id: columnId, value: filterValue, operator }];

            set(newFilters);
        },
        [value, set]
    );

    // Clear single filter
    const clearFilter = useCallback(
        (columnId: string) => {
            const filtered = value.filter((f) => f.id !== columnId);
            set(filtered);
        },
        [value, set]
    );

    // Clear all filters
    const clearAll = useCallback(() => {
        setFiltersString(null);
    }, [setFiltersString]);

    // Get filter for a column
    const getFilter = useCallback(
        (columnId: string): FilterState | undefined => {
            return value.find((f) => f.id === columnId);
        },
        [value]
    );

    // Check if a column is filtered
    const isFiltered = useCallback(
        (columnId: string): boolean => {
            return value.some((f) => f.id === columnId);
        },
        [value]
    );

    // Get active filters count
    const activeCount = useMemo(() => value.length, [value.length]);

    return {
        /** Current filters state (TanStack Table format) */
        value,

        /** Set filters */
        set,

        /** Set single filter */
        setFilter,

        /** Clear single filter */
        clearFilter,

        /** Clear all filters */
        clearAll,

        /** Get filter for a column */
        getFilter,

        /** Check if a column is filtered */
        isFiltered,

        /** Active filters count */
        activeCount,

        /** Has active filters? */
        hasFilters: activeCount > 0,

        /** Raw URL string (for debugging) */
        rawValue: filtersString,
    };
}

/**
 * Type for useFilters return value
 */
export type UseFiltersReturn = ReturnType<typeof useFilters>;
