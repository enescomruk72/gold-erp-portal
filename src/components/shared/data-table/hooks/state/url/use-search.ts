/**
 * Search URL State Hook
 * 
 * Manages global search state in URL using nuqs with debouncing.
 * Optimizes API calls by delaying search until user stops typing.
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import { parseAsString, useQueryState } from 'nuqs';
import type { SearchState } from '../../../types';
import { URL_PARAMS, SEARCH_DEBOUNCE_DELAY } from '../../../config';

/**
 * useSearch Hook
 * 
 * Backend format: ?search=john
 * Debounce: 300ms (configurable)
 * 
 * @example
 * ```tsx
 * const search = useSearch();
 * 
 * // Get current search (debounced)
 * console.log(search.debouncedValue); // 'john' (used for API calls)
 * 
 * // Get immediate value (for input)
 * console.log(search.value); // 'john doe' (typing in progress)
 * 
 * // Set search
 * search.set('new search');
 * 
 * // Clear search
 * search.clear();
 * 
 * // Check if searching
 * console.log(search.isSearching); // true (while debouncing)
 * ```
 */
export function useSearch(
    prefix: string = '',
    debounceMs: number = SEARCH_DEBOUNCE_DELAY
) {
    const paramName = prefix ? `${prefix}_${URL_PARAMS.SEARCH}` : URL_PARAMS.SEARCH;

    // URL state (debounced)
    const [urlSearch, setUrlSearch] = useQueryState(
        paramName,
        parseAsString.withDefault('')
    );

    // Local state (immediate, for input)
    const [localSearch, setLocalSearch] = useState<string>(urlSearch || '');

    // Debounce: Update URL after user stops typing
    useEffect(() => {
        const timer = setTimeout(() => {
            // Only update URL if value changed
            if (localSearch !== urlSearch) {
                if (localSearch.trim() === '') {
                    setUrlSearch(null); // Clear URL param
                } else {
                    setUrlSearch(localSearch);
                }
            }
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [localSearch, urlSearch, setUrlSearch, debounceMs]);

    // Set search (immediate, will debounce before URL update)
    const set = useCallback((search: string) => {
        setLocalSearch(search);
    }, []);

    // Clear search
    const clear = useCallback(() => {
        setLocalSearch('');
        setUrlSearch(null);
    }, [setUrlSearch]);

    // Is searching? (debouncing in progress)
    const isSearching = localSearch !== urlSearch;

    return {
        /** Current search value (immediate, for input binding) */
        value: localSearch as SearchState,

        /** Debounced search value (for API calls) */
        debouncedValue: urlSearch as SearchState,

        /** Set search (will debounce) */
        set,

        /** Clear search */
        clear,

        /** Is debouncing? */
        isSearching,

        /** Has active search? */
        hasSearch: Boolean(urlSearch && urlSearch.trim()),
    };
}

/**
 * Type for useSearch return value
 */
export type UseSearchReturn = ReturnType<typeof useSearch>;
