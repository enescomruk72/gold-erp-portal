/**
 * Sorting URL State Hook
 * 
 * Manages sorting state in URL using nuqs.
 * Syncs with TanStack Table sorting state format.
 */

'use client';

import { useCallback, useMemo } from 'react';
import { parseAsString, useQueryState } from 'nuqs';
import type { SortingState } from '../../../types';
import { URL_PARAMS, SORT_DIRECTIONS } from '../../../config';
import { serializeSorting, deserializeSorting } from '../../../utils/query';

/**
 * useSorting Hook
 * 
 * Backend format: ?sortBy=name&sortOrder=asc
 * TanStack Table format: [{ id: 'name', desc: false }]
 * 
 * @example
 * ```tsx
 * const sorting = useSorting();
 * 
 * // Get current sorting
 * console.log(sorting.value); // [{ id: 'name', desc: false }]
 * 
 * // Set sorting
 * sorting.set([{ id: 'email', desc: true }]);
 * 
 * // Toggle column sort
 * sorting.toggle('name'); // none → asc → desc → none
 * 
 * // Clear sorting
 * sorting.clear();
 * ```
 */
export function useSorting(prefix: string = '') {
    const paramName = prefix ? `${prefix}_${URL_PARAMS.SORT}` : URL_PARAMS.SORT;

    // URL state: "name:asc,email:desc"
    const [sortString, setSortString] = useQueryState(
        paramName,
        parseAsString.withDefault('')
    );

    // Convert URL string → TanStack Table format
    const value = useMemo<SortingState[]>(() => {
        if (!sortString || !sortString.trim()) {
            return [];
        }
        return deserializeSorting(sortString);
    }, [sortString]);

    // Set sorting (TanStack Table format → URL string)
    const set = useCallback(
        (sorting: SortingState[] | ((prev: SortingState[]) => SortingState[])) => {
            const newSorting = typeof sorting === 'function' ? sorting(value) : sorting;

            if (newSorting.length === 0) {
                setSortString(null); // Clear URL param
            } else {
                const serialized = serializeSorting(newSorting);
                setSortString(serialized);
            }
        },
        [value, setSortString]
    );

    // Toggle column sort: none → asc → desc → none
    const toggle = useCallback(
        (columnId: string) => {
            const currentSort = value.find((s) => s.id === columnId);

            if (!currentSort) {
                // None → Asc
                set([{ id: columnId, desc: false }]);
            } else if (!currentSort.desc) {
                // Asc → Desc
                set([{ id: columnId, desc: true }]);
            } else {
                // Desc → None
                set([]);
            }
        },
        [value, set]
    );

    // Clear all sorting
    const clear = useCallback(() => {
        setSortString(null);
    }, [setSortString]);

    // Get current sort direction for a column
    const getSortDirection = useCallback(
        (columnId: string): 'asc' | 'desc' | false => {
            const sort = value.find((s) => s.id === columnId);
            if (!sort) return false;
            return sort.desc ? 'desc' : 'asc';
        },
        [value]
    );

    // Check if a column is sorted
    const isSorted = useCallback(
        (columnId: string): boolean => {
            return value.some((s) => s.id === columnId);
        },
        [value]
    );

    return {
        /** Current sorting state (TanStack Table format) */
        value,

        /** Set sorting */
        set,

        /** Toggle column sort (none → asc → desc → none) */
        toggle,

        /** Clear all sorting */
        clear,

        /** Get sort direction for a column */
        getSortDirection,

        /** Check if a column is sorted */
        isSorted,

        /** Raw URL string (for debugging) */
        rawValue: sortString,
    };
}

/**
 * Type for useSorting return value
 */
export type UseSortingReturn = ReturnType<typeof useSorting>;
